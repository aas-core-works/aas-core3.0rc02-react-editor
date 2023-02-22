import * as React from "react"

import * as widgets from '../widgets'
import * as enhancing from "../../enhancing.generated";

import {NonCompositeField} from "./NonCompositeField";

export function ByteArrayFieldRequired(
  props: {
    label: string,
    helpUrl: string | null,
    value: Uint8Array,
    onChange: (value: Uint8Array) => void,
    contentType: string | null,
    errors: Array<enhancing.TimestampedError> | null
  }
) {
  return (
    <NonCompositeField label={props.label} helpUrl={props.helpUrl} errors={props.errors}>
      <widgets.BytesContainer
        content={props.value}
        setContent={props.onChange}
        clear={() => props.onChange(new Uint8Array())}
        contentType={props.contentType}
      />
    </NonCompositeField>
  )
}
