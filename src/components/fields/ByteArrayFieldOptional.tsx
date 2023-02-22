import * as React from "react"

import * as widgets from '../widgets'
import * as enhancing from "../../enhancing.generated";

import {NonCompositeField} from "./NonCompositeField";

export function ByteArrayFieldOptional(
  props: {
    label: string,
    helpUrl: string | null,
    value: Uint8Array | null,
    onChange: (value: Uint8Array | null) => void,
    contentType: string | null,
    errors: Array<enhancing.TimestampedError> | null
  }
) {
  return (
    <NonCompositeField label={props.label} helpUrl={props.helpUrl} errors={props.errors}>
      <widgets.BytesContainer
        content={props.value}
        setContent={(content: Uint8Array) => {
          if (content.length === 0) {
            props.onChange(null);
          } else {
            props.onChange(content);
          }
        }}
        clear={() => props.onChange(null)}
        contentType={props.contentType}
      />
    </NonCompositeField>
  )
}
