import * as React from "react"

import * as widgets from '../widgets'

import {HelpLink} from './HelpLink'

export function ByteArrayFieldOptional(
  props: {
    label: string,
    helpUrl: string | null,
    value: Uint8Array | null,
    onChange: (value: Uint8Array | null) => void,
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
      </div>
    </li>
  )
}
