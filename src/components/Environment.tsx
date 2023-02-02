import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react';

import * as instances from "./instances";

export function Environment(
  props: {
    snapInstance: Readonly<aas.types.Environment>,
    instance: aas.types.Environment
  }
) {
  return (
    <div className="aas-root">
      <h1>Environment</h1>
      <ul className="aas-tree">
        <instances.EnvironmentFields
          snapInstance={props.snapInstance}
          instance={props.instance}
        />
      </ul>
    </div>
  );
}
