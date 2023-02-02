import * as React from "react";

import * as incrementalid from "../../incrementalid";
import * as widgets from '../widgets'

import {HelpLink} from "./HelpLink";

export function TextFieldOptional(
  props: {
    label: string,
    helpUrl: string | null,
    value: string | null,
    onChange: (value: string | null) => void
  }
) {
  const inputId = React.useState(incrementalid.next())[0];

  return (
    <li>
      <div className="aas-field">
        <span className="aas-label">
          {props.label}<HelpLink helpUrl={props.helpUrl}/>:
        </span>

        <widgets.TextAreaAutoResized
          id={inputId}
          content={props.value === null ? "" : props.value}
          onChange={(content: string) => {
            if (content === "") {
              props.onChange(null);
            } else {
              props.onChange(content);
            }
          }}
        />
      </div>
    </li>
  )
}
