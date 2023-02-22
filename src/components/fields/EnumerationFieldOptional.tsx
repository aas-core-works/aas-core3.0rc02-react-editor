import * as React from "react";

import * as enhancing from "../../enhancing.generated";

import {NonCompositeField} from "./NonCompositeField";

export function EnumerationFieldOptional<EnumT extends number>(
  props: {
    label: string,
    helpUrl: string,
    getLiterals: () => IterableIterator<EnumT>,
    literalToString: (literal: EnumT) => string,
    selected: EnumT | null,
    onChange: (value: EnumT | null) => void,
    errors: Array<enhancing.TimestampedError> | null
  }
) {
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
    <NonCompositeField label={props.label} helpUrl={props.helpUrl} errors={props.errors}>
      <select
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
    </NonCompositeField>
  )
}
