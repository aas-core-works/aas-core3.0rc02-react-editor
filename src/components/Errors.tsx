import * as React from "react";
import * as valtio from "valtio";

import * as verification from '../verification'

export function Errors(
  props: {
    verification: verification.Verification
  }
) {

  // We need to re-render whenever errors change.
  const errorVersioning = valtio.useSnapshot(
    props.verification.errorMap.versioning
  );

  const [timestampedErrors, setTimestampedErrors] =
    React.useState<Array<verification.TimestampedError> | null>(
      null
    )

  React.useEffect(
    () => {
      const errors = Array.from(props.verification.errorMap.errors());
      errors.sort(verification.compareTimestampedErrors);
      errors.reverse();
      setTimestampedErrors(errors);
    },
    [errorVersioning.version]
  )

  if (timestampedErrors == null) {
    return <></>
  }

  return (
    <div className="aas-errors">
      <h1>Errors</h1>
      <ul>
        {
          (timestampedErrors?.map(
            (timestampedError) => {
              return (
                <li key={
                  `${timestampedError.pathAsString()}:` +
                  timestampedError.message
                }>
                  <span className="aas-error-path">
                    {timestampedError.pathAsString()}
                  </span>

                  <span className="aas-error-message">
                    {timestampedError.message}
                  </span>
                </li>
              )
            }))
        }
      </ul>
    </div>
  )
}
