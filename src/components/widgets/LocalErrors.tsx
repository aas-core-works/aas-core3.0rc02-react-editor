import * as React from "react";

import * as enhancing from "../../enhancing.generated";


export function LocalErrors(
  props: {
    errors: Array<enhancing.TimestampedError> | null
  }
) {
  if (props.errors === null || props.errors.length === 0) {
    return (<></>);
  }

  return (
    <div className="aas-errors">
      <ul>
        {
          props.errors?.map((error) => {
              return (
                <li key={error.guid} id={`localized-error-${error.guid}`}>
                  <span className="aas-error-message">{error.message}</span>
                </li>
              );
            }
          )
        }
      </ul>
    </div>
  );
}