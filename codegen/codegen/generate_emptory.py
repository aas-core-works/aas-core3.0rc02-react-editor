"""Generate factory of empty instances."""

from typing import List, Optional

from aas_core_codegen import intermediate
from aas_core_codegen.common import (
    Identifier,
    indent_but_first_line,
    Stripped,
    assert_never,
)
from aas_core_codegen.typescript import naming as typescript_naming
from aas_core_codegen.typescript.common import INDENT as I

import codegen.common

_DEFAULT_VALUE_FOR_PRIMITIVE_TYPE = {
    intermediate.PrimitiveType.BOOL: "true",
    intermediate.PrimitiveType.INT: "0",
    intermediate.PrimitiveType.FLOAT: "0.0",
    intermediate.PrimitiveType.STR: '""',
    intermediate.PrimitiveType.BYTEARRAY: "new Uint8Array()",
}


def _generate_for_class(cls: intermediate.ConcreteClass) -> Stripped:
    """Generate the factory method for the ``cls``."""
    iterator = iter(cls.constructor.arguments)

    required_args = []  # type: List[intermediate.Argument]

    while (arg := next(iterator, None), arg is not None)[1]:
        assert arg is not None
        if isinstance(arg.type_annotation, intermediate.OptionalTypeAnnotation):
            break

        required_args.append(arg)

    while arg is not None:
        assert isinstance(arg.type_annotation, intermediate.OptionalTypeAnnotation), (
            f"Expected the constructor arguments after the mandatory arguments all "
            f"to be optional, but got a required argument {arg.name!r} after "
            f"an optional argument in class {cls.name!r}."
        )
        arg = next(iterator, None)

    default_values = []  # type: List[str]

    for arg in required_args:
        assert not isinstance(arg.type_annotation, intermediate.OptionalTypeAnnotation)
        default_value = None  # type: Optional[str]

        if isinstance(arg.type_annotation, intermediate.PrimitiveTypeAnnotation) or (
            isinstance(arg.type_annotation, intermediate.OurTypeAnnotation)
            and isinstance(
                arg.type_annotation.our_type, intermediate.ConstrainedPrimitive
            )
        ):
            primitive_type = intermediate.try_primitive_type(arg.type_annotation)
            assert primitive_type is not None
            default_value = _DEFAULT_VALUE_FOR_PRIMITIVE_TYPE[primitive_type]

        elif isinstance(arg.type_annotation, intermediate.OurTypeAnnotation):
            our_type = arg.type_annotation.our_type

            if isinstance(our_type, intermediate.Enumeration):
                enum_name = typescript_naming.enum_name(our_type.name)
                assert len(our_type.literals) > 0, (
                    f"Expected at least one literal, "
                    f"but the enumeration {our_type.name!r} has none"
                )

                first_literal = our_type.literals[0]
                literal_name = typescript_naming.enum_literal_name(first_literal.name)

                default_value = f"aas.types.{enum_name}.{literal_name}"
            elif isinstance(our_type, intermediate.ConstrainedPrimitive):
                raise AssertionError(
                    "Expected to handle the constrained primitive before"
                )
            elif isinstance(our_type, intermediate.AbstractClass):
                assert len(our_type.concrete_descendants) > 0, (
                    f"The constructor argument {arg.name!r} of class {cls.name!r} "
                    f"is of type {our_type.name!r}, but the class {our_type.name!r} "
                    f"has no concrete descendants. Hence, we do not know how to "
                    f"instantiate an empty instance of {cls.name!r}."
                )

                descendant = our_type.concrete_descendants[0]
                descendant_emptory = typescript_naming.function_name(
                    Identifier(f"new_{descendant.name}")
                )
                default_value = f"{descendant_emptory}()"
            elif isinstance(our_type, intermediate.ConcreteClass):
                arg_emptory = typescript_naming.function_name(
                    Identifier(f"new_{our_type.name}")
                )
                default_value = f"{arg_emptory}()"
            else:
                assert_never(our_type)
        elif isinstance(arg.type_annotation, intermediate.ListTypeAnnotation):
            default_value = "[]"
        else:
            assert_never(arg.type_annotation)

        assert default_value is not None
        default_values.append(default_value)

    cls_name = typescript_naming.class_name(cls.name)
    if len(default_values) == 0:
        statement = Stripped(f"return new aas.types.{cls_name}();")
    else:
        default_values_joined = ",\n".join(default_values)
        statement = Stripped(
            f"""\
return new aas.types.{cls_name}(
{I}{indent_but_first_line(default_values_joined, I)}
);"""
        )

    emptory_name = typescript_naming.function_name(Identifier(f"new_{cls.name}"))

    return Stripped(
        f"""\
export function {emptory_name}(
): aas.types.{cls_name} {{
{I}{indent_but_first_line(statement, I)}
}}"""
    )


def generate(symbol_table: intermediate.SymbolTable) -> Stripped:
    """Generate the code for the factory of empty instances."""
    blocks = [
        Stripped(
            """\
/**
 * Produce empty instances.
 *
 * @remark
 * "Emptory" is a portmanteau for "factory of empty instances".
 *
 * The empty instances do not necessarily pass the verification, but can be
 * structurally used in the program, since the types match, and can be
 * de/serialized.
 */"""
        ),
        codegen.common.WARNING,
        Stripped('import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";'),
    ]

    for cls in [
        our_type
        for our_type in symbol_table.our_types
        if isinstance(our_type, intermediate.ConcreteClass)
    ]:
        blocks.append(_generate_for_class(cls))

    return Stripped("\n\n".join(blocks))
