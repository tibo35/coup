import React, { useEffect, useState } from "react";
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
    const [instruction, setInstruction] = useState("Welcome to the game!");
    // Handle updates to the current message
    useEffect(() => {
      if (gameStore) {
        setInstruction(gameStore.currentMessage);
      }
    }, [gameStore?.currentMessage]);

    // Handle AI actions
    useEffect(() => {
      let aiActionDelay: number | undefined;

      if (
        gameStore?.gameState.currentPlayer &&
        gameStore.gameState.currentPlayer !== "user"
      ) {
        aiActionDelay = window.setTimeout(() => {
          aiStore?.AITurn();
        }, 1000);
      }

      // Cleanup
      return () => {
        if (aiActionDelay !== undefined) {
          clearTimeout(aiActionDelay);
        }
      };
    }, [gameStore, aiStore, gameStore?.gameState.currentPlayer]);

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
        <div className="game-actions">
          <div className="instruction message">{instruction}</div>
          <ActionsButtons gameStore={gameStore} />
        </div>
      </div>
    );
  })
);
export default Board;
