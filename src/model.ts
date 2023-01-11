import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as valtio from "valtio";

import * as emptory from "./emptory.generated";

/**
 * Provide model of the app.
 */
import * as incrementalid from "./incrementalid";

class Enhancement {
  id: string;
  parent: aas.types.Class | null;

  constructor(id: string, parent: aas.types.Class | null) {
    this.id = id;
    this.parent = parent;
  }
}

type MaybeEnhanced<ClassT extends aas.types.Class> = ClassT & {
  _aasCoreEditorEnhancement: Enhancement | undefined;
};

export type Enhanced<ClassT extends aas.types.Class> = ClassT & {
  _aasCoreEditorEnhancement: Enhancement;
};

export const INITIAL_FILENAME = "untitled.json";

export class State {
  fileName: string;
  environment: Enhanced<aas.types.Environment>;

  constructor() {
    this.fileName = INITIAL_FILENAME;
    this.environment = enhance(emptory.newEnvironment(), null);
  }
}

export const STATE = valtio.proxy(new State());

export function asEnhanced<ClassT extends aas.types.Class>(
  instance: ClassT
): Enhanced<ClassT> | null {
  const maybeEnhanced = instance as unknown as MaybeEnhanced<ClassT>;
  return maybeEnhanced._aasCoreEditorEnhancement !== undefined
    ? (instance as Enhanced<ClassT>)
    : null;
}

export function mustAsEnhanced<ClassT extends aas.types.Class>(
  instance: ClassT
): Enhanced<ClassT> {
  const maybeEnhanced = instance as unknown as MaybeEnhanced<ClassT>;
  if (maybeEnhanced._aasCoreEditorEnhancement === undefined) {
    console.error(
      "Expected an enhanced instance, but got unenhanced one.",
      instance
    );
    throw new Error("Assertion violation");
  }
  return maybeEnhanced as Enhanced<ClassT>;
}

/**
 * Enhance the `instance` in-place and recursively.
 *
 * @param instance AAS instance to be enhanced
 * @param parent of the `instance`
 * @return enhanced `instance`
 */
export function enhance<ClassT extends aas.types.Class>(
  instance: ClassT,
  parent: aas.types.Class | null
): Enhanced<ClassT> {
  const maybeEnhanced = instance as unknown as MaybeEnhanced<ClassT>;
  if (maybeEnhanced._aasCoreEditorEnhancement !== undefined) {
    console.error("The instance has been already enhanced.", instance);
    throw new Error("Assertion violation");
  }

  maybeEnhanced._aasCoreEditorEnhancement = new Enhancement(
    incrementalid.next(),
    parent
  );

  for (const descendant of instance.descendOnce()) {
    enhance(descendant, instance);
  }

  return maybeEnhanced as Enhanced<ClassT>;
}

export function getOurId(instance: aas.types.Class): string {
  const enhanced = asEnhanced(instance);
  if (enhanced === null) {
    console.error(
      "Expected instance to be identifiable by us, but no ID was set",
      instance
    );
    throw new Error("Assertion violated");
  }

  return enhanced._aasCoreEditorEnhancement.id;
}

export function getParent(instance: aas.types.Class): aas.types.Class | null {
  const enhanced = asEnhanced(instance);
  if (enhanced === null) {
    console.error(
      "Expected instance to be identifiable by us, but no ID was set",
      instance
    );
    throw new Error("Assertion violated");
  }

  return enhanced._aasCoreEditorEnhancement.parent;
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
  item: Enhanced<ClassV>,
  container: ReadonlyArray<ClassU> | null
): Array<ClassU> {
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
 * If the `container` contains only the item we want to remove, we return
 * an empty array (`[]`).
 *
 * @param container to be iterated through
 * @param ourId enhanced ID of the item to be removed
 * @return new container with the item removed
 */
export function removeFromContainer<ClassT extends aas.types.Class>(
  container: ReadonlyArray<ClassT> | null,
  ourId: string
): Array<ClassT> | null {
  if (container === null) {
    return null;
  }
  const newContainer: Array<ClassT> | null = [];

  for (let i = 0; i < container.length; i++) {
    const item = container[i];
    if (getOurId(item) === ourId) {
      continue;
    }
    newContainer.push(item);
  }

  return newContainer;
}
