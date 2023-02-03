import * as React from 'react'

import * as emptory from "../emptory.generated"
import * as enhancing from "../enhancing.generated";
import * as model from "../model"
import * as widgets from "./widgets"

export function NewButton(props: { state: model.State }) {
  const [dialogueMessage, setDialogueMessage] = React.useState<string | null>(
    null
  );

  return (
    <>
      <button onClick={
        () => {
          setDialogueMessage(
            "A new environment will delete all the unsaved changes. " +
            "Are you really sure?"
          )
        }
      }>
        New
      </button>
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
