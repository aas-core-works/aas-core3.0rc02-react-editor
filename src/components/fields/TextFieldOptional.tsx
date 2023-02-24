import * as React from "react";

import * as widgets from '../widgets'
import * as enhancing from "../../enhancing.generated";

import {NonCompositeField} from "./NonCompositeField";

export function TextFieldOptional(
  props: {
    label: string,
    helpUrl: string | null,
    value: string | null,
    onChange: (value: string | null) => void,
    errors: Array<enhancing.TimestampedError> | null
  }
) {
  return (
    <NonCompositeField label={props.label} helpUrl={props.helpUrl} errors={props.errors}>
      <widgets.TextAreaAutoResized
        content={props.value === null ? "" : props.value}
        onChange={(content: string) => {
          if (content === "") {
            props.onChange(null);
          } else {
            props.onChange(content);
          }
        }}
      />
    </NonCompositeField>
  )
}
