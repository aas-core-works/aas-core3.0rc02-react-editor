import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react';

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
  return (
    <li className="aas-instance">
      <details open>
        <summary>
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
