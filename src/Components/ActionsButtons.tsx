import React from "react";
import { GameStore, PlayersState } from "../Store/GameStore";

interface ActionsButtonsProps {
  gameStore?: GameStore;
}

const ActionsButtons: React.FC<ActionsButtonsProps> = ({ gameStore }) => {
  const handleShuffleAndDeal = () => {
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
      <div className="actions-start">
        <button onClick={handleShuffleAndDeal}>Start/Shuffle</button>
      </div>
      <div className="actions-turn">
        <button onClick={handleTakeIncome}>Take Income</button>
        <button onClick={handleForeignAid}>Foreign Aid</button>
        <button onClick={handleTax}>Tax</button>
        <button onClick={handleCoup}>Coup</button>
        <button onClick={handleAssassinate}>Assassinate</button>
      </div>
      {gameStore?.blockWindowOpen && (
        <div className="actions-block">
          <button onClick={() => handleBlockAction("Block")}>Block</button>
          <button onClick={() => handleBlockAction("Pass")}>Pass</button>
        </div>
      )}
      <button onClick={() => handleBlockAction("Challenge")}>Challenge</button>
    </div>
  );
};

export default ActionsButtons;
