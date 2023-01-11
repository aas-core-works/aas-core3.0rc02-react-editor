import * as React from "react";

import * as incrementalid from "../../incrementalid";

import {HelpLink} from "./HelpLink";

export function EnumerationFieldOptional<EnumT extends number>(
  props: {
    label: string,
    helpUrl: string,
    getLiterals: () => IterableIterator<EnumT>,
    literalToString: (literal: EnumT) => string,
    selected: EnumT | null,
    onChange: (value: EnumT | null) => void
  }
) {
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
          defaultValue={
            props.selected === null ? "null" : props.selected.toString()
          }
          onChange={
            (event) => {
              if (event.target.value === "") {
                props.onChange(null);
              } else {
                props.onChange(parseInt(event.target.value) as EnumT);
              }
            }
          }
        >
          <option
            key="null"
            value="null"
            className="aas-unspecified-option"
          >
            Not specified
          </option>

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
