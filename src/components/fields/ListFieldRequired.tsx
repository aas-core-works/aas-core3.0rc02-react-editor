import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from "react";

import * as model from "../../model"
import * as newinstancing from "../../newinstancing.generated";

import {HelpLink} from "./HelpLink";
import {ListItem} from "./ListItem"

export function ListFieldRequired<ClassT extends aas.types.Class>(
  props: {
    label: string,
    helpUrl: string | null,
    parent: aas.types.Class,
    property: string,
    newInstanceDefinitions: Array<newinstancing.Definition<ClassT>>,
    snapItems: ReadonlyArray<ClassT>,
    items: Readonly<Array<ClassT>>,
    setItems: (items: Array<ClassT>) => void
  }
) {
  // See: https://github.com/facebook/react/issues/14476#issuecomment-471199055
  // and https://stackoverflow.com/questions/59467758/passing-array-to-useeffect-dependency-list
  const itemsErrorSetVersions = props.items
    .map((item) => model.getErrorSet(item).versioning.version)
    .join(",");

  const descendantsWithErrorsVersions =
    props.items
      .map(
        (item) => model.getDescendantsWithErrors(item).versioning.version)
      .join(",");

  const [hasErrors, setHasErrors] = React.useState(false);

  React.useEffect(
    () => {
      setHasErrors(
        props.items.some(
          (item) => model.getErrorSet(item).size === 0)
        || props.items.some(
        (item) => model.getDescendantsWithErrors(item).size === 0
        )
      )
    },
    [
      itemsErrorSetVersions,
      descendantsWithErrorsVersions
    ]
  )


  return (
    <li>
      <span className={!hasErrors ? "aas-label" : "aas-label-with-errors"}
      >{props.label}<HelpLink helpUrl={props.helpUrl}/>:</span>

      <ul className="aas-list">
        {
          props.snapItems.map(
            (snapItem, i) => {
              const item = props.items[i];
              const ourId = model.getOurId(item);

              return (
                <ListItem
                  key={ourId}
                  snapInstance={snapItem}
                  instance={item}
                  remove={
                    () => {
                      const newItems = model.removeFromContainer(
                        props.items,
                        ourId,
                        false
                      );

                      if (newItems === null) {
                        console.error("Unexpected newItems null", props.items)
                        throw new Error("Assertion violation")
                      } else {
                        props.setItems(newItems);
                      }
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
