import * as React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { gameStore } from "./Store/GameStoreInstance";
import { Provider } from "mobx-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider gameStore={gameStore}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
