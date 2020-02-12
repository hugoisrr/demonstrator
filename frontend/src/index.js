import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DataContextProvider } from "./components/context";

ReactDOM.render(
  <DataContextProvider data={[]}>
    <App />
  </DataContextProvider>,

  document.getElementById("root")
);
