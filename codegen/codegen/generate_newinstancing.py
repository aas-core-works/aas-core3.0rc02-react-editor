"""Generate the module to define add/new-instance actions."""

from typing import List, Union

from aas_core_codegen import intermediate
from aas_core_codegen.common import (
    Identifier,
    indent_but_first_line,
    Stripped,
)
from aas_core_codegen.typescript import (
    naming as typescript_naming,
    common as typescript_common,
)
from aas_core_codegen.typescript.common import (
    INDENT as I,
    INDENT2 as II,
    INDENT3 as III,
)

import codegen.common


def _generate_for_class(
    cls: Union[intermediate.AbstractClass, intermediate.ConcreteClass]
) -> Stripped:
    """Generate the code to define how to create new instances of ``cls``."""
    assert (
        not isinstance(cls, intermediate.AbstractClass)
        or len(cls.concrete_descendants) > 0
    ), (
        f"The class {cls.name!r} is abstract, but has no concrete descendants defined. "
        f"We thus do not know how to define a creation of its concrete instances."
    )

    concrete_classes = []  # type: List[intermediate.ConcreteClass]
    if isinstance(cls, intermediate.ConcreteClass):
        concrete_classes.append(cls)

    concrete_classes.extend(cls.concrete_descendants)

    definitions = []  # type: List[Stripped]
    for concrete_cls in concrete_classes:
        name_literal = typescript_common.string_literal(
            codegen.common.identifier_as_label(concrete_cls.name)
        )

        is_name = typescript_naming.function_name(Identifier(f"is_{concrete_cls.name}"))

        new_name = typescript_naming.function_name(
            Identifier(f"new_{concrete_cls.name}")
        )

        definitions.append(
            Stripped(
                f"""\
new Definition(
{I}{name_literal},
{I}aas.types.{is_name},
{I}(
{II}parent: aas.types.Class | null,
{II}relativePathFromParent: Array<number | string>
{I}) => enhancing.enhance(
{II}emptory.{new_name}(),
{II}parent,
{II}relativePathFromParent
{I})
)"""
            )
        )

    for_name = typescript_naming.constant_name(Identifier(f"for_{cls.name}"))

    definitions_joined = ",\n".join(definitions)

    return Stripped(
        f"""\
export const {for_name} =
{I}[
{I}{indent_but_first_line(definitions_joined, I)}
{I}];"""
    )


def generate(symbol_table: intermediate.SymbolTable) -> Stripped:
    """Generate the code to define creation of new instances."""
    blocks = [
        Stripped(
            """\
/**
 * Define how new instances of a class can be created.
 *
 * @remarks
 * This logic might seem unnecessary when only concrete classes without
 * descendants are considered. However, the matter becomes more complex when
 * we deal with classes with one or more concrete descendants:
 *
 * * We have to allow for a dispatch when adding items to a list of
 *   classes with multiple concrete descendants, and
 * * We have to account for a dispatch when creating an embedded instance
 *   of a class with multiple concrete descendants.
 */"""
        ),
        codegen.common.WARNING,
        Stripped(
            """\
import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";

import * as emptory from "./emptory.generated";
import * as enhancing from "./enhancing.generated";"""
        ),
        Stripped(
            f"""\
/**
 * Define how to create a new instance of a class.
 */
export class Definition<ClassT extends aas.types.Class> {{
{I}/**
{I} * Human-readable label of the class
{I} */
{I}label: string;

{I}/**
{I} * Function to check the type at run-time
{I} */
{I}isType: (instance: aas.types.Class) => boolean;

{I}/**
{I} * Function to create an empty instance of the class
{I} */
{I}factory: (
{II}parent: aas.types.Class | null,
{II}relativePathFromParent: Array<number | string>
{I}) => enhancing.Enhanced<ClassT>;

{I}constructor(
{II}label: string,
{II}isType: (instance: aas.types.Class) => boolean,
{II}factory: (
{III}parent: aas.types.Class | null,
{III}relativePathFromParent: Array<number | string>
{II}) => enhancing.Enhanced<ClassT>
{I}) {{
{II}this.label = label;
{II}this.isType = isType;
{II}this.factory = factory;
{I}}}
}}"""
        ),
    ]

    id_set_of_our_types_in_properties = (
        intermediate.collect_ids_of_our_types_in_properties(symbol_table=symbol_table)
    )

    for cls in [
        our_type
        for our_type in symbol_table.our_types
        if isinstance(
            our_type, (intermediate.AbstractClass, intermediate.ConcreteClass)
        )
    ]:
        if id(cls) in id_set_of_our_types_in_properties:
            blocks.append(_generate_for_class(cls))

    blocks.append(codegen.common.WARNING)

    return Stripped("\n\n".join(blocks))
