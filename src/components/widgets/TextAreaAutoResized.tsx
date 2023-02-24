import * as React from "react";

export function TextAreaAutoResized(props: {
  content: string,
  onChange: (content: string) => void
}) {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
      if (textAreaRef.current) {
        // This first assignment is necessary to reset scroll height!
        textAreaRef.current.style.height = "0px";

        textAreaRef.current.style.height = (
          "min(" + textAreaRef.current.scrollHeight + "px, 10em)"
        );
      }
    },
    [textAreaRef]
  )

  const [selection, setSelection] =
    React.useState<[number, number | null] | null>(null);

  React.useEffect(
    () => {
      if (textAreaRef.current !== null && selection !== null) {
        textAreaRef.current.setSelectionRange(selection[0], selection[1]);
      }
    },
    [textAreaRef, selection, props.content]
  )

  return (
    <textarea
      rows={1}
      style={{resize: "none", minHeight: "1.1em"}}
      ref={textAreaRef}
      value={props.content}
      onChange={
        (event) => {
          props.onChange(event.target.value);

          if (textAreaRef.current) {
            // This first assignment is necessary to reset scroll height!
            textAreaRef.current.style.height = "0px";

            textAreaRef.current.style.height = (
              "min(" + textAreaRef.current.scrollHeight + "px, 10em)"
            );
          }

          setSelection(
            [event.target.selectionStart, event.target.selectionEnd]
          );
        }
      }
    />
  )
}
