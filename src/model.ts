import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";

import * as emptory from "./emptory.generated";
import * as enhancing from "./enhancing.generated";

/**
 * Provide model of the app.
 */

export function getOurId(instance: aas.types.Class): string {
  const enhanced = enhancing.asEnhanced(instance);
  if (enhanced === null) {
    console.error(
      "Expected the instance to have been enhanced, but it was not",
      instance
    );
    throw new Error("Assertion violated");
  }

  return enhanced._aasCoreEditorEnhancement.id;
}

export function getParent(instance: aas.types.Class): aas.types.Class | null {
  const enhanced = enhancing.asEnhanced(instance);
  if (enhanced === null) {
    console.error(
      "Expected the instance to have been enhanced, but it was not",
      instance
    );
    throw new Error("Assertion violated");
  }

  return enhanced._aasCoreEditorEnhancement.parent;
}

function getRelativePathFromParent(
  instance: aas.types.Class
): ReadonlyArray<string | number> {
  const enhanced = enhancing.mustAsEnhanced(instance);
  return enhanced._aasCoreEditorEnhancement.relativePathFromParent;
}

function mutableRelativePathFromParent(
  instance: aas.types.Class
): Array<string | number> {
  const enhanced = enhancing.mustAsEnhanced(instance);
  return enhanced._aasCoreEditorEnhancement.relativePathFromParent;
}

/**
 * Produce a path all the way to the first ancestor.
 *
 * @param instance for which we need the path
 * @return path as list of path segments in an object tree
 */
export function collectPath(instance: aas.types.Class): Array<string | number> {
  const listOfRelativePaths = [];

  let cursor: aas.types.Class | null = instance;

  const observedInstances = new Set<aas.types.Class>();

  while (cursor !== null) {
    observedInstances.add(cursor);

    const relativePath = getRelativePathFromParent(cursor);
    listOfRelativePaths.push(relativePath);

    const parent = getParent(cursor);

    if (parent !== null && observedInstances.has(parent)) {
      console.error(
        "A cycle detected in the object graph. " +
          "Parent pointed to an already observed instance.",
        cursor,
        parent
      );
      throw new Error("Assertion violation");
    }

    cursor = parent;
  }

  // We now have to reverse the list of segments as we went bottom-up.
  listOfRelativePaths.reverse();

  const segments = [];
  for (const relativePath of listOfRelativePaths) {
    segments.push(...relativePath);
  }
  return segments;
}

/**
 * Create a copy of the `container` with the `item` added.
 *
 * @remarks
 * If the `container` is `null`, a new array is created.
 *
 * @param item to be added
 * @param container to be extended
 * @return extended container
 */
export function addToContainer<
  ClassU extends aas.types.Class,
  ClassV extends ClassU
>(
  item: enhancing.Enhanced<ClassV>,
  container: ReadonlyArray<ClassU> | null
): Array<ClassU> {
  const originalLength = container === null ? 0 : container.length;

  const relPath = getRelativePathFromParent(item);
  if (relPath.length !== 2) {
    console.error(
      "Expected the relative path from parent to a container item " +
        "to have exactly two segments (the property and the index), " +
        "but got something else",
      relPath
    );
    throw new Error("Assertion violation");
  }
  if (relPath[1] !== originalLength) {
    console.error(
      "Expected the relative path from parent to a new container item " +
        "to be exactly the original length of the container, " +
        "but got something else",
      relPath,
      originalLength,
      container
    );
    throw new Error("Assertion violation");
  }

  let extendedContainer;
  if (container === null) {
    extendedContainer = [item];
  } else {
    extendedContainer = [...container, item];
  }
  return extendedContainer;
}

/**
 * Create a copy of the `container` with the enhanced item removed from it.
 *
 * @remarks
 * If the `container` is `null`, simply return `null`.
 *
 * The relative paths from parent are updated in the remaining items.
 *
 * @param container to be iterated through
 * @param ourId enhanced ID of the item to be removed
 * @param emptyMeansNull if set, the result is `null` if there are no more items
 * @return
 * new container with the item removed and the relative paths from parent
 * updated
 */
export function removeFromContainer<ClassT extends aas.types.Class>(
  container: ReadonlyArray<ClassT> | null,
  ourId: string,
  emptyMeansNull: boolean
): Array<ClassT> | null {
  if (container === null) {
    return null;
  }
  const newContainer: Array<ClassT> | null = [];

  let afterTheRemoved = false;
  for (let i = 0; i < container.length; i++) {
    const item = container[i];
    if (getOurId(item) === ourId) {
      afterTheRemoved = true;
      continue;
    }

    if (afterTheRemoved) {
      const mutableRelPath = mutableRelativePathFromParent(item);
      if (mutableRelPath.length !== 2) {
        console.error(
          "Expected the relative path from parent to a container item " +
            "to have exactly two segments (the property and the index), " +
            "but got something else",
          mutableRelPath
        );
        throw new Error("Assertion violation");
      }

      if (mutableRelPath[1] !== i) {
        console.error(
          "Expected the relative path from parent to a container item " +
            `to have exactly the last segment ${i}, but got something else`,
          mutableRelPath,
          i
        );
        throw new Error("Assertion violation");
      }

      mutableRelPath[1]--;
    }

    newContainer.push(item);
  }

  if (newContainer.length === 0 && emptyMeansNull) {
    return null;
  }

  return newContainer;
}

export const INITIAL_FILENAME = "untitled.json";

export class State {
  fileName: string;
  environment: enhancing.Enhanced<aas.types.Environment>;

  constructor() {
    this.fileName = INITIAL_FILENAME;
    this.environment = enhancing.enhance(emptory.newEnvironment(), null, []);
  }
}
