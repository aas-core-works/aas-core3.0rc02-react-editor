"""Generate components of instance fields."""
import io
import pathlib
from typing import List

from aas_core_codegen.common import (
    Identifier,
    indent_but_first_line,
    Stripped,
    assert_never,
)
from aas_core_codegen import intermediate
from aas_core_codegen.typescript import (
    naming as typescript_naming,
    common as typescript_common,
)
from aas_core_codegen.typescript.common import (
    INDENT as I,
    INDENT2 as II,
    INDENT3 as III,
)
from icontract import require

import codegen.common


@require(lambda cls, prop: id(prop) in cls.property_id_set)
def _generate_field_for_property(
    cls: intermediate.ConcreteClass, prop: intermediate.Property
) -> Stripped:
    """Generate the field for a property of a class."""
    label = codegen.common.identifier_as_label(prop.name)
    label_literal = typescript_common.string_literal(label)

    type_anno = intermediate.beneath_optional(prop.type_annotation)
    optional = isinstance(prop.type_annotation, intermediate.OptionalTypeAnnotation)

    prop_name = typescript_naming.property_name(prop.name)

    optional_or_required_suffix = "Optional" if optional else "Required"

    help_url_literal = f"`${{help.ROOT_URL}}/{cls.name}.html#property-{prop.name}`"

    if isinstance(type_anno, intermediate.PrimitiveTypeAnnotation) or (
        isinstance(type_anno, intermediate.OurTypeAnnotation)
        and isinstance(type_anno.our_type, intermediate.ConstrainedPrimitive)
    ):
        primitive_type = intermediate.try_primitive_type(type_anno)
        assert primitive_type is not None

        if primitive_type is intermediate.PrimitiveType.BOOL:
            return Stripped(
                f"""\
<fields.BooleanField{optional_or_required_suffix}
{I}label={label_literal}
{I}helpUrl={{
{II}{help_url_literal}
{I}}}
{I}value={{props.snapInstance.{prop_name}}}
{I}onChange={{
{II}(value) => {{
{III}props.instance.{prop_name} = value;
{II}}}
{I}}}
/>"""
            )
        elif primitive_type is intermediate.PrimitiveType.INT:
            raise NotImplementedError(primitive_type)
        elif primitive_type is intermediate.PrimitiveType.FLOAT:
            raise NotImplementedError(primitive_type)
        elif primitive_type is intermediate.PrimitiveType.STR:
            return Stripped(
                f"""\
<fields.TextField{optional_or_required_suffix}
{I}label={label_literal}
{I}helpUrl={{
{II}{help_url_literal}
{I}}}
{I}value={{props.snapInstance.{prop_name}}}
{I}onChange={{
{II}(value) => {{
{III}props.instance.{prop_name} = value;
{II}}}
{I}}}
/>"""
            )
        elif primitive_type is intermediate.PrimitiveType.BYTEARRAY:
            # SPECIFIC-IMPLEMENTATION
            content_type_expr = "null"
            if cls.name == "Blob" and prop.name == "value":
                content_type_expr = "props.snapInstance.contentType"

            return Stripped(
                f"""\
<fields.ByteArrayField{optional_or_required_suffix}
{I}label={label_literal}
{I}helpUrl={{
{II}{help_url_literal}
{I}}}
{I}value={{props.snapInstance.{prop_name}}}
{I}onChange={{
{II}(value) => {{
{III}props.instance.{prop_name} = value;
{II}}}
{I}}}
{I}contentType={{{content_type_expr}}}
/>"""
            )
        else:
            assert_never(primitive_type)
    elif isinstance(type_anno, intermediate.OurTypeAnnotation):
        our_type = type_anno.our_type

        if isinstance(our_type, intermediate.Enumeration):
            over_literals = typescript_naming.function_name(
                Identifier(f"over_{our_type.name}")
            )

            must_to_string = typescript_naming.function_name(
                Identifier(f"must_{our_type.name}_to_string")
            )

            return Stripped(
                f"""\
<fields.EnumerationField{optional_or_required_suffix}
{I}label={label_literal}
{I}helpUrl={{
{II}{help_url_literal}
{I}}}
{I}getLiterals={{aas.types.{over_literals}}}
{I}literalToString={{aas.stringification.{must_to_string}}}
{I}selected={{props.snapInstance.{prop_name}}}
{I}onChange={{
{II}(value) => {{
{III}props.instance.{prop_name} = value;
{II}}}
{I}}}
/>"""
            )
        elif isinstance(our_type, intermediate.ConstrainedPrimitive):
            raise AssertionError(
                f"Expected to handle {our_type.__class__.__name__} before"
            )
        elif isinstance(
            our_type, (intermediate.AbstractClass, intermediate.ConcreteClass)
        ):
            embedded_type_name = typescript_naming.class_name(our_type.name)

            if our_type.interface is not None:
                embedded_type_name = typescript_naming.interface_name(our_type.name)

            newinstancing_for_const = typescript_naming.constant_name(
                Identifier(f"for_{our_type.name}")
            )

            return Stripped(
                f"""\
<fields.EmbeddedInstance{optional_or_required_suffix}<aas.types.{embedded_type_name}>
{I}label={label_literal}
{I}helpUrl={{
{II}{help_url_literal}
{I}}}
{I}parent={{props.instance}}
{I}property={typescript_common.string_literal(prop_name)}
{I}snapInstance={{
{II}props.snapInstance.{prop_name}
{I}}}
{I}instance={{
{II}props.instance.{prop_name}
{I}}}
{I}newInstanceDefinitions={{
{II}newinstancing.{newinstancing_for_const}
{I}}}
{I}setInstance={{
{II}(instance) => {{
{III}props.instance.{prop_name} = instance;
{II}}}
{I}}}
/>"""
            )
        else:
            assert_never(our_type)
    elif isinstance(type_anno, intermediate.ListTypeAnnotation):
        assert isinstance(
            type_anno.items, intermediate.OurTypeAnnotation
        ) and isinstance(
            type_anno.items.our_type,
            (intermediate.AbstractClass, intermediate.ConcreteClass),
        ), (
            f"We handle only lists of instances at the moment, "
            f"but we got: {type_anno}"
        )

        items_cls = type_anno.items.our_type

        if items_cls.interface is not None:
            items_type = typescript_naming.interface_name(items_cls.interface.name)
        else:
            items_type = typescript_naming.class_name(items_cls.name)

        newinstancing_for_const = typescript_naming.constant_name(
            Identifier(f"for_{items_cls.name}")
        )

        return Stripped(
            f"""\
<fields.ListField{optional_or_required_suffix}<aas.types.{items_type}>
{I}label={label_literal}
{I}helpUrl={{
{II}{help_url_literal}
{I}}}
{I}parent={{props.instance}}
{I}property={typescript_common.string_literal(prop_name)}
{I}newInstanceDefinitions={{
{II}newinstancing.{newinstancing_for_const}
{I}}}
{I}snapItems={{
{II}props.snapInstance.{prop_name}
{I}}}
{I}items={{
{II}props.instance.{prop_name}
{I}}}
{I}setItems={{
{II}(items) => {{
{III}props.instance.{prop_name} = items;
{II}}}
{I}}}
/>"""
        )

    else:
        assert_never(type_anno)


def _generate_for_cls(cls: intermediate.ConcreteClass, path: pathlib.Path) -> None:
    """Generate the component to represent the properties of the ``cls``."""
    cls_name = typescript_naming.class_name(cls.name)

    field_blocks = []  # type: List[Stripped]

    for prop in cls.properties:
        field_blocks.append(_generate_field_for_property(cls=cls, prop=prop))

    field_blocks_joined = "\n\n".join(field_blocks)

    component_name = typescript_naming.class_name(Identifier(f"{cls.name}_fields"))

    blocks = [
        codegen.common.WARNING,
        Stripped(
            f"""\
/**
 * Define a component with fields corresponding to properties of
 * {{@link @aas-core-works/aas-core3.0rc02-typescript#types.{cls_name}|{cls_name}}}.
 */"""
        ),
        Stripped(
            """\
import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as fields from '../fields';
import * as help from './help.generated';
import * as newinstancing from '../../newinstancing.generated';"""
        ),
        Stripped(
            f"""\
export function {component_name}(
{I}props: {{
{II}snapInstance: Readonly<aas.types.{cls_name}>,
{II}instance: aas.types.{cls_name},
{I}}}
) {{
{I}return (
{II}<>
{III}{indent_but_first_line(field_blocks_joined, III)}
{II}</>
{I})
}}"""
        ),
        codegen.common.WARNING,
    ]  # type: List[Stripped]

    writer = io.StringIO()
    for i, block in enumerate(blocks):
        if i > 0:
            writer.write("\n\n")
        writer.write(block)

    writer.write("\n")

    path.write_text(writer.getvalue(), encoding="utf-8")


def _generate_fielding(
    symbol_table: intermediate.SymbolTable,
) -> Stripped:
    """Generate the fielding module to associate instances with fields components."""
    concrete_classes = [
        our_type
        for our_type in symbol_table.our_types
        if isinstance(our_type, intermediate.ConcreteClass)
    ]

    transform_blocks = []  # type: List[Stripped]
    for cls in concrete_classes:
        cls_name = typescript_naming.class_name(cls.name)
        transform_name = typescript_naming.method_name(
            Identifier(f"transform_{cls.name}_with_context")
        )

        component_name = typescript_naming.class_name(Identifier(f"{cls.name}_fields"))

        transform_blocks.append(
            Stripped(
                f"""\
{transform_name}(
{I}that: aas.types.{cls_name},
{I}snap: Readonly<aas.types.Class>
): React.ReactElement {{
{I}assertTypesMatch(that, snap);

{I}return {component_name}(
{II}{{
{III}snapInstance: snap,
{III}instance: that,
{II}}}
{I});
}}"""
            )
        )

    transform_blocks_joined = "\n\n".join(transform_blocks)
    field_dispatcher_block = Stripped(
        f"""\
class FieldDispatcher extends aas.types.AbstractTransformerWithContext<
{I}Readonly<aas.types.Class>,
{I}React.ReactElement
> {{
{I}{indent_but_first_line(transform_blocks_joined, I)}
}}"""
    )

    our_imports = []  # type: List[str]
    for cls in concrete_classes:
        cls_name = typescript_naming.class_name(cls.name)
        our_imports.append(
            f'import {{ {cls_name}Fields }} from "./{cls_name}Fields.generated";'
        )

    blocks = [
        Stripped(
            """\
/**
 * Associate instances with the corresponding fields components based on the runtime
 * type information.
 */"""
        ),
        codegen.common.WARNING,
        Stripped(
            """\
import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";"""
        ),
        Stripped("\n".join(our_imports)),
        Stripped(
            f"""\
function assertTypesMatch<ClassT extends aas.types.Class>(
{I}that: ClassT,
{I}other: Readonly<aas.types.Class>
): asserts other is ClassT {{
{I}if (!aas.types.typesMatch(that, other)) {{
{II}console.error(
{III}`Expected ${{that.constructor.name}}, but got ${{other.constructor.name}}`
{II});
{II}throw new Error("Assertion violated");
{I}}}
}}"""
        ),
        field_dispatcher_block,
        Stripped("const FIELD_DISPATCHER = new FieldDispatcher();"),
        Stripped(
            f"""\
export function componentFor(
{I}instance: aas.types.Class,
{I}snapInstance: aas.types.Class
): React.ReactElement {{
{I}return FIELD_DISPATCHER.transformWithContext(instance, snapInstance);
}}"""
        ),
        codegen.common.WARNING,
    ]

    return Stripped("\n\n".join(blocks))


def generate(
    symbol_table: intermediate.SymbolTable,
    instances_dir: pathlib.Path,
    model_id: Stripped,
) -> None:
    """Generate the files which define fields for instances of concrete classes."""
    exports = []  # type: List[str]

    root_help_url_literal = typescript_common.string_literal(
        f"https://aas-core-works.github.io/aas-core-meta/{model_id}"
    )
    (instances_dir / "help.generated.ts").write_text(
        f"""\
/**
 * Provide a global root URL for help links shared among the instance fields.
 */
export const ROOT_URL =
{I}{root_help_url_literal};
""",
        encoding="utf-8",
    )

    for cls in [
        our_type
        for our_type in symbol_table.our_types
        if isinstance(our_type, intermediate.ConcreteClass)
    ]:
        cls_name = typescript_naming.class_name(cls.name)

        _generate_for_cls(
            cls=cls, path=instances_dir / f"{cls_name}Fields.generated.tsx"
        )

        exports.append(
            f'export {{{cls_name}Fields}} from "./{cls_name}Fields.generated";'
        )

    fielding_code = _generate_fielding(symbol_table)
    (instances_dir / "fielding.generated.ts").write_text(
        fielding_code + "\n", encoding="utf-8"
    )
    exports.append('export * as fielding from "./fielding.generated";')
    exports.append('export * as help from "./help.generated";')

    (instances_dir / "index.ts").write_text(
        "\n".join(sorted(exports)) + "\n", encoding="utf-8"
    )
