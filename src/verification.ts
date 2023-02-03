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
import * as model from "./model";

/**
 * Allow version property for subscriptions.
 */
class Versioning {
  version = 0;
}

/**
 * Map the priorities for the verification.
 */
class VerificationMap {
  private readonly map = new Map<aas.types.Class, number>();
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
      // We add the check here for runtime types since bugs with valtio proxies
      // are really difficult to debug otherwise.
      if (!(instance instanceof aas.types.Class)) {
        console.error("Expected an instance, but got something else", instance);
        throw new Error("Assertion violated");
      }

      const prevTimestamp = this.map.get(instance);
      if (prevTimestamp === undefined || prevTimestamp < timestamp) {
        this.map.set(instance, timestamp);
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
      const removed = this.map.delete(instance);
      if (removed) {
        shouldBumpVersion = true;
      }
    }

    if (shouldBumpVersion) {
      this.versioning.version++;
    }
  }

  overInstancesWithTimestamps(): IterableIterator<[aas.types.Class, number]> {
    return this.map.entries();
  }

  get empty(): boolean {
    return this.map.size == 0;
  }

  get size(): number {
    return this.map.size;
  }
}

/**
 * Represent an error with a timestamp of the change.
 */
export class TimestampedError {
  constructor(
    public message: string,
    public path: Array<number | string>,
    public timestamp: number
  ) {}

  pathAsString(): string {
    if (this.path.length === 0) {
      return "";
    }

    // NOTE (2023-02-10):
    // See: https://stackoverflow.com/questions/16696632/most-efficient-way-to-concatenate-strings-in-javascript
    // for string concatenation.
    let result = "";

    for (const segment of this.path) {
      if (typeof segment === "string") {
        result += `.${segment}`;
      } else {
        result += `[${segment}]`;
      }
    }

    return result;
  }
}

function produceErrorKey(error: TimestampedError): string {
  return `${error.pathAsString()}: ${error.message}`;
}

/**
 * Map the errors to the corresponding instances.
 */
class ErrorMap {
  // instance -> (error key -> error)
  private readonly map = new Map<
    aas.types.Class,
    Map<string, TimestampedError>
  >();

  readonly versioning: Versioning = valtio.proxy(new Versioning());

  private _errorCount = 0;

  get errorCount(): number {
    return this._errorCount;
  }

  private assertErrorCountCorrect(): void {
    let expectedErrorCount = 0;
    for (const instanceErrors of this.map.values()) {
      expectedErrorCount += instanceErrors.size;
    }

    if (expectedErrorCount !== this.errorCount) {
      console.error(
        `Counted ${expectedErrorCount} actual errors, ` +
          `but errorCount is ${this.errorCount}`,
        this.map
      );
      throw new Error("Assertion violation");
    }
  }

  /**
   * Mark the error for each instance given its timestamp of the change.
   *
   * @remarks
   * If there are entries with the exactly same errors but different timestamps,
   * the more recent error is kept.
   *
   * We have to update the map in bulk so that we do not waste version numbers.
   * Otherwise, we might overflow very soon when dealing with very large
   * environments.
   *
   * @param instancesTimestampedErrors batch to be inserted
   */
  update(
    instancesTimestampedErrors: IterableIterator<
      [aas.types.Class, TimestampedError]
    >
  ) {
    let shouldBumpVersion = false;

    for (const [instance, timestampedError] of instancesTimestampedErrors) {
      const errorKey = produceErrorKey(timestampedError);

      let instanceErrors = this.map.get(instance);
      if (instanceErrors === undefined) {
        instanceErrors = new Map<string, TimestampedError>();
        instanceErrors.set(errorKey, timestampedError);

        this.map.set(instance, instanceErrors);
        this._errorCount++;

        shouldBumpVersion = true;
      } else {
        const previousTimestampError = instanceErrors.get(errorKey);

        if (previousTimestampError === undefined) {
          instanceErrors.set(errorKey, timestampedError);
          this._errorCount++;
          shouldBumpVersion = true;
        } else {
          if (previousTimestampError.timestamp < timestampedError.timestamp) {
            instanceErrors.set(errorKey, timestampedError);
            this._errorCount++;

            shouldBumpVersion = true;
          }
        }
      }
    }

    if (shouldBumpVersion) {
      this.versioning.version++;
    }

    if (debugconf.DEBUG_WITH_INVARIANTS) {
      this.assertErrorCountCorrect();
    }
  }

  /**
   * Unmark the instances from the error map.
   *
   * @remarks
   * We have to update the map in bulk so that we do not waste version numbers.
   * Otherwise, we might overflow very soon when dealing with very large
   * environments.
   *
   * @param instances to be removed from the error map.
   */
  remove(instances: IterableIterator<aas.types.Class>): void {
    let shouldBumpVersion = false;
    for (const instance of instances) {
      const instanceErrors = this.map.get(instance);
      if (instanceErrors !== undefined) {
        this._errorCount -= instanceErrors.size;
        shouldBumpVersion = true;
      }
    }

    if (shouldBumpVersion) {
      this.versioning.version++;
    }

    if (debugconf.DEBUG_WITH_INVARIANTS) {
      this.assertErrorCountCorrect();
    }
  }

  /**
   * Iterate over all the contained errors in an arbitrary order.
   */
  *errors(): IterableIterator<TimestampedError> {
    for (const instanceErrors of this.map.values()) {
      for (const error of instanceErrors.values()) {
        yield error;
      }
    }
  }
}

/**
 * Compare two timestamped errors, first on timestamps than on their paths, and
 * finally on their messages.
 *
 * @param that left operand
 * @param other right operand
 * @returns
 * * `that  < other => result  < 0`,
 * * `that == other => result == 0`, and
 * * `that  > other => result  > 0`
 */
export function compareTimestampedErrors(
  that: TimestampedError,
  other: TimestampedError
): number {
  if (that.timestamp !== other.timestamp) {
    // The most recent timestamp comes before the older timestamp.
    // Therefore, we reverse the subtraction order here.
    return other.timestamp - that.timestamp;
  }

  // We take the max, and then deal with `undefined` gracefully.
  const n = Math.max(that.path.length, other.path.length);

  for (let i = 0; i < n; ++i) {
    const thatSegment = that.path[i];
    const otherSegment = other.path[i];

    if (thatSegment === undefined && otherSegment === undefined) {
      // If we got so far, the paths were equal, so we compare the messages.
      return that.message.localeCompare(other.message);
    }

    // The longer path is greater than the shorter path, everything else
    // being equal.
    if (thatSegment === undefined && otherSegment !== undefined) {
      return -1;
    } else if (thatSegment !== undefined && otherSegment === undefined) {
      return 1;
    } else {
      // We impose an arbitrary comparison that index segments are less-than
      // property segments.
      if (typeof thatSegment === "number" && typeof otherSegment === "string") {
        return -1;
      } else if (
        typeof thatSegment === "string" &&
        typeof otherSegment === "number"
      ) {
        return 1;
      } else if (
        typeof thatSegment === "number" &&
        typeof otherSegment === "number"
      ) {
        if (thatSegment !== otherSegment) {
          return thatSegment - otherSegment;
        } else {
          // Continue, the path segments are equal thus far.
        }
      } else if (
        typeof thatSegment === "string" &&
        typeof otherSegment === "string"
      ) {
        // NOTE (mristin, 2023-02-03):
        // JavaScript does not provide efficient `strcmp`, so we have to
        // resort to two string comparisons.
        if (thatSegment !== otherSegment) {
          const thatSegmentNameIsSmaller = thatSegment < otherSegment;
          return thatSegmentNameIsSmaller ? -1 : 1;
        } else {
          // Continue, the path segments are equal thus far.
        }
      } else {
        console.error("Unhandled case", thatSegment, otherSegment);
        throw new Error("Assertion violation");
      }
    }
  }

  console.error(
    "Unhandled case, the function should have returned before",
    that,
    other
  );
  throw new Error("Assertion violation");
}

function* overInstanceAndItsAntecedents(
  instance: aas.types.Class
): IterableIterator<aas.types.Class> {
  let cursor: aas.types.Class | null = instance;

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

function* overInstanceAndItsDescendents(
  instance: aas.types.Class
): IterableIterator<aas.types.Class> {
  yield instance;
  yield* instance.descend();
}

export class Verification {
  verificationMap = new VerificationMap();
  errorMap = new ErrorMap();

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
      overInstanceAndItsAntecedents(instance),
      timestamp
    );

    this.errorMap.remove(overInstanceAndItsDescendents(instance));
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
    this.verificationMap.remove(overInstanceAndItsDescendents(instance));
    this.errorMap.remove(overInstanceAndItsDescendents(instance));
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

      const instancesTimestamps = Array.from(
        context.verificationMap.overInstancesWithTimestamps()
      );

      instancesTimestamps.sort((that, other) => {
        // The most recent change comes first, hence the reversed order of
        // operands in the subtraction.
        return other[1] - that[1];
      });

      const batch = instancesTimestamps.slice(0, 100);

      const instancesTimestampedErrors = new Array<
        [aas.types.Class, TimestampedError]
      >();

      let reachedTheCap = false;

      for (const [instance, timestamp] of batch) {
        for (const error of aas.verification.verify(instance, false)) {
          const path = model.collectPath(instance);
          path.push(...aasVerificationPathToArrayOfPrimitives(error.path));

          instancesTimestampedErrors.push([
            instance,
            new TimestampedError(error.message, path, timestamp),
          ]);

          if (
            previousErrorCount + instancesTimestampedErrors.length ===
            context.errorCap
          ) {
            reachedTheCap = true;
            break;
          }
        }

        if (reachedTheCap) {
          break;
        }
      }

      // Remove the instances from the verification queue since we processed
      // them.
      function* overInstances() {
        // noinspection JSUnusedLocalSymbols
        for (const instanceTimestamp of instancesTimestamps) {
          yield instanceTimestamp[0];
        }
      }

      context.verificationMap.remove(overInstances());

      // Mark the instances with timestamped errors
      context.errorMap.update(instancesTimestampedErrors.values());

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cursor: any = environment;

    // We skip the last element as it refers to the property which has been
    // changed.
    for (let i = 0; i < pathInEnvironment.length - 1; i++) {
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

    const something: unknown = cursor;
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
    // NOTE (mristin, 2023-02-03):
    // We assume here that the environment is an object tree where each instance
    // has exactly one parent. Hence, when a property referencing an instance
    // is set, the previous value can be assumed to be removed from
    // the environment.

    if (value !== null) {
      // We added a new embedded instance.

      verification.bubbleUpForVerification(value, timestamp);
    }

    if (previousValue !== null) {
      // We removed an existing embedded instance.

      verification.plopDownFromVerification(previousValue);
    }
  } else if (
    isArrayOfInstancesOrNull(value) &&
    isArrayOfInstancesOrNull(previousValue)
  ) {
    const valueSet: Set<aas.types.Class> =
      value === null ? new Set() : new Set(value);

    const previousValueSet: Set<aas.types.Class> =
      previousValue === null ? new Set() : new Set(previousValue);

    for (const instance of valueSet) {
      if (!previousValueSet.has(instance)) {
        verification.bubbleUpForVerification(instance, timestamp);
      }
    }

    for (const instance of previousValueSet) {
      if (!valueSet.has(instance)) {
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
