import * as React from "react";

import * as incrementalid from "../../incrementalid";

import {HelpLink} from "./HelpLink";

export function EnumerationFieldRequired<EnumT extends number>(
  props: {
    label: string,
    helpUrl: string | null,
    getLiterals: () => IterableIterator<EnumT>,
    literalToString: (literal: EnumT) => string,
    selected: EnumT,
    onChange: (value: EnumT) => void
  }
) {
  // noinspection DuplicatedCode
  const inputId = React.useState(incrementalid.next())[0];

  const valuesAndDescriptions = React.useState<Array<[string, string]>>(
    (() => {
      const realizedValuesAndDescriptions = new Array<[string, string]>();
      for (const literal of props.getLiterals()) {
        realizedValuesAndDescriptions.push(
          [
            literal.toString(),
            props.literalToString(literal)
          ]
        )
      }
      return realizedValuesAndDescriptions;
    })()
  )[0];

  return (
    <li>
      <div className="aas-field">
        <span className="aas-label">
          {props.label}<HelpLink helpUrl={props.helpUrl}/>:
        </span>

        <select
          id={inputId}
          defaultValue={props.selected.toString()}
          onChange={
            (event) => {
              props.onChange(parseInt(event.target.value) as EnumT);
            }
          }
        >
          {
            valuesAndDescriptions.map((valueAndDescription => {
              const [value, description] = valueAndDescription;

              return (
                <option key={value} value={value}>{description}</option>
              )
            }))
          }
        </select>
      </div>
    </li>
  )
}
