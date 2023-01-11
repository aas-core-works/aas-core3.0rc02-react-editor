import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react';

import * as fielding from "../instances/fielding.generated";
import * as newinstancing from "../../newinstancing.generated";

import {HelpLink} from "./HelpLink";

export function EmbeddedInstanceOptional<ClassT extends aas.types.Class>(
  props: {
    label: string,
    helpUrl: string | null,
    snapInstance: Readonly<ClassT | null>,
    instance: ClassT | null,
    newInstanceDefinitions: Array<newinstancing.Definition<ClassT>>,
    setInstance: (instance: ClassT | null) => void
  }
) {
  const control = (
    (props.snapInstance === null)
      ?
      props.newInstanceDefinitions.map(
        (definition) => {
          return (
            <button
              key={definition.label}
              onClick={() => {
                props.setInstance(definition.factory())
              }
              }>➕ {definition.label}
            </button>
          )
        }
      )
      : (
        <button onClick={() => {
          props.setInstance(null)
        }}>🗑</button>
      )
  )

  return (
    <li>
      <span className="aas-label"
      >{props.label}<HelpLink helpUrl={props.helpUrl}/>:</span>

      <div className="aas-control">
        {control}
      </div>

      {
        (props.snapInstance !== null) && (
          <ul className="aas-embedded-instance">
            {
              fielding.componentFor(
                props.instance!,
                props.snapInstance
              )
            }
          </ul>
        )
      }
    </li>
  )
}
