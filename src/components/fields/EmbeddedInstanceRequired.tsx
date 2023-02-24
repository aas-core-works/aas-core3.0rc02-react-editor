import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react';

import * as fielding from "../instances/fielding.generated";
import * as model from "../../model";
import * as newinstancing from "../../newinstancing.generated";

import {HelpLink} from "./HelpLink";

export function EmbeddedInstanceRequired<ClassT extends aas.types.Class>(
  props: {
    label: string,
    helpUrl: string | null,
    parent: aas.types.Class,
    property: string,
    snapInstance: Readonly<ClassT>,
    instance: ClassT,
    newInstanceDefinitions: Array<newinstancing.Definition<ClassT>>,
    setInstance: (instance: ClassT) => void
  }
) {
  const errorSet = model.getErrorSet(props.instance);

  const descendantsWithErrors = model.getDescendantsWithErrors(props.instance);

  const [hasErrors, setHasErrors] = React.useState(false);

  React.useEffect(
    () => {
      setHasErrors(
        errorSet.size > 0 || descendantsWithErrors.size > 0
      )
    },
    [
      errorSet.versioning.version,
      descendantsWithErrors.versioning.version
    ]
  )

  const control = (
    props.newInstanceDefinitions.map(
      (definition) => {
        // We need to check the type to avoid senseless replacements.
        if (!definition.isType(props.instance)) {
          return (
            <button
              key={definition.label}
              onClick={() => {
                props.setInstance(
                  definition.factory(
                    props.parent,
                    [props.property]
                  )
                );
              }
              }>🔄 {definition.label}
            </button>
          )
        }
      }
    )
  );

  return (
    <li>
      <span className={!hasErrors ? "aas-label" : "aas-label-with-errors"}
      >{props.label}<HelpLink helpUrl={props.helpUrl}/>:</span>

        <ul className="aas-embedded-instance">
          {
            fielding.componentFor(
              props.instance,
              props.snapInstance
            )
          }
        </ul>
    </li>
  )
}
