// SPDX-FileCopyrightText: 2021 aas-core3.0rc02-react-editor AUTHORS
//
// SPDX-License-Identifier: MIT

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
