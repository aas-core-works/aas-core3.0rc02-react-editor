"""Generate the code to define how to produce title for an instance."""

from typing import List, Optional

from aas_core_codegen import intermediate
from aas_core_codegen.common import (
    Identifier,
    indent_but_first_line,
    Stripped,
)
from aas_core_codegen.typescript import (
    naming as typescript_naming,
)
from aas_core_codegen.typescript.common import (
    INDENT as I,
)

import codegen.common


def _generate_transform_for_class(
    cls: intermediate.ConcreteClass, symbol_table: intermediate.SymbolTable
) -> Stripped:
    """Generate the produce-title transform for the ``cls``."""
    # SPECIFIC-IMPLEMENTATION
    identifiable_cls = symbol_table.must_find_class(Identifier("Identifiable"))
    referable_cls = symbol_table.must_find_class(Identifier("Referable"))

    cls_label = codegen.common.identifier_as_label(cls.name)

    body = None  # type: Optional[Stripped]
    if cls.is_subclass_of(identifiable_cls):
        body = Stripped(f"return `{cls_label} ${{that.id}}`;")
    elif cls.is_subclass_of(referable_cls):
        body = Stripped(
            f"""\
return that.idShort !== null
{I}? `{cls_label} ${{that.idShort}}`
{I}: "{cls_label}";"""
        )
    else:
        body = Stripped(f'return "{cls_label}";')

    assert body is not None

    transform_name = typescript_naming.method_name(Identifier(f"transform_{cls.name}"))
    cls_name = typescript_naming.class_name(cls.name)

    return Stripped(
        f"""\
{transform_name}(
{I}that: aas.types.{cls_name}
): string {{
{I}{indent_but_first_line(body, I)}
}}"""
    )


def generate(symbol_table: intermediate.SymbolTable) -> Stripped:
    """Generate the code to define how to produce title for an instance."""
    blocks = [
        Stripped(
            """\
/**
 * Define how titles are to be produced for instances of AAS classes.
 */"""
        ),
        codegen.common.WARNING,
        Stripped('import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";'),
        Stripped("/* eslint-disable @typescript-eslint/no-unused-vars */"),
    ]

    transform_methods = []  # type: List[Stripped]
    for cls in [
        our_type
        for our_type in symbol_table.our_types
        if isinstance(our_type, intermediate.ConcreteClass)
    ]:
        transform_methods.append(_generate_transform_for_class(cls, symbol_table))

    transform_methods_joined = "\n\n".join(transform_methods)

    blocks.extend(
        [
            Stripped(
                f"""\
class Titler extends aas.types.AbstractTransformer<string> {{
{I}{indent_but_first_line(transform_methods_joined, I)}
}}"""
            ),
            Stripped("const TITLER = new Titler();"),
            Stripped(
                f"""\
export function getTitle(instance: aas.types.Class): string {{
{I}return TITLER.transform(instance);
}}"""
            ),
            codegen.common.WARNING,
        ]
    )

    return Stripped("\n\n".join(blocks))
