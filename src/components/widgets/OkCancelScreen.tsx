import {DialogueScreen} from "./DialogueScreen";
import React from "react";

const OK_OPTION = "OK"
const CANCEL_OPTION = "Cancel"
const OPTIONS = [OK_OPTION, CANCEL_OPTION];

/**
 * Show an "OK"/"Cancel" dialogue screen.
 *
 * @remarks
 * If the `message` is `null`, the dialogue is hidden.
 */

export function OkCancelScreen(
  props: {
    message: string | null,
    onOk?: (() => void) | undefined,
    onCancel?: (() => void) | undefined
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
          } else if (option === CANCEL_OPTION) {
            if (props.onCancel !== undefined) {
              props.onCancel();
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
