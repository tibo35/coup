import * as React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GameStore from "./Store/GameStore";
import AIStore from "./Store/AIStore";
import { Provider } from "mobx-react";

const gameStore = new GameStore();
const aiStore = new AIStore(gameStore);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider gameStore={gameStore} aiStore={aiStore}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
