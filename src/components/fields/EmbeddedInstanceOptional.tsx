import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react';

import * as fielding from "../instances/fielding.generated";
import * as model from "../../model";
import * as newinstancing from "../../newinstancing.generated";

import {HelpLink} from "./HelpLink";

export function EmbeddedInstanceOptional<ClassT extends aas.types.Class>(
  props: {
    label: string,
    helpUrl: string | null,
    parent: aas.types.Class,
    property: string,
    snapInstance: Readonly<ClassT | null>,
    instance: ClassT | null,
    newInstanceDefinitions: Array<newinstancing.Definition<ClassT>>,
    setInstance: (instance: ClassT | null) => void
  }
) {
  const errorSet = (props.instance !== null)
    ? model.getErrorSet(props.instance)
    : null;

  const descendantsWithErrors = (props.instance !== null)
    ? model.getDescendantsWithErrors(props.instance)
    : null;

  const [hasErrors, setHasErrors] = React.useState(false);

  React.useEffect(
    () => {
      setHasErrors(
        (errorSet !== null && errorSet.size > 0)
        || (descendantsWithErrors !== null && descendantsWithErrors.size > 0)
      )
    },
    [
      errorSet?.versioning.version,
      descendantsWithErrors?.versioning.version
    ]
  )

  const control = (
    (props.snapInstance === null)
      ?
      props.newInstanceDefinitions.map(
        (definition) => {
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
              }>➕ {definition.label}
            </button>
          )
        }
      )
      : (<button onClick={() => {
        props.setInstance(null);
      }}>🗑</button>)
  );

  return (
    <li>
      <span className={!hasErrors ? "aas-label" : "aas-label-with-errors"}
      >{props.label}<HelpLink helpUrl={props.helpUrl}/>:</span>

      <div className="aas-control">
        {control}
      </div>

      <ul className="aas-embedded-instance">
        {
          (props.instance !== null && props.snapInstance !== null) && (
            fielding.componentFor(props.instance, props.snapInstance)
          )
        }
      </ul>

    </li>
  )
}
