import React, { useEffect } from "react";
import "./Board.css";
import { observer, inject } from "mobx-react";
import { GameStore } from "../../Store/GameStore";
import AIStore from "../../Store/AIStore";
import { CardType, Player, PlayersState } from "../../Store/GameStore";
import ActionsButtons from "../ActionsButtons";
import AIHand from "../AIHand";
import UserHand from "../UserHand";
interface BoardProps {
  gameStore?: GameStore;
  aiStore?: AIStore;
}

const Board = inject(
  "gameStore",
  "aiStore"
)(
  observer(({ gameStore, aiStore }: BoardProps) => {
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
          <div className="ai-hands-container">
            {Object.entries(gameStore?.players ?? {})
              .filter(([player]) => player !== "user")
              .map(([player, data], index) => (
                <AIHand
                  key={player}
                  playerLabel={`Player ${index + 1}`}
                  cards={data.cards}
                  coins={data.coins}
                  flippedCards={data.flippedCards} // Pass the flippedCards array
                />
              ))}
          </div>
          {gameStore?.players?.user && (
            <UserHand
              cards={gameStore.players.user.cards as CardType[]}
              coins={gameStore.players.user.coins}
              flippedCards={gameStore.players.user.flippedCards} // Pass the flippedCards array
            />
          )}
        </div>
        <ActionsButtons gameStore={gameStore} />
      </div>
    );
  })
);
export default Board;
