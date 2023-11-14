import * as React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GameStore from "./Store/GameStore";
import AIStore from "./Store/AIStore";
import { Provider } from "mobx-react";

const gameStore = new GameStore(); // Create GameStore instance first
const aiStore = new AIStore(gameStore); // Pass gameStore to AIStore
gameStore.setAIStore(aiStore);
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
