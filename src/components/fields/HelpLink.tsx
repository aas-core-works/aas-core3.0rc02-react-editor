import * as React from "react";

export function HelpLink(
  props: {
    helpUrl: string | null
  }
) {
  return (props.helpUrl !== null)
    ? (<a href={props.helpUrl} target="_blank" className="aas-help-link">❓</a>)
    : <></>
}
