// SPDX-FileCopyrightText: 2021 aas-core3.0rc02-react-editor AUTHORS
//
// SPDX-License-Identifier: MIT

import * as React from "react";

import * as enhancing from "../../enhancing.generated";
import * as widgets from '../widgets'

import {NonCompositeField} from "./NonCompositeField";

export function TextFieldRequired(
  props: {
    label: string,
    helpUrl: string | null,
    value: string,
    onChange: (value: string) => void,
    errors: Array<enhancing.TimestampedError> | null
  }
) {
  return (
    <NonCompositeField label={props.label} helpUrl={props.helpUrl} errors={props.errors}>
      <widgets.TextAreaAutoResized
        content={props.value}
        onChange={props.onChange}
      />
    </NonCompositeField>
  )
}
