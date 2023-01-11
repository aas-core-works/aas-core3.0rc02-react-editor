import * as React from "react";

import * as incrementalid from "../../incrementalid";

import {HelpLink} from "./HelpLink";

export function BooleanFieldRequired(
  props: {
    label: string,
    helpUrl: string | null,
    value: boolean,
    onChange: (value: boolean) => void
  }
) {
  const inputId = React.useState(incrementalid.next())[0];

  return (
    <li>
      <div className="aas-field">
        <span className="aas-label">
          {props.label}<HelpLink helpUrl={props.helpUrl}/>:
        </span>

        <input type="checkbox" id={inputId}
               checked={props.value}
               onChange={
                 (event) => {
                   props.onChange(event.target.checked)
                 }
               }
        />
      </div>
    </li>
  )
}
