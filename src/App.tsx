import React, { useState, useEffect } from "react";
import "./App.css";
import { observer, inject } from "mobx-react";
import { GameStore } from "./Store/GameStore";

type CardType = "Duke" | "Captain" | "Assassin" | "Contessa" | "Ambassador";

interface PlayerState {
  cards: CardType[];
  coins: number;
}
interface AppProps {
  gameStore?: GameStore; // Make it optional because inject can provide it
}
interface PlayersState {
  player1: PlayerState;
  player2: PlayerState;
  user: PlayerState;
}

const App = inject("gameStore")(
  observer(({ gameStore }: AppProps) => {
    const [openChallengeWindow, setOpenChallengeWindow] =
      useState<boolean>(false);
    const [isChallenged, setIsChallenged] = useState(false);

    // Use effect hook to manage side-effects and lifecycle events
    useEffect(() => {}, [gameStore]); // Now we depend on gameStore to react to changes

    const handleShuffleAndDeal = () => {
      gameStore?.shuffleAndDealCards(); // The `?.` is optional chaining
    };

    const handleTakeIncome = () => {
      if (gameStore?.gameState.currentPlayer) {
        gameStore.getTakeIncome(gameStore.gameState.currentPlayer);
      }
    };
    const handleForeignAid = () => {
      if (gameStore?.gameState.currentPlayer) {
        gameStore.getForeignAid(gameStore.gameState.currentPlayer);
      }
    };
    const handleTax = () => {
      if (gameStore?.gameState.currentPlayer) {
        gameStore.getTax(gameStore.gameState.currentPlayer);
      }
    };

    const handleTurnEnd = () => {
      if (!isChallenged) {
        gameStore?.getNextPlayer(); // Directly call the method on the store
        // The rest of your logic for handling end of turn...
      } else {
        // Handle challenge...
      }
    };
    const handleAssassinate = () => {
      console.log("Assassinate button clicked");

      if (gameStore) {
        const currentPlayerKey = gameStore.gameState.currentPlayer; // Directly use currentPlayer from gameStore
        console.log("Current player is:", currentPlayerKey);

        if (currentPlayerKey) {
          const targetPlayerKey = prompt(
            "Who do you want to assassinate? (player1, player2)"
          );

          if (targetPlayerKey) {
            console.log("Target player selected:", targetPlayerKey);
            gameStore.getAssassinate(
              currentPlayerKey,
              targetPlayerKey as keyof PlayersState
            );
          } else {
            console.log("Assassination cancelled or invalid target");
          }
        } else {
          console.log("No current player set in gameStore");
        }
      } else {
        console.log("gameStore is not available");
      }
    };

    const handleCoup = () => {
      const currentPlayerKey = gameStore?.gameState.currentPlayer;
      if (!currentPlayerKey) {
        alert("It's not currently any player's turn.");
        return;
      }

      const potentialTargets = Object.keys(gameStore.players).filter(
        (playerKey) => playerKey !== currentPlayerKey
      );

      const targetPlayerKey = prompt(
        `Who do you want to coup? (${potentialTargets.join(", ")})`
      );

      if (targetPlayerKey && potentialTargets.includes(targetPlayerKey)) {
        gameStore.makeCoup(targetPlayerKey as keyof PlayersState);
      } else {
        alert("Invalid target selected for coup.");
      }
    };

    // AI action logic
    useEffect(() => {
      if (
        gameStore?.gameState.currentPlayer &&
        gameStore.gameState.currentPlayer !== "user"
      ) {
        const aiActionDelay = setTimeout(() => {
          gameStore.aiTakeAction(); // Directly call the AI action method on the store
        }, 1000); // AI will "think" for 1 second

        return () => clearTimeout(aiActionDelay);
      }
    }, [gameStore?.gameState.currentPlayer]);

    return (
      <div className="App">
        <header>
          <p>Coup</p>
        </header>
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
        <div className="actions-start">
          <button onClick={handleShuffleAndDeal}>Start/Shuffle</button>
        </div>

        <div className="actions-turn">
          <button onClick={handleTakeIncome} /*disabled={incomeTaken}*/>
            Take Income
          </button>
          <button onClick={handleForeignAid} /*disabled={foreignAidTaken}*/>
            Foreign Aid
          </button>
          <button onClick={handleTax} /*disabled={taxTaken}*/>Tax</button>
          <button>Steal</button>
          <button onClick={handleCoup} /*disabled={coup}*/>Coup</button>
          <button>Exchange</button>
          <button onClick={handleAssassinate} /*disabled={assassinate}*/>
            Assassinate
          </button>
        </div>
        <div className="actions-challenge">
          {openChallengeWindow && <button>Challenge</button>}
          <button>Block</button>
          <button>Accept</button>
        </div>

        <div className="actions-end">
          <button onClick={handleTurnEnd}>End Turn</button>
        </div>
      </div>
    );
  })
);

export default App;
