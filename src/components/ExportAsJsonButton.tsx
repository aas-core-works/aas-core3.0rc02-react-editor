import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react'

import * as model from "../model";
import * as valtio from "valtio";

export function ExportAsJsonButton(
  props: {
    state: model.State
  }
  ) {
  const snapState = valtio.useSnapshot(props.state);

  function save() {
    const jsonable = aas.jsonization.toJsonable(snapState.environment);
    const text = JSON.stringify(jsonable, null, 2);

    const file = new Blob(
      [text],
      {type: "application/json"}
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = snapState.fileName;
    a.click();
  }

  React.useEffect(
    () => {
      if (snapState.enqueuedAction === model.ACTION_SAVE) {
        save();
        props.state.enqueuedAction = null;
      }
    },
    [snapState.enqueuedAction]
  )

  return (
    <button onClick={save}>
      Export as JSON
    </button>
  );
}