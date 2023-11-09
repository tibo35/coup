import { makeAutoObservable } from "mobx";
import { GameStore, PlayersState } from "./GameStore";

class AIStore {
  gameStore: GameStore;

  constructor(gameStore: GameStore) {
    makeAutoObservable(this);
    this.gameStore = gameStore;
  }

  aiTakeAction() {
    const currentPlayerKey = this.gameStore.gameState.currentPlayer;
    if (!currentPlayerKey || currentPlayerKey === "user") {
      console.log("It is not AI's turn.");
      return;
    }

    const currentPlayer = this.gameStore.players[currentPlayerKey];

    // AI decision-making logic
    if (currentPlayer.coins >= 7) {
      // If the AI has enough coins for a coup, perform a coup
      this.gameStore.makeCoup(currentPlayerKey);
    } else if (currentPlayer.coins >= 3 && Math.random() < 0.5) {
      // With 3 or more coins, there's a 50% chance to attempt an assassination
      const potentialTargets = Object.keys(this.gameStore.players).filter(
        (key) => key !== "user" && key !== currentPlayerKey
      ) as Array<keyof PlayersState>;
      const target =
        potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
      if (target) {
        this.gameStore.getAssassinate(currentPlayerKey, target);
      }
    } else if (currentPlayer.coins < 3 && Math.random() < 0.7) {
      // With fewer than 3 coins, there's a 70% chance to take foreign aid
      this.gameStore.getForeignAid(currentPlayerKey);
    } else {
      // Otherwise, just take income
      this.gameStore.getTakeIncome(currentPlayerKey);
    }

    // After AI takes action, you may decide to end the turn, offer challenges, etc.
  }
}

export default AIStore;
