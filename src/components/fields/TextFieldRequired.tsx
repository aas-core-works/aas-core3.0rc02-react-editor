import * as React from "react";

import * as incrementalid from "../../incrementalid";
import * as widgets from '../widgets'

import {HelpLink} from "./HelpLink";

export function TextFieldRequired(
  props: {
    label: string,
    helpUrl: string | null,
    value: string,
    onChange: (value: string) => void
  }
) {
  const inputId = React.useState(incrementalid.next())[0];

  return (
    <li className="aas-field">
      <div className="aas-field">
        <span className="aas-label">
          {props.label}<HelpLink helpUrl={props.helpUrl}/>:
        </span>

        <widgets.TextAreaAutoResized
          id={inputId}
          content={props.value}
          onChange={props.onChange}
        />
      </div>
    </li>
  )
}
