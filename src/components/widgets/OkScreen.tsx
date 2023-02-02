import {DialogueScreen} from "./DialogueScreen";
import React from "react";

const OK_OPTION = "OK"
const OPTIONS = [OK_OPTION]

/**
 * Show an "OK" dialogue screen.
 *
 * @remarks
 * If the `message` is `null`, the dialogue is hidden.
 */
export function OkScreen(
  props: {
    message: string | null,
    onOk?: (() => void) | undefined,
  }
) {
  return (
    <DialogueScreen
      options={OPTIONS}
      message={props.message}
      onConfirm={
        (option: string) => {
          if (option === OK_OPTION) {
            if (props.onOk !== undefined) {
              props.onOk();
            }
          } else {
            console.error("Unexpected option", option)
            throw new Error("Assertion violation")
          }
        }
      }
    />
  );
}
