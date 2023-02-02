import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react'

import * as model from "../model";

export function ExportAsJsonButton(props: {snap: Readonly<model.State>}) {
  return (
    <button onClick={() => {
      const jsonable = aas.jsonization.toJsonable(props.snap.environment);
      const text = JSON.stringify(jsonable, null, 2);

      const file = new Blob(
        [text],
        {type: "application/json"}
      );

      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = props.snap.fileName;
      a.click();
    }
    }>
      Export as JSON
    </button>
  );
}