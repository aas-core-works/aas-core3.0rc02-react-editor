import * as React from 'react'
import * as valtio from 'valtio'

import * as emptory from "../emptory.generated"
import * as enhancing from "../enhancing.generated";
import * as model from "../model"
import * as widgets from "./widgets"


export function NewButton(props: { state: model.State }) {
  const [dialogueMessage, setDialogueMessage] = React.useState<string | null>(
    null
  );

  function showDialogue() {
    setDialogueMessage(
      "A new environment will delete all the unsaved changes. " +
      "Are you really sure?"
    )
  }

  const snapState = valtio.useSnapshot(props.state);

  React.useEffect(
    () => {
      if (props.state.enqueuedAction === model.ACTION_NEW) {
        setDialogueMessage(
          "A new environment will delete all the unsaved changes. " +
          "Are you really sure?"
        );
        props.state.enqueuedAction = null;
      }
    },
    [snapState.enqueuedAction]
  )

  return (
    <>
      <button onClick={showDialogue} title="alt+n">New</button>
      <widgets.OkCancelScreen
        message={dialogueMessage}
        onOk={
          () => {
            props.state.environment = enhancing.enhance(
              emptory.newEnvironment(),
              null,
              []
            );

            props.state.fileName = model.INITIAL_FILENAME;
          }
        }
      />
    </>
  );
}
