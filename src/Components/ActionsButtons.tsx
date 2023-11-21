import React from "react";
import "./ActionsButtons.css";
import { GameStore, PlayersState } from "../Store/GameStore";
import "./Button.css";
interface ActionsButtonsProps {
  gameStore?: GameStore;
}

const ActionsButtons: React.FC<ActionsButtonsProps> = ({ gameStore }) => {
  const handleStart = () => {
    gameStore?.shuffleAndDealCards();
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
  const isUsersTurn = () => {
    return gameStore?.gameState.currentPlayer === "user";
  };

  const handleAssassinate = () => {
    const currentPlayerKey = gameStore?.gameState.currentPlayer;
    if (currentPlayerKey) {
      const targetPlayerKey = prompt(
        "Who do you want to assassinate? (player1, player2)"
      );
      if (targetPlayerKey) {
        gameStore.getAssassinate(
          currentPlayerKey,
          targetPlayerKey as keyof PlayersState
        );
      }
    }
  };

  const handleCoup = () => {
    const currentPlayerKey = gameStore?.gameState.currentPlayer;
    if (currentPlayerKey) {
      const potentialTargets = Object.keys(gameStore.players).filter(
        (playerKey) => playerKey !== currentPlayerKey
      );

      const targetPlayerKey = prompt(
        `Who do you want to coup? (${potentialTargets.join(", ")})`
      );
      if (targetPlayerKey && potentialTargets.includes(targetPlayerKey)) {
        gameStore.makeCoup(targetPlayerKey as keyof PlayersState);
      }
    }
  };

  const handleBlockAction = (action: string, isBlockChallenged = false) => {
    const currentPlayerKey = gameStore?.gameState.currentPlayer;

    if (action === "Block") {
      if (currentPlayerKey && gameStore.currentActionType) {
        gameStore.attemptBlock(
          "user",
          gameStore.currentActionType,
          isBlockChallenged
        );
      }
    } else if (action === "Challenge") {
      if (currentPlayerKey && gameStore.challengedPlayer) {
        gameStore.initiateChallenge("user", gameStore.challengedPlayer);
      }
    } else {
      gameStore?.closeBlockWindow();
      gameStore?.setNextPlayer();
    }
  };

  return (
    <div className="actions-container">
      {!gameStore?.cardsDealt && (
        <div className="start actions">
          <button className="button-73" onClick={handleStart}>
            Start
          </button>
        </div>
      )}
      {isUsersTurn() &&
        !gameStore?.blockWindowOpen &&
        gameStore?.cardsDealt && (
          <div className="actions">
            <div>
              <button className="button-73" onClick={handleTakeIncome}>
                Income
              </button>
              <button className="button-73" onClick={handleForeignAid}>
                Foreignaid
              </button>
              <button className="button-73" onClick={handleTax}>
                Tax
              </button>
            </div>
            <div>
              <button className="button-73" onClick={handleCoup}>
                Coup
              </button>
              <button className="button-73" onClick={handleAssassinate}>
                Assassinate{" "}
              </button>
            </div>
          </div>
        )}
      {gameStore?.blockWindowOpen && (
        <div className="actions">
          <button
            className="button-73"
            onClick={() => handleBlockAction("Pass")}>
            Accept
          </button>
          <button
            className="button-73"
            onClick={() => handleBlockAction("Block")}>
            Block
          </button>
          <button
            className="button-73"
            onClick={() => handleBlockAction("Challenge")}>
            Challenge
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionsButtons;
