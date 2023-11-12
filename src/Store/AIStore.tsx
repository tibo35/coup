import { makeAutoObservable } from "mobx";
import { GameStore, PlayersState, Player, CardType } from "./GameStore";

class AIStore {
  gameStore: GameStore;
  blockThreshold: number = 0.5; // Example threshold, adjust as necessary for your AI's risk tolerance

  constructor(gameStore: GameStore) {
    makeAutoObservable(this);
    this.gameStore = gameStore;
  }

  AITurn() {
    const currentPlayerKey = this.gameStore.gameState.currentPlayer;
    if (!currentPlayerKey || currentPlayerKey === "user") {
      console.error("It is not AI's turn.");
      return;
    }

    // AI decision-making logic
    if (this.shouldCoup(currentPlayerKey)) {
      this.gameStore.makeCoup(this.selectTargetForCoup(currentPlayerKey));
    } else if (this.shouldAssassinate(currentPlayerKey)) {
      this.gameStore.getAssassinate(
        currentPlayerKey,
        this.selectTargetForAssassination(currentPlayerKey)
      );
    } else if (this.shouldCollectForeignAid(currentPlayerKey)) {
      this.gameStore.getForeignAid(currentPlayerKey);
    } else {
      this.gameStore.getTakeIncome(currentPlayerKey);
    }
  }

  shouldCoup(currentPlayerKey: keyof PlayersState): boolean {
    if (this.gameStore.players[currentPlayerKey].coins >= 7) {
      return true;
    } else {
      return false;
    }
  }

  selectTargetForCoup(
    currentPlayerKey: keyof PlayersState
  ): keyof PlayersState {
    return "player1"; // Placeholder logic
  }

  shouldAssassinate(currentPlayerKey: keyof PlayersState): boolean {
    return false; // Placeholder logic
  }

  selectTargetForAssassination(
    currentPlayerKey: keyof PlayersState
  ): keyof PlayersState {
    return "player2"; // Placeholder logic
  }

  shouldCollectForeignAid(currentPlayerKey: keyof PlayersState): boolean {
    const playerCoins = this.gameStore.players[currentPlayerKey].coins;

    // If the AI has enough coins for a coup, it might prefer more aggressive actions over foreign aid.
    if (this.gameStore.players[currentPlayerKey].coins >= 7) {
      return false;
    }

    // If the AI has a few coins and is not at immediate risk of being couped, it might try to collect foreign aid.
    // However, if there's a high chance of being blocked (e.g., if opponents often claim the Duke), it should reconsider.
    const chanceOfBeingBlocked = this.estimateChanceOfBeingBlocked();

    // If the chance of being blocked is high, and AI has alternative actions with less risk, avoid foreign aid.
    // This is especially true if the AI has cards like the Duke for Tax or the Assassin for assassination.
    if (
      chanceOfBeingBlocked > this.blockThreshold &&
      this.hasAlternativeIncomeSources(currentPlayerKey)
    ) {
      return false;
    }

    // If the AI has low coins and believes the chance of being blocked is low, it should take foreign aid.
    if (
      this.gameStore.players[currentPlayerKey].coins < 3 &&
      chanceOfBeingBlocked <= this.blockThreshold
    ) {
      return true;
    }

    // If AI has moderate coins, consider the risk and benefit of taking foreign aid.
    if (
      this.gameStore.players[currentPlayerKey].coins >= 3 &&
      this.gameStore.players[currentPlayerKey].coins < 7
    ) {
      return chanceOfBeingBlocked <= this.blockThreshold;
    }

    // If AI is not at risk of a coup from opponents, taking foreign aid can be a reasonable action.
    return true;
  }

  estimateChanceOfBeingBlocked(): number {
    return Math.random(); // Placeholder return
  }

  hasAlternativeIncomeSources(currentPlayerKey: keyof PlayersState): boolean {
    const playerCards = this.gameStore.players[currentPlayerKey]
      .cards as CardType[];

    // Check if the player has cards that can provide income with less risk
    return playerCards.includes("Duke") || playerCards.includes("Captain");
  }
}

export default AIStore;
