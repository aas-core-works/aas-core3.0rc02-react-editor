import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react';
import * as valtio from 'valtio';

import * as enhancing from '../../enhancing.generated'
import * as model from '../../model'
import * as titling from '../../titling.generated'
import * as fielding from '../instances/fielding.generated'

export function ListItem<ClassT extends aas.types.Class>(
  props: {
    snapInstance: Readonly<ClassT>,
    instance: ClassT,
    remove: () => void,
    shiftLeft: (() => void) | null,
    shiftRight: (() => void) | null
  }
) {
  const errorSetVersioning = valtio.useSnapshot(
    model.getErrorSet(props.instance).versioning
  );

  const descendantsWithErrorsVersioning = valtio.useSnapshot(
    model.getDescendantsWithErrors(props.instance).versioning
  );

  const [hasErrors, setHasErrors] = React.useState(false);

  React.useEffect(
    () => {
      setHasErrors(
        model.getErrorSet(props.instance).size > 0
        || model.getDescendantsWithErrors(props.instance).size > 0
      );
    },
    [
      errorSetVersioning.version,
      descendantsWithErrorsVersioning.version,
      props.instance
    ]
  )

  return (
    <li className="aas-instance">
      <details open>
        <summary
          className={hasErrors ? "aas-list-item-with-errors" : ""}
        >
          {titling.getTitle(props.snapInstance)}

          <button
            className="aas-remove-button"
            onClick={() => props.remove()}
          >🗑
          </button>

          {
            (props.shiftLeft !== null) && (
              <button
                className="aas-shift-left-button"
                onClick={() => props.shiftLeft!()}
              >⇡
              </button>
            )
          }

          {
            (props.shiftRight !== null) && (
              <button
                className="aas-shift-right-button"
                onClick={() => props.shiftRight!()}
              >⇣
              </button>
            )
          }
        </summary>

        <ul>
          {
            fielding.componentFor(
              props.instance,
              props.snapInstance
            )
          }
        </ul>
      </details>
    </li>
  );
}
