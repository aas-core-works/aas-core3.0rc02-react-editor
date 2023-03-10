import * as React from 'react'
import * as valtio from "valtio";

import * as components from './components'
import * as model from "./model"
import * as verification from "./verification"

import './App.css'
import * as debugconf from "./debugconf";

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

  const snapErrorMapVersioning = valtio.useSnapshot(
    props.verification.errorMap.versioning
  );

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

  if (debugconf.DEBUG_WITH_INVARIANTS) {
    React.useEffect(() => {
      props.verification.errorMap.assertErrorCountCorrect(
        snapState.environment
      );
    },
      [snapErrorMapVersioning, snapState])
  }

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

            verification.updateRelativePathsOnStateChange(
              props.state.environment,
              pathInEnvironment,
              value,
              prevValue,
              props.verification.instancesPathVersioning
            );
          }
        }
      );

      return unsubscribe;
    },
    [props.state]
  )

  React.useEffect(() => {
      function handleKey(event: KeyboardEvent) {
        if (event.altKey && event.key === 'n') {
          event.preventDefault();
          props.state.enqueuedAction = model.ACTION_NEW;
        } else if (event.altKey && event.key === 's') {
          event.preventDefault();
          props.state.enqueuedAction = model.ACTION_SAVE;
        } else if (event.altKey && event.key === 'o') {
          event.preventDefault();
          props.state.enqueuedAction = model.ACTION_OPEN;
        }
        return false;
      }

      document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  },
    [snapState.enqueuedAction]
  );


  return (
    <div className="App">
      <div id="toolbar">
        <components.NewButton state={props.state}/>
        <components.ExportAsJsonButton state={props.state}/>
        <components.ImportFromJsonButton state={props.state}/>
      </div>

      <components.Environment
        snapInstance={snapState.environment}
        instance={props.state.environment}
      />

      <components.Errors
        verification={props.verification}
        environment={props.state.environment}
      />
    </div>
  )
}

export default App
