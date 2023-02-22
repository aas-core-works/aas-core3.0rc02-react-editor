/**
 * Verify continuously the environment.
 *
 * @remarks
 * We consider verification to be ephemeral, and therefore store it *outside*
 * the main application state (which resides in {@link model}).
 *
 * The current design follows the principle that we might not be able to
 * verify the whole environment at once as size of the environment might
 * be overwhelming. At the same time, we can not verify the whole environment
 * on *every* change, even when the environments are rather small.
 *
 * To address these two non-functional constraints, we queue
 * instances of the model for the verification on every change. We continuously
 * process this queue on best-effort basis.
 *
 * Assuming that the user is most interested to get feedback on most recent
 * changes, we prioritize the verification of instances which changed *last*.
 *
 * To avoid clogging the application in face of too many errors, we cap
 * the number of errors to an arbitrary constant, and stop the verification
 * at that point. The verification then resumes again on new changes.
 */

import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as valtio from "valtio";

import * as debugconf from "./debugconf";
import * as enhancing from "./enhancing.generated";
import * as model from "./model";

/**
 * Allow version property for subscriptions.
 */
class Versioning {
  version = 0;
}

class TimestampedInstance {
  constructor(public instance: aas.types.Class, public timestamp: number) {
    // Intentionally empty.
  }
}

/**
 * Map the priorities for the verification.
 */
class VerificationMap {
  // NOTE (mristin, 2023-02-10): Why our IDs?
  // We have to use our IDs here since valtio messes up the references to
  // the objects. Namely, when we subscribe to change notifications,
  // we get different reference if we follow the change path from an environment
  // (which returns a proxy wrapper instead of the target object), and the value
  // in the notification itself (which returns the target object).

  // ourId -> enqueued instance, timestamp of the change
  private readonly map = new Map<string, TimestampedInstance>();
  readonly versioning: Versioning = valtio.proxy(new Versioning());

  /**
   * Enqueue the instances for verification with the timestamp of
   * the instance change.
   *
   * @remarks
   * If the timestamp is older than the timestamp already in the verification
   * map, ignore the set operation.
   *
   * We have to update the map in bulk so that we do not waste version numbers.
   * Otherwise, we might overflow very soon when dealing with very large
   * environments.
   *
   * @param instances to be enqueued
   * @param timestamp when they were modified
   */
  update(
    instances: IterableIterator<aas.types.Class>,
    timestamp: number
  ): void {
    let shouldBumpVersion = false;
    for (const instance of instances) {
      // NOTE (mristin, 2023-02-10):
      // This check is necessary here since it is a nightmare to debug
      // valtio otherwise. If we ever get a non-proxy in the container,
      // the relative paths will not properly trigger the downstream changes!
      //
      // See: https://github.com/pmndrs/valtio/discussions/473
      if (typeof valtio.getVersion(instance) !== "number") {
        console.error(
          "Expected all the instances to be valtio proxies when updating " +
            "the verification map, but got a non-proxy instance.",
          instance.constructor.name,
          instance
        );
        throw new Error("Assertion violation");
      }

      const ourId = model.getOurId(instance);

      const prevEntry = this.map.get(ourId);
      if (prevEntry !== undefined) {
        if (prevEntry.timestamp < timestamp) {
          this.map.set(ourId, new TimestampedInstance(instance, timestamp));
          shouldBumpVersion = true;
        }
      } else {
        this.map.set(ourId, new TimestampedInstance(instance, timestamp));
        shouldBumpVersion = true;
      }
    }

    if (shouldBumpVersion) {
      this.versioning.version++;
    }
  }

  /**
   * Dequeue the instances from the verification.
   *
   * @remarks
   * We have to update the map in bulk so that we do not waste version numbers.
   * Otherwise, we might overflow very soon when dealing with very large
   * environments.
   *
   * @param instances to be removed from the verification map.
   */
  remove(instances: IterableIterator<aas.types.Class>): void {
    let shouldBumpVersion = false;
    for (const instance of instances) {
      const removed = this.map.delete(model.getOurId(instance));
      if (removed) {
        shouldBumpVersion = true;
      }
    }

    if (shouldBumpVersion) {
      this.versioning.version++;
    }
  }

  overTimestampedInstances(): IterableIterator<TimestampedInstance> {
    return this.map.values();
  }

  get empty(): boolean {
    return this.map.size == 0;
  }

  get size(): number {
    return this.map.size;
  }
}

/**
 * Map the errors to the corresponding instances.
 */
class ErrorMap {
  // NOTE (mristin, 2023-02-10):
  // See the note "Why our IDs?" for why we use our IDs here as the key.

  readonly versioning: Versioning = valtio.proxy(new Versioning());

  private _errorCount = 0;

  get errorCount(): number {
    return this._errorCount;
  }

  assertErrorCountCorrect(root: aas.types.Class): void {
    let expectedErrorCount = 0;

    expectedErrorCount += model.getErrorSet(root).size;

    for (const instance of root.descend()) {
      expectedErrorCount += model.getErrorSet(instance).size;
    }

    if (expectedErrorCount !== this.errorCount) {
      console.error(
        `Counted ${expectedErrorCount} actual error(s), ` +
          `but errorCount is ${this.errorCount}`
      );
      throw new Error("Assertion violation");
    }
  }

  /**
   * Mark the instance with errors.
   *
   * @param instance causing the errors
   * @param errors discovered in the verification
   */
  mark(
    instance: aas.types.Class,
    errors: IterableIterator<enhancing.TimestampedError>
  ) {
    let shouldBumpVersion = false;
    const errorSet = model.getErrorSet(instance);

    if (errorSet.size > 0) {
      this._errorCount -= errorSet.size;
      shouldBumpVersion = true;
      errorSet.clear();
    }

    let observedNewErrors = false;
    for (const error of errors) {
      if (debugconf.DEBUG_WITH_INVARIANTS) {
        if (error.instance !== instance) {
          console.error(
            "The given error should have been associated with the given " +
              "instance, but it was not",
            instance,
            error
          );
          throw new Error("Assertion violation");
        }
      }

      observedNewErrors = true;
      shouldBumpVersion = true;
      this._errorCount++;

      errorSet.add(error);
    }

    if (!observedNewErrors) {
      // Since there are no errors, we have to *remove* the instance
      // in the records of the antecedents.
      for (const antecedent of overAntecedents(instance)) {
        model.getDescendantsWithErrors(antecedent).delete(instance);
      }
    } else {
      for (const antecedent of overAntecedents(instance)) {
        model.getDescendantsWithErrors(antecedent).add(instance);
      }
    }

    if (shouldBumpVersion) {
      this.versioning.version++;
    }
  }

  /**
   * Unmark the instances from errors.
   *
   * @param instances to be unmarked.
   */
  unmark(instances: IterableIterator<aas.types.Class>): void {
    let shouldBumpVersion = false;
    for (const instance of instances) {
      const errorSet = model.getErrorSet(instance);

      if (errorSet.size > 0) {
        this._errorCount -= errorSet.size;
        errorSet.clear();

        // Update now the antecedents
        for (const antecedent of overAntecedents(instance)) {
          model.getDescendantsWithErrors(antecedent).delete(instance);
        }

        shouldBumpVersion = true;
      }
    }

    if (shouldBumpVersion) {
      this.versioning.version++;
    }
  }

  /**
   * Collect all the errors from the `root` and its descendants.
   *
   * @param root where the collection starts
   */
  *collect(
    root: aas.types.Class
  ): IterableIterator<enhancing.TimestampedError> {
    yield* model.getErrorSet(root);

    for (const descendent of model.getDescendantsWithErrors(root)) {
      yield* model.getErrorSet(descendent);
    }
  }
}

function* overAntecedents(
  instance: aas.types.Class
): IterableIterator<aas.types.Class> {
  let cursor: aas.types.Class | null = model.getParent(instance);

  while (true) {
    if (cursor === null) {
      break;
    }

    // We add this runtime type check here since it is a nightmare to debug
    // valtio proxies otherwise.
    if (!(cursor instanceof aas.types.Class)) {
      console.error("Expected an instance, but got something else", cursor);
      throw new Error("Assertion violated");
    }

    yield cursor;
    cursor = model.getParent(cursor);
  }
}

function* overInstanceAndAntecedents(
  instance: aas.types.Class
): IterableIterator<aas.types.Class> {
  yield* overAntecedents(instance);
  yield instance;
}

function* overInstanceAndDescendants(
  instance: aas.types.Class
): IterableIterator<aas.types.Class> {
  yield instance;
  yield* instance.descend();
}

export class Verification {
  verificationMap = new VerificationMap();
  errorMap = new ErrorMap();

  /**
   * Updated every time a relative path in the environment changes.
   */
  instancesPathVersioning = valtio.proxy(new Versioning());

  /**
   * Enqueue the `instance` and all its antecedents for verification.
   *
   * @remarks
   * All the errors associated with the instance and its antecedents are removed,
   * as we have just changed the instance and consequently its antecedents,
   * and need to re-verify them.
   *
   * This function is tightly related with {@link plopDownFromVerification}
   *
   * @param instance to be verified
   * @param timestamp of the change
   */
  bubbleUpForVerification(instance: aas.types.Class, timestamp: number): void {
    this.verificationMap.update(
      overInstanceAndAntecedents(instance),
      timestamp
    );

    this.errorMap.unmark(overInstanceAndAntecedents(instance));
  }

  /**
   * Remove the instance and its descendents from the verification and error maps.
   *
   * @remarks
   * This should be called whenever an instance is removed from the environment,
   * so that we show as few phantom errors as possible.
   *
   * @param instance that was removed from the environment
   */
  plopDownFromVerification(instance: aas.types.Class) {
    this.verificationMap.remove(overInstanceAndDescendants(instance));
    this.errorMap.unmark(overInstanceAndDescendants(instance));
  }
}

/**
 * Convert the path coming from {@link aas.verification} to an array of
 * strings and integers.
 *
 * @param aasVerificationPath to be converted
 * @return path segments as integers (index access) or strings (property access)
 */
function aasVerificationPathToArrayOfPrimitives(
  aasVerificationPath: aas.verification.Path
): Array<number | string> {
  const result = [];
  for (const segment of aasVerificationPath.segments) {
    if (segment instanceof aas.verification.IndexSegment) {
      result.push(segment.index);
    } else if (segment instanceof aas.verification.PropertySegment) {
      result.push(segment.name);
    } else {
      console.error("Unexpected path segment", segment);
      throw new Error("Assertion violation");
    }
  }

  return result;
}

export class ContinuousVerification {
  private readonly verificationMap: VerificationMap;
  private readonly errorMap: ErrorMap;

  private started = false;
  private shouldStop = false;

  private readonly errorCap: number;

  private timeoutId: number | null = null;

  constructor(verification: Verification, errorCap: number) {
    this.verificationMap = verification.verificationMap;
    this.errorMap = verification.errorMap;
    this.errorCap = errorCap;
  }

  // NOTE (mristin, 2023-02-03):
  // We separate `start` into a public function and an implementation to enforce
  // that `start` can be only called once from the public interface, but
  // the private `_start` can be repeatedly called.
  private _start(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    // NOTE (mristin, 2023-02-03):
    // We run verification in async batches so that the main event loop
    // can "breathe" a bit. Otherwise, in face of large environments, we would
    // clog the event loop with a long bulk verification call.

    async function processSingleBatch() {
      const oldVerificationMapSize = context.verificationMap.size;

      // We have to collect the error count here as it might have might have
      // changed in the meanwhile, between the definition of this function
      // and its invocation. Remember, this is an async function.
      //
      // Once we collect the number here, we can be sure that the value will
      // not change any more, since JavaScript enforces every scope
      // to run until completion.
      //
      // See, e.g.: https://exploringjs.com/es6/ch_async.html
      // for an introduction.

      const previousErrorCount = context.errorMap.errorCount;
      if (previousErrorCount >= context.errorCap) {
        return;
      }

      if (context.verificationMap.empty) {
        return;
      }

      if (context.shouldStop) {
        return;
      }

      // Pick most recent verification requests

      const timestampedInstances = Array.from(
        context.verificationMap.overTimestampedInstances()
      );

      timestampedInstances.sort((that, other) => {
        // The most recent change comes first, hence the reversed order of
        // operands in the subtraction.
        return other.timestamp - that.timestamp;
      });

      const batch = timestampedInstances.slice(0, 100);

      const instancesToTimestampedErrors = new Array<
        [aas.types.Class, Array<enhancing.TimestampedError>]
      >();
      let countOfNewErrors = 0;

      let reachedTheCap = false;

      for (const { instance, timestamp } of batch) {
        const instanceErrors = new Array<enhancing.TimestampedError>();

        for (const error of aas.verification.verify(instance, false)) {
          instanceErrors.push(
            new enhancing.TimestampedError(
              error.message,
              instance,
              aasVerificationPathToArrayOfPrimitives(error.path),
              timestamp
            )
          );

          countOfNewErrors++;

          if (previousErrorCount + countOfNewErrors === context.errorCap) {
            reachedTheCap = true;
            break;
          }
        }

        if (instanceErrors.length > 0) {
          instancesToTimestampedErrors.push([instance, instanceErrors]);
        }

        if (reachedTheCap) {
          break;
        }
      }

      // Remove the instances from the verification queue since we processed
      // them.
      function* overInstances() {
        for (const timestampedInstance of timestampedInstances) {
          yield timestampedInstance.instance;
        }
      }

      context.verificationMap.remove(overInstances());

      // Mark the instances with timestamped errors
      for (const [instance, instanceErrors] of instancesToTimestampedErrors) {
        context.errorMap.mark(instance, instanceErrors.values());
      }

      if (context.verificationMap.size >= oldVerificationMapSize) {
        console.error(
          `Expected the verification map to shrink once a single process ` +
            `batch has been processed, but it does not. ` +
            `Old size: ${oldVerificationMapSize}, ` +
            `current size after processing: ${context.verificationMap.size}`
        );
        throw new Error("Assertion violation");
      }
    }

    async function verifyInBatches() {
      while (
        !context.shouldStop &&
        !context.verificationMap.empty &&
        context.errorMap.errorCount < context.errorCap
      ) {
        await processSingleBatch();
      }
    }

    Promise.resolve()
      .then(verifyInBatches)
      .then(() => {
        // Give verification some break to allow the user to change something
        if (context.timeoutId !== null) {
          clearTimeout(context.timeoutId);
          context.timeoutId = null;
        }

        context.timeoutId = setTimeout(() => {
          context._start();
        }, 2 * 1000);
      })
      .catch((error) => {
        context.stop();
        console.error(
          "Something went wrong in verifyInBatches.",
          typeof error,
          error
        );
        throw error;
      });
  }

  start(): void {
    if (this.started) {
      console.error(
        "(mristin, 2023-02-03)\n" +
          "The continuous verification should be started only once, but you " +
          "tried to start it multiple times. " +
          "Multiple starts are much more difficult to debug, so we disable " +
          "them only for that purpose. Theoretically, though, multiple starts " +
          "should be possible, but we haven't tested them."
      );
      throw new Error("Assertion violation");
    }

    this._start();
    this.started = true;
  }

  stop() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
    this.shouldStop = true;
  }
}

function isPrimitiveOrNull(
  something: unknown
): something is boolean | number | string | Uint8Array | null {
  if (something === null) return true;

  return (
    typeof something === "boolean" ||
    typeof something === "number" ||
    typeof something === "string" ||
    something instanceof Uint8Array
  );
}

function isInstanceOrNull(
  something: unknown
): something is aas.types.Class | null {
  if (something === null) return true;

  return something instanceof aas.types.Class;
}

function isArrayOfInstancesOrNull(
  something: unknown
): something is Array<aas.types.Class> | null {
  if (something === null) {
    return true;
  }

  if (!(something instanceof Array)) {
    return false;
  }

  for (const item of something) {
    if (!(item instanceof aas.types.Class)) {
      return false;
    }
  }
  return true;
}

function followPathInEnvironment(
  environment: Readonly<aas.types.Environment>,
  pathInEnvironment: ReadonlyArray<string | symbol>
): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cursor: any = environment;

  // We skip the last element as it refers to the property which has been
  // changed.
  for (let i = 0; i < pathInEnvironment.length; i++) {
    if (typeof cursor !== "object") {
      console.error(
        `Expected objects as all references on the path, ` +
          `but got a non-object for segment ${String(pathInEnvironment[i])}`,
        cursor,
        pathInEnvironment
      );
      throw new Error("Assertion violation");
    }

    if (cursor === null) {
      console.error("Unexpected null cursor");
      throw new Error("Assertion violation");
    }

    cursor = cursor[pathInEnvironment[i]];
  }
  return cursor;
}

/**
 * Update the `pathVersion` if there is a change to any of the relative paths
 * from parent.
 *
 * @param environment environment under change
 * @param instancePathsVersioning to be updated
 * @param pathInEnvironment to the changed value
 * @param value new value after the change
 * @param previousValue value before the change
 */
export function updateRelativePathsOnStateChange(
  environment: Readonly<aas.types.Environment>,
  pathInEnvironment: ReadonlyArray<string | symbol>,
  value: unknown,
  previousValue: unknown,
  instancePathsVersioning: Versioning
) {
  // NOTE (mristin, 2023-02-10):
  // We ignore the changes to the enhancements as they react, but do not effect
  // the changes in the paths.
  for (const segment of pathInEnvironment) {
    if (segment === "_aasCoreEditorEnhancement") {
      return;
    }
  }

  if (
    isArrayOfInstancesOrNull(value) &&
    isArrayOfInstancesOrNull(previousValue)
  ) {
    // NOTE (mristin, 2023-02-10):
    // We have to take the proxy here. Otherwise, the changes to the relative
    // paths wouldn't be propagated.
    const arrayProxy = followPathInEnvironment(
      environment,
      pathInEnvironment
    ) as unknown as Array<aas.types.Class> | null;

    let bumpVersion = false;

    if (arrayProxy !== null) {
      for (let i = 0; i < arrayProxy.length; i++) {
        const mutablePathRelativeToParent = model.mutableRelativePathFromParent(
          arrayProxy[i]
        );

        if (mutablePathRelativeToParent.length !== 2) {
          console.error(
            "Expected exactly two segments in an item of a container, " +
              "but got something else",
            mutablePathRelativeToParent
          );
          throw new Error("Assertion violation");
        }

        if (mutablePathRelativeToParent[1] !== i) {
          mutablePathRelativeToParent[1] = i;
          bumpVersion = true;
        }
      }
    }

    if (bumpVersion) {
      instancePathsVersioning.version++;
    }
  }
}

/**
 * Propagate the change obtained from the subscription to the proxy to
 * the `verification`.
 *
 * @param environment at the time of the change
 * @param pathInEnvironment segments of properties to the changed value
 * @param value value after the change
 * @param previousValue value before the change
 * @param timestamp time point of the change
 * @param verification to be updated
 */
export function updateVerificationOnStateChange(
  environment: Readonly<aas.types.Environment>,
  pathInEnvironment: ReadonlyArray<string | symbol>,
  value: unknown,
  previousValue: unknown,
  timestamp: number,
  verification: Verification
): void {
  if (value === null && previousValue === null) {
    console.error(
      "Unexpected both value and previousValue null",
      pathInEnvironment
    );
    throw new Error("Assertion violation");
  }

  // NOTE (mristin, 2023-02-10):
  // We ignore the changes to the enhancements as we only verify the actual data
  // of the model.
  for (const segment of pathInEnvironment) {
    if (segment === "_aasCoreEditorEnhancement") {
      return;
    }
  }

  if (isPrimitiveOrNull(value) && isPrimitiveOrNull(previousValue)) {
    // NOTE (mristin, 2023-02-03):
    // Since the meta-model knows only instances and lists of class instances,
    // we know that a change in primitive value must be a a change on
    // the instance embedding that value.

    if (pathInEnvironment.length == 0) {
      console.error(
        "We should handle a change in primitive value, but the path is empty",
        value,
        previousValue
      );
      throw new Error("Assertion violated");
    }

    // We skip the last element as it refers to the property which has been
    // changed.
    const something = followPathInEnvironment(
      environment,
      pathInEnvironment.slice(0, -1)
    );

    if (something === null || !isInstanceOrNull(something)) {
      console.error(
        "Expected an instance, but got something else following the path",
        something,
        pathInEnvironment
      );
      throw new Error("Assertion violated");
    }

    verification.bubbleUpForVerification(something, timestamp);
  } else if (isInstanceOrNull(value) && isInstanceOrNull(previousValue)) {
    // NOTE (mristin, 2023-02-10):
    // We have to take the proxy here. Otherwise, the instances which we would
    // propagate for the verification wouldn't be proxies, but the actual
    // objects. Changes to the proxies would thus not be reflected in those
    // actual objects.
    const instanceProxy = followPathInEnvironment(
      environment,
      pathInEnvironment
    ) as unknown as aas.types.Class | null;

    if (instanceProxy !== null && !(instanceProxy instanceof aas.types.Class)) {
      console.error(
        "Expected instanceProxy to be an instance of aas.types.Class, " +
          "but it is not",
        instanceProxy
      );
      throw new Error("Assertion violation");
    }

    if (
      (instanceProxy === null && value !== null) ||
      (instanceProxy !== null && value == null)
    ) {
      console.error(
        "Expected value and instanceProxy to be in sync, " +
          "but one is null and the other is not",
        instanceProxy,
        value
      );
      throw new Error("Assertion violation");
    }

    // NOTE (mristin, 2023-02-03):
    // We assume here that the environment is an object tree where each instance
    // has exactly one parent. Hence, when a property referencing an instance
    // is set, the previous value can be assumed to be removed from
    // the environment.

    if (instanceProxy !== null) {
      // We added a new embedded instance.

      verification.bubbleUpForVerification(instanceProxy, timestamp);
    }

    if (previousValue !== null) {
      // We removed an existing embedded instance.

      const parent = model.getParent(previousValue);
      if (parent !== null) {
        verification.bubbleUpForVerification(parent, timestamp);
      }

      verification.plopDownFromVerification(previousValue);
    }
  } else if (
    isArrayOfInstancesOrNull(value) &&
    isArrayOfInstancesOrNull(previousValue)
  ) {
    // NOTE (mristin, 2023-02-10):
    // We have to take the proxy here. Otherwise, the instances which we would
    // propagate for the verification wouldn't be proxies, but the actual
    // objects. Changes to the proxies would thus not be reflected in those
    // actual objects.
    const arrayProxy = followPathInEnvironment(
      environment,
      pathInEnvironment
    ) as unknown as Array<aas.types.Class> | null;

    const valueSet: Set<aas.types.Class> =
      arrayProxy === null ? new Set() : new Set(arrayProxy);

    const previousValueSet: Set<aas.types.Class> =
      previousValue === null ? new Set() : new Set(previousValue);

    for (const instance of valueSet) {
      if (!previousValueSet.has(instance)) {
        verification.bubbleUpForVerification(instance, timestamp);
      }
    }

    for (const instance of previousValueSet) {
      if (!valueSet.has(instance)) {
        const parent = model.getParent(instance);
        if (parent !== null) {
          verification.bubbleUpForVerification(parent, timestamp);
        }

        verification.plopDownFromVerification(instance);
      }
    }
  } else {
    console.error(
      "Unhandled case of a change",
      value,
      previousValue,
      pathInEnvironment
    );
    throw new Error("Assertion violated");
  }
}

function compareErrorsByMessages(
  that: enhancing.TimestampedError,
  other: enhancing.TimestampedError
) {
  if (that.message === other.message) {
    return 0;
  }
  return that.message < other.message ? -1 : 1;
}

/**
 * Categorize instance errors into general instance errors and property errors.
 * @param errors to be categorized
 * @return `[instance errors, property name => errors]`
 */
export function categorizeInstanceErrors(
  errors: Iterable<enhancing.TimestampedError>
): [
  Array<enhancing.TimestampedError>,
  Map<string, Array<enhancing.TimestampedError>>
] {
  const instanceErrors = new Array<enhancing.TimestampedError>();
  const errorsByProperty = new Map<string, Array<enhancing.TimestampedError>>();

  for (const error of errors) {
    if (error.relativePathFromInstance.length === 0) {
      instanceErrors.push(error);
    } else if (
      error.relativePathFromInstance.length === 1 &&
      typeof error.relativePathFromInstance[0] === "string"
    ) {
      const propertyName = error.relativePathFromInstance[0];

      const thatErrors = errorsByProperty.get(propertyName);
      if (thatErrors === undefined) {
        errorsByProperty.set(propertyName, [error]);
      } else {
        thatErrors.push(error);
      }
    } else {
      console.error(
        "Unexpected instance error with a non-property",
        error.relativePathFromInstance,
        error
      );
      throw new Error("Assertion violation");
    }
  }

  instanceErrors.sort(compareErrorsByMessages);

  for (const propertyErrors of errorsByProperty.values()) {
    propertyErrors.sort(compareErrorsByMessages);
  }

  return [instanceErrors, errorsByProperty];
}
