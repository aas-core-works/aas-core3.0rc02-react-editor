import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";
import * as model from "../../model"
import * as newinstancing from "../../newinstancing.generated"

import {HelpLink} from "./HelpLink";
import {ListItem} from "./ListItem"

export function ListFieldOptional<ClassT extends aas.types.Class>(
  props: {
    label: string,
    helpUrl: string | null,
    parent: aas.types.Class,
    property: string,
    newInstanceDefinitions: Array<newinstancing.Definition<ClassT>>,
    snapItems: ReadonlyArray<ClassT> | null,
    items: Readonly<Array<ClassT> | null>,
    setItems: (items: Array<ClassT> | null) => void
  }
) {
  return (
    <li>
      <span className="aas-label"
      >{props.label}<HelpLink helpUrl={props.helpUrl}/>:</span>

      <ul className="aas-list">
        {
          props.snapItems?.map(
            (snapItem, i) => {
              const item = props.items![i];
              const ourId = model.getOurId(item);

              return (
                <ListItem
                  key={ourId}
                  snapInstance={snapItem}
                  instance={item}
                  remove={
                    () => {
                      props.setItems(
                        model.removeFromContainer(
                          props.items,
                          ourId,
                          true
                        )
                      );
                    }
                  }

                  shiftLeft={
                    (i === 0) ? null : () => {
                      props.setItems(
                        model.moveInContainer(
                          props.items!,
                          ourId,
                          i - 1
                        )
                      );
                    }
                  }

                  shiftRight={
                    (i == props.items!.length - 1) ? null : () => {
                      props.setItems(
                        model.moveInContainer(
                          props.items!,
                          ourId,
                          i + 1
                        )
                      );
                    }
                  }
                />
              )
            }
          )
        }
      </ul>

      {
        props.newInstanceDefinitions.map(
          (definition) => {
            return (
              <button
                key={definition.label}
                onClick={
                  () => {
                    const newItem = definition.factory(
                      props.parent,
                      [
                        props.property,
                        props.items === null ? 0 : props.items.length
                      ]
                    );

                    props.setItems(
                      model.addToContainer(
                        newItem,
                        props.items
                      )
                    );
                  }
                }>➕ {definition.label}
              </button>
            )
          }
        )
      }
    </li>
  );
}
