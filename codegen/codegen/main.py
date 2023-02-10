"""Generate the code based on the meta-model."""

import argparse
import pathlib
import sys

import aas_core_codegen.run
import aas_core_meta.v3rc2
from aas_core_codegen.common import Stripped

import codegen.common
import codegen.generate_emptory
import codegen.generate_instances
import codegen.generate_newinstancing
import codegen.generate_titling
import codegen.generate_enhancing


def main() -> int:
    """Execute the main routine."""
    parser = argparse.ArgumentParser(description=__doc__)
    _ = parser.parse_args()

    model = aas_core_meta.v3rc2

    # noinspection PyTypeChecker
    model_path = pathlib.Path(model.__file__)

    symbol_table_atok, error_as_str = aas_core_codegen.run.load_model(
        model_path=model_path
    )

    if error_as_str is not None:
        print(error_as_str, file=sys.stderr)
        return 1

    assert symbol_table_atok is not None

    symbol_table, _ = symbol_table_atok

    model_id = Stripped(model.__name__.rsplit(".", maxsplit=1)[-1])

    codegen.generate_instances.generate(
        symbol_table=symbol_table,
        instances_dir=codegen.common.REPO_ROOT / "src/components/instances",
        model_id=model_id,
    )

    (codegen.common.REPO_ROOT / "src/emptory.generated.ts").write_text(
        codegen.generate_emptory.generate(symbol_table=symbol_table) + "\n",
        encoding="utf-8",
    )

    (codegen.common.REPO_ROOT / "src/newinstancing.generated.ts").write_text(
        codegen.generate_newinstancing.generate(symbol_table=symbol_table) + "\n",
        encoding="utf-8",
    )

    (codegen.common.REPO_ROOT / "src/titling.generated.ts").write_text(
        codegen.generate_titling.generate(symbol_table=symbol_table) + "\n",
        encoding="utf-8",
    )

    (codegen.common.REPO_ROOT / "src/enhancing.generated.ts").write_text(
        codegen.generate_enhancing.generate(symbol_table=symbol_table) + "\n",
        encoding="utf-8",
    )

    return 0


if __name__ == "__main__":
    sys.exit(main())
