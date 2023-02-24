import * as React from "react";

import * as incrementalid from "../../incrementalid";
import * as enhancing from "../../enhancing.generated";

import {NonCompositeField} from "./NonCompositeField";

export function BooleanFieldOptional(
  props: {
    label: string,
    helpUrl: string | null,
    value: boolean | null,
    onChange: (value: boolean | null) => void,
    errors: Array<enhancing.TimestampedError> | null
  }
) {
  const name = React.useState(incrementalid.next())[0];
  const yesId = React.useState(incrementalid.next())[0];
  const noId = React.useState(incrementalid.next())[0];
  const nothingId = React.useState(incrementalid.next())[0];

  return (
    <NonCompositeField label={props.label} helpUrl={props.helpUrl} errors={props.errors}>
      <input type="radio" name={name} id={nothingId} value="null"
             onClick={() => props.onChange(null)}
             checked={props.value === null}
      />
      <label htmlFor={nothingId}>Not specified</label>

      <input type="radio" name={name} id={noId}
             onClick={() => props.onChange(false)}
             checked={props.value === false}
      />
      <label htmlFor={noId}>No</label>

      <input type="radio" name={name} id={yesId} value="1"
             onClick={() => props.onChange(true)}
             checked={props.value === true}
      />
      <label htmlFor={yesId}>Yes</label>
    </NonCompositeField>
  )
}
