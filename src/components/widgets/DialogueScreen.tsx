import * as React from "react";

/**
 * Show a dialogue screen with the buttons representing the options.
 *
 * @remarks
 * If the `message` is `null`, the dialogue is hidden.
 */
export function DialogueScreen(props: {
  message: string | null,
  options: Array<string>,
  onConfirm: (option: string) => void
}) {
  if (props.options.length === 0) {
    console.error("Unexpected empty options in a dialogue screen.")
    throw new Error("Assertion violated")
  }

  const [hidden, setHidden] = React.useState(props.message === null);

  React.useEffect(() => {
      if (props.message !== null) {
        setHidden(false);
      }
    },
    [props.message]
  )

  if (hidden) {
    return <></>
  }

  return (
    <div className="aas-dialogue">
      <div className="aas-dialogue-message">
        {props.message}
      </div>

      <div className="aas-dialogue-options">
        {
          props.options.map(
            (option: string) => {
              return (
                <button
                  className="aas-dialogue-button"
                  key={option}
                  onClick={
                    () => {
                      props.onConfirm(option);
                      setHidden(true);
                    }}>{option}
                </button>
              )
            })
        }
      </div>

    </div>
  )
}
