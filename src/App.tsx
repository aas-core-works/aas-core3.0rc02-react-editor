import * as valtio from "valtio";
import * as React from 'react'

import * as components from './components'
import * as model from "./model"

import './App.css'

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

function App() {
  const snap = valtio.useSnapshot(model.STATE) as Readonly<typeof model.STATE>;

  useUnload((event) => {
    event.preventDefault();
  })

  return (
    <div className="App">
      <components.Environment
        snapInstance={snap.environment}
        instance={model.STATE.environment}
      />

      <div id="toolbar">
        <components.NewButton state={model.STATE}/>
        <components.ExportAsJsonButton snap={snap}/>
        <components.ImportFromJsonButton state={model.STATE}/>
      </div>
    </div>
  )
}

export default App
