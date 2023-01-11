import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react';

import * as titling from '../../titling.generated'
import * as fielding from '../instances/fielding.generated'
import * as model from "../../model"

export function ListItem<ClassT extends aas.types.Class>(
  props: {
    snapInstance: Readonly<ClassT>,
    instance: ClassT,
    remove: (ourId: string) => void
  }
) {
  return (
    <li className="aas-instance">
      <details open>
        <summary>
          {titling.getTitle(props.snapInstance)}

          <button
            className="aas-remove-button"
            onClick={() => {
              props.remove(model.getOurId(props.snapInstance))
            }}
          >🗑
          </button>
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
