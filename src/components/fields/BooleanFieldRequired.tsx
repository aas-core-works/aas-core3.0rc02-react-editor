import * as React from "react";

import * as enhancing from "../../enhancing.generated";

import {NonCompositeField} from "./NonCompositeField";

export function BooleanFieldRequired(
  props: {
    label: string,
    helpUrl: string | null,
    value: boolean,
    onChange: (value: boolean) => void,
    errors: Array<enhancing.TimestampedError> | null
  }
) {
  return (
    <NonCompositeField label={props.label} helpUrl={props.helpUrl} errors={props.errors}>
      <input type="checkbox"
             checked={props.value}
             onChange={
               (event) => {
                 props.onChange(event.target.checked)
               }
             }
      />
    </NonCompositeField>
  )
}
