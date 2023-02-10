import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";
import * as valtio from "valtio";

import * as hooks from "./hooks"
import * as verification from '../verification'

function sortErrors(
  iterable: IterableIterator<verification.TimestampedError>
): Array<verification.TimestampedError> {
  const errors = Array.from(iterable);

  errors.sort(
    (that, other) => {
      const thatKey = that.pathAsString();
      const otherKey = other.pathAsString();
      if (thatKey === otherKey) {
        if (that.message < other.message) {
          return -1;
        } else if (that.message == other.message) {
          return 0;
        } else {
          return 1;
        }
      } else {
        if (thatKey < otherKey) {
          return -1;
        } else if (thatKey == otherKey) {
          return 0;
        } else {
          return 1;
        }
      }
    }
  );

  return errors;
}

export function Errors(
  props: {
    verification: verification.Verification,
    snapEnvironment: Readonly<aas.types.Environment>,
  }
) {

  // We need to re-render whenever the state changes as the paths might
  // be different.
  const [timestampedErrors, setTimestampedErrors] =
    React.useState<Array<verification.TimestampedError> | null>(
      null
    )

  const snapInstancesPathVersioning = valtio.useSnapshot(
    props.verification.instancesPathVersioning
  );

  const snapErrorVersioning = valtio.useSnapshot(
    props.verification.errorMap.versioning
  );

  const debouncedPathVersion = hooks.useDebounce(
    snapInstancesPathVersioning.version,
    200
  );

  const debouncedErrorVersion = hooks.useDebounce(
    snapErrorVersioning.version,
    200
  );

  React.useEffect(
    () => {
      const errors = sortErrors(props.verification.errorMap.errors());
      if (errors.length === 0) {
        setTimestampedErrors(null);
      } else {
        setTimestampedErrors(errors);
      }
    },
    [
      debouncedPathVersion,
      debouncedErrorVersion
    ]
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
                <li key={timestampedError.guid}>
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
