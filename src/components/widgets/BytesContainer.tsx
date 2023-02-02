import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as  mimetype from "../../mimetype";

// From: https://usehooks.com/useDebounce/
function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value or delay changes
    [value, delay]
  );

  return debouncedValue;
}


export function BytesContainer(
  props: {
    content: Uint8Array | null,
    setContent: (bytes: Uint8Array) => void,
    clear: () => void,
    contentType: string | null
  }
) {
  function renderContent(): React.ReactElement | string {
    if (props.content !== null && props.contentType !== null) {
      const mimeType = mimetype.parse(props.contentType);

      console.log('mimeType after parse is', mimeType)

      if (mimeType !== null) {
        const src = `data:${props.contentType};base64,${aas.common.base64Encode(props.content)}`;

        if (mimeType.type === "image") {
          const src = `data:${props.contentType};base64,${aas.common.base64Encode(props.content)}`;
          return (
            <a href={src} target="_blank">
              <img
                src={src}
                alt="Bytes as image"
                className="aas-bytes-container-as-image"
              />
            </a>
          )
        } else if (
          (mimeType.type === "text" && mimeType.subtype === "plain")
          || (mimeType.type == "application" && mimeType.subtype == "json")
        ) {
          console.log(mimeType.parameters)
          const charsetParameter = mimeType.parameters.get("charset");

          const encoding =
            (charsetParameter === undefined)
              ? 'utf-8'
              : charsetParameter;

          let text = null;

          try {
            text = (
              new TextDecoder(encoding, {fatal: false})
                .decode(props.content)
            );

            return (
              <pre className="aas-bytes-container-as-text">{text}</pre>
            )
          } catch(RangeError) {
            // Range error means invalid encoding.
            // We pass and let the default return handle the input.
          }
        }
      }
    }

    return (
      (props.content === null || props.content.length === 0)
        ? "No bytes"
        : "Some " + props.content.length + " byte(s)."
    );
  }

  const [uploading, setUploading] = React.useState(false);

  const [content, setContent] = React.useState<React.ReactElement | string>(
    renderContent()
  );

  const debouncedContentType = useDebounce(props.contentType, 200);

  React.useEffect(
    () => {
      setContent(renderContent());
    },
    [debouncedContentType, props.content]
  )

  return (
    <div className="aas-bytes-container">
      <div>
        {content}
      </div>

      <button
        disabled={props.content === null}
        onClick={
          (event) => {
            if (props.content === null) {
              return;
            }

            const blob = new Blob([props.content], {
              type: (props.contentType !== null)
                ? props.contentType
                : 'application/octet-stream'
            });

            const url = window.URL.createObjectURL(blob);

            const dummyA = document.createElement('a');
            dummyA.href = url;

            let filename = null;
            if (props.contentType !== null) {
              const mimeType = mimetype.parse(props.contentType);
              if (mimeType !== null) {
                const [_, subtype] = mimeType.subtype;
                if (subtype.length > 0) {
                  filename = `something.${subtype}`;
                }
              }
            }
            dummyA.download = filename !== null ? filename : 'something';
            dummyA.style.display = 'none';
            dummyA.click();
            dummyA.remove();

            // NOTE (mristin, 2023-02-01):
            // We need to revoke the URL object to avoid memory leakage.
            // The timeout is arbitrary and does not rely to downloading of
            // the blob.
            setTimeout(function () {
              return window.URL.revokeObjectURL(url);
            }, 1000);
          }
        }>Download
      </button>

      <button
        disabled={uploading}
        onClick={
          (event) => {
            const fileInput = document.createElement("input");
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            fileInput.onchange = function (event) {
              const target = (event.target as HTMLInputElement);

              if (target.files && target.files.length > 0) {
                const reader = new FileReader();

                reader.onload = (event) => {
                  try {
                    if (
                      event.target
                      && typeof (event.target.result) === 'object'
                    ) {
                      props.setContent(
                        new Uint8Array(
                          event.target.result as unknown as ArrayBuffer
                        )
                      );
                    }
                  } finally {
                    setUploading(false);
                  }
                }

                if (target.files.length > 0) {
                  setUploading(true);
                  reader.readAsArrayBuffer(target.files[0]);
                }
              }
            }
            fileInput.click();
          }
        }
      >{(!uploading) ? "Upload" : "Uploading..."}
      </button>
      <button onClick={() => props.clear()}>🗑</button>
    </div>
  )
}
