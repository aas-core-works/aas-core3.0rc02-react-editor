import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import * as valtio from "valtio";
import * as model from "./model";
import * as verificationModule from "./verification";

const state = valtio.proxy(new model.State());
const verification = new verificationModule.Verification();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App state={state} verification={verification}/>
  </React.StrictMode>,
)
