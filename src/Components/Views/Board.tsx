import React, { useEffect } from "react";
import "../../App.css";
import { observer, inject } from "mobx-react";
import { GameStore } from "../../Store/GameStore";
import AIStore from "../../Store/AIStore";
import { CardType, Player, PlayersState } from "../../Store/GameStore";
import ActionsButtons from "../ActionsButtons";

interface AppProps {
  gameStore?: GameStore;
  aiStore?: AIStore;
}

const App = inject(
  "gameStore",
  "aiStore"
)(
  observer(({ gameStore, aiStore }: AppProps) => {
    // Use effect hook to manage side-effects and lifecycle events
    useEffect(() => {}, [gameStore]); // Now we depend on gameStore to react to changes

    useEffect(() => {
      // React to changes in blockWindowOpen or other relevant state variables
      if (gameStore?.blockWindowOpen) {
        // Update UI based on block window state
      }
    }, [gameStore?.blockWindowOpen]);
    // AI action logic
    useEffect(() => {
      if (
        gameStore?.gameState.currentPlayer &&
        gameStore.gameState.currentPlayer !== "user"
      ) {
        const aiActionDelay = setTimeout(() => {
          aiStore?.AITurn(); // Call aiTakeAction from AIStore
        }, 1000); // AI will "think" for 1 second

        return () => clearTimeout(aiActionDelay);
      }
    }, [gameStore?.gameState.currentPlayer, aiStore]);

    return (
      <div className="App">
        <div className="board">
          {Object.entries(gameStore?.players ?? {}).map(
            ([player, data], index) => (
              <div key={index} className="deck">
                <p>{player === "user" ? "User" : `Player ${index + 1}`}</p>
                <div className="cards">
                  {data.cards.map((card: CardType, cardIndex: number) => (
                    <div key={cardIndex} className="card">
                      Card {cardIndex + 1}: {card}
                    </div>
                  ))}
                </div>
                <div className="coins">Coins: {data.coins}</div>
                <div className="current-player">
                  Current Player:{" "}
                  {gameStore?.gameState.currentPlayer === "user"
                    ? "User"
                    : gameStore?.gameState.currentPlayer || "None"}
                </div>
              </div>
            )
          )}
        </div>
        <ActionsButtons gameStore={gameStore} />
      </div>
    );
  })
);

export default App;
