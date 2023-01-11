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
                const ourId = model.getOurId(model.mustAsEnhanced(item));

                return (
                  <ListItem
                    key={ourId}
                    snapInstance={snapItem}
                    instance={item}
                    remove={
                      () => {
                        let newItems = model.removeFromContainer(
                          props.items,
                          ourId
                        );
                        if (newItems?.length === 0) {
                          newItems = null;
                        }

                        props.setItems(newItems);
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
                      props.setItems(
                        model.addToContainer(
                          definition.factory(),
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
