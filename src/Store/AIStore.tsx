import { makeAutoObservable } from "mobx";
import {
  GameStore,
  PlayersState,
  Player,
  CardType,
  ActionHistory,
} from "./GameStore";

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

    if (this.shouldCoup(currentPlayerKey)) {
      this.gameStore.makeCoup(this.selectTarget(currentPlayerKey));
    } else if (this.shouldAssassinate(currentPlayerKey)) {
      // If the AI should assassinate, call the getAssassinate method
      this.gameStore.getAssassinate(
        currentPlayerKey,
        this.selectTarget(currentPlayerKey)
      );
    } else if (this.shouldCollectTax(currentPlayerKey)) {
      // Call the getTax method if the AI should collect tax
      this.gameStore.getTax(currentPlayerKey);
    } else if (this.shouldCollectForeignAid(currentPlayerKey)) {
      this.gameStore.getForeignAid(currentPlayerKey);
    } else {
      this.gameStore.getTakeIncome(currentPlayerKey);
    }
  }

  selectTarget(currentPlayerKey: keyof PlayersState): keyof PlayersState {
    // Get a list of potential targets, excluding the current player
    const potentialTargets = Object.keys(this.gameStore.players)
      .filter((key) => key !== currentPlayerKey)
      .map((key) => key as keyof PlayersState);

    if (potentialTargets.length === 0) {
      console.error("No valid targets for coup.");
      return currentPlayerKey; // Fallback
    }

    // Sort the potential targets based on the number of cards and then by coins
    potentialTargets.sort((a, b) => {
      const playerA = this.gameStore.players[a];
      const playerB = this.gameStore.players[b];

      if (playerA.cards.length !== playerB.cards.length) {
        // Prioritize the player with more cards
        return playerB.cards.length - playerA.cards.length;
      } else {
        // If the number of cards is the same, prioritize the player with more coins
        return playerB.coins - playerA.coins;
      }
    });

    // Return the first target in the sorted list
    return potentialTargets[0];
  }

  shouldCoup(currentPlayerKey: keyof PlayersState): boolean {
    if (this.gameStore.players[currentPlayerKey].coins >= 7) {
      return true;
    } else {
      return false;
    }
  }

  shouldAssassinate(currentPlayerKey: keyof PlayersState): boolean {
    const hasAssassin =
      this.gameStore.players[currentPlayerKey].cards.includes("Assassin");
    const hasEnoughCoins = this.gameStore.players[currentPlayerKey].coins >= 3;

    return hasAssassin && hasEnoughCoins;
  }

  shouldCollectForeignAid(currentPlayerKey: keyof PlayersState): boolean {
    const playerCoins = this.gameStore.players[currentPlayerKey].coins;

    // if there's a high chance of being blocked it should reconsider.
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

  shouldCollectTax(currentPlayerKey: keyof PlayersState): boolean {
    const hasDuke =
      this.gameStore.players[currentPlayerKey].cards.includes("Duke");
    return hasDuke;
  }

  estimateChanceOfBeingBlocked(): number {
    const currentPlayerKey = this.gameStore.gameState.currentPlayer;
    if (!currentPlayerKey) {
      return 0; // No current player, return 0 chance
    }

    let blockClaims = {
      duke: 0,
      captain: 0,
      contessa: 0,
    };
    let totalPlayers = 0;

    // Iterate through each player except the current AI player
    Object.values(this.gameStore.players).forEach((player) => {
      if (player !== this.gameStore.players[currentPlayerKey]) {
        totalPlayers++;
        player.actionHistory.forEach((action: ActionHistory) => {
          if (action.claimedCard) {
            if (action.claimedCard === "Duke") {
              blockClaims.duke++;
            } else if (action.claimedCard === "Captain") {
              blockClaims.captain++;
            } else if (action.claimedCard === "Contessa") {
              blockClaims.contessa++;
            }
          }
        });
      }
    });

    // Example calculation for Duke block chance; adapt for Captain and Contessa as needed
    const dukeBlockChance = blockClaims.duke / totalPlayers;

    // Combine and normalize the block chances based on your game logic
    // The logic here can be more complex based on the specific action being evaluated
    const totalBlockChance = dukeBlockChance; // Placeholder, you might want to combine captain and contessa chances here too

    return totalBlockChance;
  }

  hasAlternativeIncomeSources(currentPlayerKey: keyof PlayersState): boolean {
    const playerCards = this.gameStore.players[currentPlayerKey]
      .cards as CardType[];

    // Check if the player has cards that can provide income with less risk
    return playerCards.includes("Duke") || playerCards.includes("Captain");
  }

  blockForeignAid(blockingPlayerKey: keyof PlayersState) {
    if (this.gameStore.players[blockingPlayerKey].cards.includes("Duke")) {
      console.log(
        `${blockingPlayerKey} has blocked foreign aid with the Duke card.`
      );
      // Handle the block logic here
      // You might want to revert the foreign aid action or simply end the turn
    } else {
      console.log(
        `${blockingPlayerKey} cannot block foreign aid without the Duke card.`
      );
    }
  }
  handleAIChallenge() {
    console.log("AI is handling a challenge.");
    if (
      this.gameStore.isChallengeActive &&
      this.gameStore.challengedPlayer &&
      this.gameStore.challenger &&
      this.gameStore.currentActionType
    ) {
      // For now, let AI always accept the challenge
      this.gameStore.resolveChallenge(); // Call resolveChallenge from GameStore
    } else {
      console.log("Missing information for AI challenge.");
    }
  }
}

export default AIStore;
