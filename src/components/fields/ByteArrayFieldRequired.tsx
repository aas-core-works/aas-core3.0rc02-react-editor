import * as React from "react"

import * as widgets from '../widgets'

import {HelpLink} from "./HelpLink"

export function ByteArrayFieldRequired(
  props: {
    label: string,
    helpUrl: string | null,
    value: Uint8Array,
    onChange: (value: Uint8Array) => void,
    contentType: string | null
  }
) {
  return (
    <li>
      <div className="aas-field">
        <span className="aas-label">
          {props.label}<HelpLink helpUrl={props.helpUrl}/>:
        </span>

        <widgets.BytesContainer
          content={props.value}
          setContent={props.onChange}
          clear={() => props.onChange(new Uint8Array())}
          contentType={props.contentType}
        />
      </div>
    </li>
  )
}
