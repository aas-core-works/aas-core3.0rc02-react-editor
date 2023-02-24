import * as React from "react";

import {HelpLink} from "./HelpLink";
import {LocalErrors} from "../widgets";
import * as enhancing from "../../enhancing.generated";

/**
 * Represent a field which does not entail any further model instances.
 *
 * @remarks
 * Think of these fields as atomic and enumeration values.
 *
 * *Composite* fields are implemented differently as we have to deal with errors
 * and behavior in a different manner from *non-composite* fields.
 */
export function NonCompositeField(
  props: React.PropsWithChildren<{
    label: string,
    helpUrl: string | null,
    errors: Array<enhancing.TimestampedError> | null
  }>
) {
  const hasErrors = (props.errors !== null && props.errors.length > 0);

  return (
    <li>
      <div className="aas-field">
        <span className={!hasErrors ? "aas-label" : "aas-label-with-errors"}
        >{props.label}<HelpLink helpUrl={props.helpUrl}/>:</span>

        {props.children}
      </div>
      <LocalErrors errors={props.errors}/>
    </li>
  )
}
