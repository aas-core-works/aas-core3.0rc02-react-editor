import * as React from 'react'
import * as valtio from "valtio";

import * as components from './components'
import * as model from "./model"
import * as verification from "./verification"

import './App.css'
import * as enhancing from "./enhancing.generated";
import * as emptory from "./emptory.generated";

function useUnload<FuncT extends (event: BeforeUnloadEvent) => any>(
  func: FuncT
) {
  const callback = React.useRef(func);

  React.useEffect(() => {
    const onUnload = callback.current;
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [callback]);
}

const ERROR_CAP = 100;

function App(props: {
  state: model.State,
  verification: verification.Verification
}) {
  const snapState =
    valtio.useSnapshot(props.state) as Readonly<typeof props.state>;

  useUnload((event) => {
    event.preventDefault();
  })

  React.useEffect(() => {
      const continuousVerification = new verification.ContinuousVerification(
        props.verification,
        ERROR_CAP
      );

      continuousVerification.start()

      return () => {
        continuousVerification.stop()
      };
    },
    [props.verification]
  )

  React.useEffect(() => {
      // noinspection UnnecessaryLocalVariableJS
      const unsubscribe = valtio.subscribe(
        props.state,
        (ops) => {
          for (const op of ops) {
            if (op[1].length == 0 || op[1][0] !== 'environment') {
              // We ignore all the changes not done to the environment.
              continue;
            }

            if (op[0] !== 'set') {
              console.error(
                `Unexpected op code ${op[0]} in the environment change`,
                op
              );
              throw new Error("Assertion violated");
            }

            const [_, path, value, prevValue] = op;

            const pathInEnvironment = path.slice(1);
            verification.updateVerificationOnStateChange(
              props.state.environment,
              pathInEnvironment,
              value,
              prevValue,
              new Date().getTime(),
              props.verification
            );

            verification.updatePathVersionOnStateChange(
              props.verification.instancesPathVersioning,
              pathInEnvironment
            );
          }
        }
      );

      return unsubscribe;
    },
    [props.state]
  )

  return (
    <div className="App">
      <div id="toolbar">
        <components.NewButton state={props.state}/>
        <components.ExportAsJsonButton snap={snapState}/>
        <components.ImportFromJsonButton state={props.state}/>
      </div>

      <components.Environment
        snapInstance={snapState.environment}
        instance={props.state.environment}
      />

      <components.Errors
        verification={props.verification}
        snapEnvironment={snapState.environment}
      />
    </div>
  )
}

export default App
