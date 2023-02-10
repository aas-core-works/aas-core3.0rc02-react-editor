import * as aas from "@aas-core-works/aas-core3.0rc02-typescript";
import * as React from 'react'

import * as enhancing from "../enhancing.generated";
import * as model from "../model";
import * as widgets from "./widgets";

export function ImportFromJsonButton(props: { state: model.State }) {
  const [splashMessage, setSplashMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    null
  );

  return (
    <>
    <button onClick={() => {
      const fileInput = document.createElement("input");
      fileInput.type = 'file';
      fileInput.style.display = 'none';
      fileInput.onchange = function (event) {
        const target = (event.target as HTMLInputElement);

        if (target.files && target.files.length > 0) {
          const fileName = target.files[0].name;

          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target && typeof(event.target.result) === 'string') {
              const text = event.target.result;

              let jsonable = null;
              try {
                jsonable = JSON.parse(text);
              } catch(error) {
                setErrorMessage(
                    "One or more errors occurred while parsing the JSON file "
                    + error
                )
              }

              if (jsonable !== null) {
                const environmentAndErrors = (
                  aas.jsonization.environmentFromJsonable(jsonable)
                );

                if (environmentAndErrors.error !== null) {
                  setErrorMessage(
                    "One or more errors occurred while parsing the JSON file "
                    + environmentAndErrors.error
                  );
                } else {
                  // noinspection UnnecessaryLocalVariableJS
                  const environment = enhancing.enhance(
                    environmentAndErrors.mustValue(),
                    null,
                    []
                  );

                  props.state.environment = environment;
                  props.state.fileName = fileName;
                }

                props.state.fileName = fileName;
              }
            }
            setSplashMessage(null);
          }
          setSplashMessage("Loading...");
          reader.readAsText(target.files[0]);
        }
      }
      fileInput.click();
    }
    }>
      Import from JSON
    </button>
    <widgets.SplashScreen message={splashMessage} />
    <widgets.OkScreen message={errorMessage}/>
    </>
  );
}
