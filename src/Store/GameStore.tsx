import { makeAutoObservable } from "mobx";
import { action, observable } from "mobx";
import { type } from "os";
import AIStore from "./AIStore";
export type ActionHistory = {
  action: string;
  claimedCard?: CardType;
};
export type Player = {
  cards: string[];
  coins: number;
  actionHistory: ActionHistory[]; // New property to track player actions
  flippedCards: boolean[];
};

export interface PlayersState {
  player1: Player;
  player2: Player;
  user: Player;
}
export type CardType =
  | "Duke"
  | "Captain"
  | "Assassin"
  | "Contessa"
  | "Ambassador";

export type GameState = {
  currentPlayer: keyof PlayersState | null;
};
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export class GameStore {
  aiStore?: AIStore; // Add aiStore as an optional property

  setAIStore(aiStore: AIStore) {
    this.aiStore = aiStore;
  }
  players: PlayersState = {
    player1: { cards: [], coins: 2, actionHistory: [], flippedCards: [] },
    player2: { cards: [], coins: 2, actionHistory: [], flippedCards: [] },
    user: { cards: [], coins: 2, actionHistory: [], flippedCards: [] },
  };

  gameState: GameState = {
    currentPlayer: "user",
  };

  blockWindowOpen = false; // New property to track if block window is open
  currentActionType: string | null = null; // New property to track the current action type being blocked

  isChallengeActive = false;
  challenger: keyof PlayersState | null = null;
  challengedPlayer: keyof PlayersState | null = null;
  currentMessage = "Ready?";
  constructor() {
    makeAutoObservable(this);
    this.players.player1.flippedCards = [false, false];
    this.players.player2.flippedCards = [false, false];
    this.players.user.flippedCards = [false, false];
  }
  // Method to emit messages
  @action
  emitMessage(message: string) {
    this.currentMessage = message;
  }
  @action
  setNextPlayer() {
    this.gameState.currentPlayer = this.getNextPlayer();
  }

  @action
  shuffleAndDealCards() {
    const cardTypes = ["Duke", "Captain", "Assassin", "Contessa", "Ambassador"];
    let deck: string[] = [];
    // Populate the deck with the card types
    cardTypes.forEach((type) => {
      for (let i = 0; i < 3; i++) {
        deck.push(type);
      }
    });

    // Shuffle the deck using Fisher-Yates shuffle
    shuffleArray(deck);
    // Deal two cards to each player
    const updatedPlayers: PlayersState = {
      player1: {
        cards: [deck.pop()!, deck.pop()!],
        coins: 2,
        actionHistory: [],
        flippedCards: [false, false],
      },
      player2: {
        cards: [deck.pop()!, deck.pop()!],
        coins: 2,
        actionHistory: [],
        flippedCards: [false, false],
      },
      user: {
        cards: [deck.pop()!, deck.pop()!],
        coins: 2,
        actionHistory: [],
        flippedCards: [false, false],
      },
    };

    // Update the players in the store
    this.players = updatedPlayers;

    // Determine and set the starting player
    const startingPlayer: keyof PlayersState = `player${
      Math.floor(Math.random() * 2) + 1
    }` as keyof PlayersState;
    this.gameState.currentPlayer = startingPlayer;
    this.emitMessage(`Game Started`);
    setTimeout(() => {
      this.emitMessage(`${startingPlayer} it's your turn!`);
    }, 1000);
    console.log("START - First Player: " + startingPlayer);
  }

  @action
  getTakeIncome(playerKey: keyof PlayersState) {
    if (this.players[playerKey].cards.length === 0) {
      console.log(`${playerKey} has no cards left and cannot take action.`);
      return;
    }
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 1; // Increment the coins by 1 for income
      console.log("take income");
      this.players[playerKey].actionHistory.push({ action: "Take Income" });
    }
    this.emitMessage(`${playerKey} took income.`);
    this.openBlockWindow("Income");
  }

  @action
  getForeignAid(playerKey: keyof PlayersState) {
    if (this.players[playerKey].cards.length === 0) {
      console.log(`${playerKey} has no cards left and cannot take action.`);
      return;
    }
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 2; // Increment the coins by 2 for foreign aid
      console.log("take foreign aid");
      this.players[playerKey].actionHistory.push({ action: "Take ForeignAid" });
    }
    this.emitMessage(`${playerKey} took Foregin Aid.`);

    this.openBlockWindow("Foreign Aid");
  }

  @action
  getTax(playerKey: keyof PlayersState) {
    if (this.players[playerKey].cards.length === 0) {
      console.log(`${playerKey} has no cards left and cannot take action.`);
      return;
    }
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 3; // Increment the coins by 3 for tax
      console.log("take tax");
      this.players[playerKey].actionHistory.push({ action: "Take Tax" });
    }
    this.emitMessage(`${playerKey} took Tax.`);

    this.openBlockWindow("Tax");
  }

  @action
  getAssassinate(
    assassinPlayerKey: keyof PlayersState,
    targetPlayerKey: keyof PlayersState
  ) {
    const assassinPlayer = this.players[assassinPlayerKey];
    const targetPlayer = this.players[targetPlayerKey];
    // prevent assassination on loser
    if (
      targetPlayer.cards.length === 0 ||
      targetPlayer.flippedCards.every((flipped) => flipped)
    ) {
      console.log(`${targetPlayerKey} has no cards left to be assassinated.`);
      alert(
        `${targetPlayerKey} cannot be assassinated as they have no cards left.`
      );
      return;
    }

    if (assassinPlayer.coins >= 3) {
      assassinPlayer.coins -= 3; // Deduct the cost of assassination
      if (targetPlayer.cards.length > 0) {
        // Flip the last card of the target player
        const firstUnflippedIndex = targetPlayer.flippedCards.findIndex(
          (flipped) => !flipped
        );
        if (firstUnflippedIndex !== -1) {
          targetPlayer.flippedCards[firstUnflippedIndex] = true;
          console.log(
            `Flipping card at index ${firstUnflippedIndex} for ${targetPlayerKey}`
          );
        } else {
          console.log(`${targetPlayerKey} has no more cards to flip.`);
        }
      }
      console.log(
        `${assassinPlayerKey} has assassinated a card from ${targetPlayerKey}`
      );
      // Any additional logic (such as changing turns) can go here
      // You might also need to handle what happens if the assassination is challenged
    } else {
      alert("You cannot assassinate because you do not have enough coins.");
    }
    this.openBlockWindow("Assassination");
  }

  @action
  makeCoup(targetPlayerKey: keyof PlayersState) {
    const currentPlayerKey = this.gameState.currentPlayer;

    if (!currentPlayerKey) {
      console.log("No current player to perform a coup.");
      return;
    }

    const currentPlayer = this.players[currentPlayerKey];
    const targetPlayer = this.players[targetPlayerKey];

    //prevent coup on loser:
    if (
      targetPlayer.cards.length === 0 ||
      targetPlayer.flippedCards.every((flipped) => flipped)
    ) {
      console.log(`${targetPlayerKey} has no cards left to coup.`);
      alert(`${targetPlayerKey} cannot be couped as they have no cards left.`);
      return;
    }

    // Check if the current player has enough coins to coup
    if (currentPlayer.coins < 7) {
      alert("You cannot coup because you don't have enough coins.");
      return;
    }

    // Deduct coins and remove a card from the target player
    currentPlayer.coins -= 7;

    // Flip the last card of the target player
    if (targetPlayer.cards.length > 0) {
      const firstUnflippedIndex = targetPlayer.flippedCards.findIndex(
        (flipped) => !flipped
      );
      if (firstUnflippedIndex !== -1) {
        targetPlayer.flippedCards[firstUnflippedIndex] = true;
        console.log(
          `Flipping card at index ${firstUnflippedIndex} for ${targetPlayerKey}`
        );
      } else {
        console.log(`${targetPlayerKey} has no more cards to flip.`);
      }
    }
    console.log(
      `${currentPlayerKey} has successfully couped ${targetPlayerKey}`
    );

    // Move to the next player
    this.setNextPlayer();
  }

  @action
  getNextPlayer(): keyof PlayersState | null {
    const playerOrder: (keyof PlayersState)[] = ["player1", "player2", "user"];
    const currentIndex = playerOrder.indexOf(this.gameState.currentPlayer!);

    for (let i = 1; i < playerOrder.length; i++) {
      // Find the next player in the order
      const nextIndex = (currentIndex + i) % playerOrder.length;
      const nextPlayerKey = playerOrder[nextIndex];

      // Check if the next player has playable cards
      const nextPlayer = this.players[nextPlayerKey];
      const hasPlayableCards =
        nextPlayer.cards.length > 0 &&
        nextPlayer.flippedCards.some((flipped) => !flipped);

      if (hasPlayableCards) {
        console.log("Next player:", nextPlayerKey);
        return nextPlayerKey;
      }
    }

    console.log("No valid players remaining.");
    alert("Player " + this.gameState.currentPlayer + " has won the game!");
    return null; // Return null if no valid players are found
  }

  @action
  openBlockWindow(actionType: string) {
    this.blockWindowOpen = true;
    this.currentActionType = actionType;
    console.log(`Block window open for ${actionType}.`);
    if (this.gameState.currentPlayer === "user") {
      this.aiStore?.decideOnBlockChallenge("user", actionType);
    }
  }

  @action
  attemptBlock(
    playerKey: keyof PlayersState,
    actionType: string,
    isBlockChallenged: boolean
  ) {
    console.log(`${playerKey} attempts to block ${actionType}`);
    if (this.gameState.currentPlayer) {
      this.openChallengeWindow(
        this.gameState.currentPlayer,
        playerKey,
        actionType
      );
    } else {
      console.log("Error: No current player to open challenge window for.");
    }
  }

  @action
  openChallengeWindow(
    currentPlayerKey: keyof PlayersState,
    blockingPlayerKey: keyof PlayersState,
    actionType: string
  ) {
    console.log(
      `Challenge window opened for ${currentPlayerKey} to respond to ${blockingPlayerKey}'s block of ${actionType}`
    );
    this.challengedPlayer = currentPlayerKey; // The player who made the block
    this.challenger = blockingPlayerKey; // The player who is responding to the block
    this.currentActionType = actionType; // The type of action being blocked
    this.handleAIChallenge();
  }

  @action
  handleAIChallenge() {
    if (this.challengedPlayer && this.challenger && this.currentActionType) {
      // Check if aiStore is set before using it
      if (this.aiStore) {
        this.aiStore.decideOnBlockChallenge(
          this.challengedPlayer,
          this.currentActionType
        );
      } else {
        console.log("AI Store is not set.");
      }
    } else {
      console.log("Missing information for AI challenge.");
    }
  }

  @action
  revertAction(playerKey: keyof PlayersState | null, actionType: string) {
    if (!playerKey) return;
    const player = this.players[playerKey];
    switch (actionType) {
      case "Foreign Aid":
        player.coins -= 2; // Revert foreign aid action
        break;
      // Add cases for other actions as needed
    }
    this.setNextPlayer();
  }

  @action
  processBlockOutcome(
    isBlocked: boolean,
    challengerKey: keyof PlayersState,
    challengedPlayerKey: keyof PlayersState
  ) {
    if (isBlocked) {
      console.log("Action was successfully blocked.");
      // If the block is accepted without challenge
      // Handle the logic for a successful block
      // This could mean reverting the original action or modifying its effects
      this.closeBlockWindow();
    } else {
      console.log("Block is being challenged.");
      // Initiate a challenge if the block is not accepted
      this.initiateChallenge(challengerKey, challengedPlayerKey);
    }
  }

  @action
  closeBlockWindow() {
    this.blockWindowOpen = false;
    this.currentActionType = null;
  }

  blockForeignAid(blockingPlayerKey: keyof PlayersState) {
    if (this.players[blockingPlayerKey].cards.includes("Duke")) {
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

  // test
  @action
  initiateChallenge(
    challengerKey: keyof PlayersState,
    challengedPlayerKey: keyof PlayersState
  ) {
    this.isChallengeActive = true;
    this.challenger = challengerKey;
    this.challengedPlayer = challengedPlayerKey;
    // Logic to handle the initiation of a challenge goes here
    console.log("challenge initiated");
  }

  @action
  resolveChallenge() {
    if (!this.challenger || !this.challengedPlayer || !this.currentActionType) {
      console.log("No active challenge to resolve or missing information.");
      return;
    }

    // Determine if the challenged player was bluffing
    const wasBluff = this.isBluff(
      this.challengedPlayer,
      this.currentActionType
    );

    if (wasBluff) {
      // The challenged player was bluffing and therefore loses a card
      if (this.players[this.challengedPlayer].cards.length > 0) {
        this.players[this.challengedPlayer].cards.pop();
      }
      console.log(`${this.challengedPlayer} was bluffing and loses a card.`);
    } else {
      // The challenged player was not bluffing; the challenger loses a card
      if (this.players[this.challenger].cards.length > 0) {
        this.players[this.challenger].cards.pop();
      }
      console.log(`${this.challenger} challenged wrongly and loses a card.`);
    }

    // Reset challenge state
    this.isChallengeActive = false;
    this.challenger = null;
    this.challengedPlayer = null;

    // Move to the next player
    this.setNextPlayer();
  }

  @action
  isBluff(playerKey: keyof PlayersState, actionType: string): boolean {
    const player = this.players[playerKey];
    const requiredCard = this.getCardRequiredForAction(actionType);

    // Check if requiredCard is not null before using it in includes
    return requiredCard !== null && !player.cards.includes(requiredCard);
  }

  getCardRequiredForAction(actionType: string): CardType | null {
    // Logic to return the required card type for a given action
    switch (actionType) {
      case "Foreign Aid":
        return "Duke";
      case "Assassination":
        return "Assassin";
      // Add other cases as needed
      default:
        return null;
    }
  }
}

export default GameStore;
