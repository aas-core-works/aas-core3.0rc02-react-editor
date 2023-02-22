"""Generate recursive enhancing logic."""

from typing import List, Optional

from aas_core_codegen import intermediate
from aas_core_codegen.common import (
    Identifier,
    indent_but_first_line,
    Stripped,
    assert_never,
)
from aas_core_codegen.typescript import (
    common as typescript_common,
    naming as typescript_naming,
)
from aas_core_codegen.typescript.common import (
    INDENT as I,
    INDENT2 as II,
    INDENT3 as III,
    INDENT4 as IIII
)

import codegen.common


def _generate_visit_for_class(cls: intermediate.ConcreteClass) -> Stripped:
    """Generate the visit method for the ``cls``."""
    blocks = []  # type: List[Stripped]

    for prop in cls.properties:
        type_anno = intermediate.beneath_optional(prop.type_annotation)

        prop_name = typescript_naming.property_name(prop.name)
        prop_name_literal = typescript_common.string_literal(prop_name)

        block = None  # type: Optional[Stripped]

        if isinstance(type_anno, intermediate.PrimitiveTypeAnnotation):
            # We can not recursively enhance primitive types.
            continue

        elif isinstance(type_anno, intermediate.OurTypeAnnotation):
            if isinstance(type_anno.our_type, intermediate.Enumeration):
                # We can not recursively enhance an enumeration.
                continue

            elif isinstance(type_anno.our_type, intermediate.ConstrainedPrimitive):
                # We can not recursively enhance primitive types.
                continue

            elif isinstance(
                type_anno.our_type,
                (intermediate.AbstractClass, intermediate.ConcreteClass),
            ):
                block = Stripped(
                    f"""\
enhanceNonRecursively(
{I}that.{prop_name},
{I}that,
{I}[{prop_name_literal}]
);
this.visit(
{I}that.{prop_name}
);"""
                )
            else:
                assert_never(type_anno.our_type)
        elif isinstance(type_anno, intermediate.ListTypeAnnotation):
            assert isinstance(type_anno.items, intermediate.OurTypeAnnotation), (
                f"NOTE (mristin, 2023-02-10): We expect only lists of our types "
                f"at the moment, but you specified {type_anno}. "
                f"Please contact the developers if you need this feature."
            )

            block = Stripped(
                f"""\
for (
{I}let i = 0;
{I}i < that.{prop_name}.length;
{I}i++
) {{
{I}enhanceNonRecursively(
{II}that.{prop_name}[i],
{II}that,
{II}[
{III}{prop_name_literal},
{III}i
{II}]
{I});

{I}this.visit(
{II}that.{prop_name}[i]
{I});
}}"""
            )
        else:
            assert_never(type_anno)

        if isinstance(prop.type_annotation, intermediate.OptionalTypeAnnotation):
            block = Stripped(
                f"""\
if (that.{prop_name} !== null) {{
{I}{indent_but_first_line(block, I)}
}}"""
            )

        blocks.append(block)

    disable_unused_directive = (
        ""
        if len(blocks) > 0
        else f"{I}// eslint-disable-next-line @typescript-eslint/no-unused-vars\n"
    )
    if len(blocks) == 0:
        blocks.append(Stripped("// No further recursion possible."))

    blocks_joined = "\n\n".join(blocks)

    visit_name = typescript_naming.method_name(Identifier(f"visit_{cls.name}"))
    cls_name = typescript_naming.class_name(cls.name)

    return Stripped(
        f"""\
override {visit_name}(
{disable_unused_directive}{I}that: aas.types.{cls_name}
): void {{
{I}{indent_but_first_line(blocks_joined, I)}
}}"""
    )


def _generate_descendant_enhancer(symbol_table: intermediate.SymbolTable) -> Stripped:
    """Generate the code for the recursive enhancer of descendants."""
    visit_methods = []  # type: List[Stripped]
    for our_type in symbol_table.our_types:
        if not isinstance(our_type, intermediate.ConcreteClass):
            continue

        visit_methods.append(_generate_visit_for_class(our_type))

    visit_methods_joined = "\n\n".join(visit_methods)
    return Stripped(
        f"""\
/**
 * Visit recursively the descendants and enhance them.
 */
class DescendantEnhancer extends aas.types.AbstractVisitor {{
{I}{indent_but_first_line(visit_methods_joined, I)}
}}"""
    )


def generate(symbol_table: intermediate.SymbolTable) -> Stripped:
    """Generate the code for the recursive enhancing logic."""
    blocks = [
        Stripped(
            """\
/**
 * Enhance instances recursively.
 *
 * @remark
 * Instances are expected to be enhanced only *once* to avoid unexpected behavior
 * since it is not clear how a re-enhancement logic should really work (merge with
 * a previous enhancement, replace the previous enhancement *etc.*).
 */"""
        ),
        codegen.common.WARNING,
        Stripped(
            """\
import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as valtio from "valtio";

import * as incrementalid from "./incrementalid";
import * as model from "./model";"""
        ),
        Stripped(
            f"""\
/**
 * Represent an error with a timestamp of the change.
 */
export class TimestampedError {{
{I}constructor(
{II}public message: string,
{II}public instance: aas.types.Class,
{II}public relativePathFromInstance: Array<number | string>,
{II}public timestamp: number,
{II}public guid = incrementalid.next()
{I}) {{}}

{I}pathAsString(): string {{
{II}const path = model.collectPath(this.instance);
{II}path.push(...this.relativePathFromInstance);

{II}if (path.length === 0) {{
{III}return "";
{II}}}

{II}// NOTE (2023-02-10):
{II}// See: https://stackoverflow.com/questions/16696632/most-efficient-way-to-concatenate-strings-in-javascript
{II}// for string concatenation.
{II}let result = "";

{II}for (const segment of path) {{
{III}if (typeof segment === "string") {{
{III}  result += `.${{segment}}`;
{III}}} else {{
{III}  result += `[${{segment}}]`;
{III}}}
{II}}}

{II}return result;
{I}}}

{I}relativePathFromInstanceAsString(): string {{
{II}if (this.relativePathFromInstance.length === 0) {{
{III}return "";
{II}}}

{II}// NOTE (2023-02-10):
{II}// See: https://stackoverflow.com/questions/16696632/most-efficient-way-to-concatenate-strings-in-javascript
{II}// for string concatenation.
{II}let result = "";

{II}for (const segment of this.relativePathFromInstance) {{
{III}if (typeof segment === "string") {{
{IIII}result += `.${{segment}}`;
{III}}} else {{
{IIII}result += `[${{segment}}]`;
{III}}}
{II}}}

{II}return result;
{I}}}
}}"""
        ),
        Stripped(
            f"""\
export class VersionedSet<T> {{
{I}private readonly _content = new Set<T>();
{I}private readonly _versioning = valtio.proxy({{ version: 0 }});

{I}*[Symbol.iterator]() {{
{II}yield* this._content;
{I}}}

{I}add(item: T) {{
{II}let bumpVersion = false;
{II}if (!this._content.has(item)) {{
{III}this._content.add(item);
{III}bumpVersion = true;
{II}}}

{II}if (bumpVersion) {{
{III}this._versioning.version++;
{II}}}
{I}}}
{I}
{I}delete(item: T) {{
{II}const bumpVersion = this._content.delete(item);
{II}if (bumpVersion) {{
{III}this._versioning.version++;
{II}}}
{I}}}
{I}
{I}clear() {{
{II}if (this._content.size === 0) {{
{III}return;
{II}}}

{II}this._content.clear();
{II}this._versioning.version++;
{I}}}

{I}public get size() {{
{II}return this._content.size;
{I}}}

{I}public get versioning() {{
{II}return this._versioning;
{I}}}
}}"""
        ),
        Stripped(
            f"""\
class Enhancement {{
{I}id: string;
{I}parent: aas.types.Class | null;
{I}relativePathFromParent: Array<number | string>
{I}errors = valtio.ref(new VersionedSet<TimestampedError>());
{I}descendantsWithErrors = valtio.ref(new VersionedSet<aas.types.Class>());

{I}constructor(
{II}id: string,
{II}parent: aas.types.Class | null,
{II}relativePathFromParent: Array<number | string>
{I}) {{
{II}this.id = id;
{II}this.parent = parent;
{II}this.relativePathFromParent = relativePathFromParent;
{I}}}
}}"""
        ),
        Stripped(
            f"""\
type MaybeEnhanced<ClassT extends aas.types.Class> = ClassT & {{
{I}_aasCoreEditorEnhancement: Enhancement | undefined;
}};"""
        ),
        Stripped(
            f"""\
export type Enhanced<ClassT extends aas.types.Class> = ClassT & {{
{I}_aasCoreEditorEnhancement: Enhancement;
}};"""
        ),
        Stripped(
            f"""\
export function asEnhanced<ClassT extends aas.types.Class>(
{I}instance: ClassT
): Enhanced<ClassT> | null {{
{I}const maybeEnhanced = instance as unknown as MaybeEnhanced<ClassT>;
{I}return maybeEnhanced._aasCoreEditorEnhancement !== undefined
{II}? (instance as Enhanced<ClassT>)
{II}: null;
}}"""
        ),
        Stripped(
            f"""\
export function isEnhanced<ClassT extends aas.types.Class>(
{I}instance: ClassT
): instance is Enhanced<ClassT> {{
{I}const maybeEnhanced = instance as unknown as MaybeEnhanced<ClassT>;
{I}return maybeEnhanced._aasCoreEditorEnhancement !== undefined;
}}"""
        ),
        Stripped(
            f"""\
export function mustAsEnhanced<ClassT extends aas.types.Class>(
{I}instance: ClassT
): Enhanced<ClassT> {{
{I}const maybeEnhanced = instance as unknown as MaybeEnhanced<ClassT>;
{I}if (maybeEnhanced._aasCoreEditorEnhancement === undefined) {{
{II}console.error(
{III}"Expected an enhanced instance, but got an un-enhanced one.",
{III}instance
{II});
{II}throw new Error("Assertion violation");
{I}}}
{I}return maybeEnhanced as Enhanced<ClassT>;
}}"""
        ),
        Stripped(
            f"""\
/**
 * Enhance only the instance in-place and do not recurse into descendants.
 */
function enhanceNonRecursively(
{I}instance: aas.types.Class,
{I}parent: aas.types.Class | null,
{I}relativePathFromParent: Array<number | string>
) {{
{I}if (isEnhanced(instance)) {{
{II}console.error("The instance has been already enhanced.", instance);
{II}throw new Error("Assertion violation");
{I}}}
{I}const toBeEnhanced = instance as unknown as MaybeEnhanced<aas.types.Class>;
{I}toBeEnhanced._aasCoreEditorEnhancement = new Enhancement(
{II}incrementalid.next(),
{II}parent,
{II}relativePathFromParent
{I});
}}"""
        ),
        _generate_descendant_enhancer(symbol_table=symbol_table),
        Stripped(
            """\
const DESCENDANT_ENHANCER = new DescendantEnhancer();"""
        ),
        Stripped(
            f"""\
/**
 * Enhance the `instance` in-place and recursively.
 *
 * @param instance AAS instance to be enhanced
 * @param parent of the `instance`
 * @param relativePathFromParent path segments relative to the parent
 * @return enhanced `instance`
 */
export function enhance<ClassT extends aas.types.Class>(
{I}instance: ClassT,
{I}parent: aas.types.Class | null,
{I}relativePathFromParent: Array<number | string>
): Enhanced<ClassT> {{
{I}if (parent === null && relativePathFromParent.length != 0) {{
{II}console.error(
{III}"When enhancing, you specified parent as null, " +
{III}"but the relative path to parent is not empty",
{III}relativePathFromParent
{II});
{II}throw new Error("Assertion violation");
{I}}}

{I}enhanceNonRecursively(instance, parent, relativePathFromParent);
{I}DESCENDANT_ENHANCER.visit(instance);

{I}return instance as Enhanced<ClassT>;
}}"""
        ),
    ]

    return Stripped("\n\n".join(blocks))
