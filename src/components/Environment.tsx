import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react';

import * as instances from "./instances";
import * as model from "../model";
import {HelpLink} from "./fields/HelpLink";

export function Environment(
  props: {
    snapInstance: Readonly<aas.types.Environment>,
    instance: aas.types.Environment
  }
) {
  const errorSet = model.getErrorSet(props.instance);
  const descendantsWithErrors = model.getDescendantsWithErrors(props.instance);
  const [hasErrors, setHasErrors] = React.useState(false);

  React.useEffect(
    () => {
      setHasErrors(
        errorSet.size > 0 || descendantsWithErrors.size > 0
      )
    },
    [
      errorSet.versioning.version,
      descendantsWithErrors.versioning.version
    ]
  )

  return (
    <div className="aas-root">
      <h1 className={
        !hasErrors
          ? "aas-environment-title"
          : "aas-environment-title-with-errors"
      }
      >Environment</h1>
      <ul className="aas-tree">
        <instances.EnvironmentFields
          snapInstance={props.snapInstance}
          instance={props.instance}
        />
      </ul>
    </div>
  );
}
