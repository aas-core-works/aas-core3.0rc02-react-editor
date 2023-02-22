import * as React from "react";

import * as enhancing from "../../enhancing.generated";
import * as widgets from '../widgets'

import {NonCompositeField} from "./NonCompositeField";

export function TextFieldRequired(
  props: {
    label: string,
    helpUrl: string | null,
    value: string,
    onChange: (value: string) => void,
    errors: Array<enhancing.TimestampedError> | null
  }
) {
  return (
    <NonCompositeField label={props.label} helpUrl={props.helpUrl} errors={props.errors}>
      <widgets.TextAreaAutoResized
        content={props.value}
        onChange={props.onChange}
      />
    </NonCompositeField>
  )
}
