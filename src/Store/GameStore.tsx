import { makeAutoObservable } from "mobx";
import { action, observable } from "mobx";
import { type } from "os";

export type Player = {
  cards: string[];
  coins: number;
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
  players: PlayersState = {
    player1: { cards: [], coins: 2 },
    player2: { cards: [], coins: 2 },
    user: { cards: [], coins: 2 },
  };

  gameState: GameState = {
    currentPlayer: "user",
  };

  challengeWindowOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  openChallengeWindow() {
    this.challengeWindowOpen = true;
  }

  @action
  closeChallengeWindow() {
    this.challengeWindowOpen = false;
  }

  @action
  acceptChallenge() {
    // Implement the logic to accept the challenge
    this.closeChallengeWindow();
    // Proceed with the action as no one challenged
    this.setNextPlayer(); // Now we explicitly call setNextPlayer only after accepting the challenge
  }

  @action
  setNextPlayer() {
    this.gameState.currentPlayer = this.getNextPlayer();
  }

  @action
  blockAction() {
    // Implement the logic to block the action
    this.closeChallengeWindow();
    // Depending on your rules, you may not move to the next player if the action is blocked
  }

  @action
  challengeAction() {
    // Implement the logic for a challenge
    this.closeChallengeWindow();
    // Handle the challenge resolution before moving on to the next player
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
      player1: { cards: [deck.pop()!, deck.pop()!], coins: 2 },
      player2: { cards: [deck.pop()!, deck.pop()!], coins: 2 },
      user: { cards: [deck.pop()!, deck.pop()!], coins: 2 },
    };

    // Update the players in the store
    this.players = updatedPlayers;

    // Determine and set the starting player
    const startingPlayer: keyof PlayersState = `player${
      Math.floor(Math.random() * 2) + 1
    }` as keyof PlayersState;
    this.gameState.currentPlayer = startingPlayer;

    console.log("Shuffled and dealt cards.");
  }

  @action
  getTakeIncome(playerKey: keyof PlayersState) {
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 1; // Increment the coins by 1 for income
      this.openChallengeWindow();
      console.log("take income");
    }
  }

  @action
  getForeignAid(playerKey: keyof PlayersState) {
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 2; // Increment the coins by 2 for foreign aid
      console.log("take foreign aid");
      this.gameState.currentPlayer = this.getNextPlayer(); // Set the next player
    }
  }

  @action
  getTax(playerKey: keyof PlayersState) {
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 3; // Increment the coins by 3 for tax
      this.openChallengeWindow();
      console.log("take tax");
    }
  }

  @action
  getAssassinate(
    assassinPlayerKey: keyof PlayersState,
    targetPlayerKey: keyof PlayersState
  ) {
    const assassinPlayer = this.players[assassinPlayerKey];
    const targetPlayer = this.players[targetPlayerKey];

    if (assassinPlayer.coins >= 3) {
      assassinPlayer.coins -= 3; // Deduct the cost of assassination
      if (targetPlayer.cards.length > 0) {
        targetPlayer.cards.pop(); // Assume we simply remove the last card
      }
      console.log(
        `${assassinPlayerKey} has assassinated a card from ${targetPlayerKey}`
      );
      // Any additional logic (such as changing turns) can go here
      // You might also need to handle what happens if the assassination is challenged
    } else {
      alert("You cannot assassinate because you do not have enough coins.");
    }
    this.openChallengeWindow();
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

    // Check if the current player has enough coins to coup
    if (currentPlayer.coins < 7) {
      alert("You cannot coup because you don't have enough coins.");
      return;
    }

    // Deduct coins and remove a card from the target player
    currentPlayer.coins -= 7;
    if (targetPlayer.cards.length > 0) {
      targetPlayer.cards.pop(); // This is a simplification
    }

    console.log(
      `${currentPlayerKey} has successfully couped ${targetPlayerKey}`
    );

    this.gameState.currentPlayer = this.getNextPlayer();
  }

  @action
  getNextPlayer(): keyof PlayersState {
    const playerOrder: (keyof PlayersState)[] = ["player1", "player2", "user"];
    const currentIndex = playerOrder.indexOf(this.gameState.currentPlayer!);
    const nextIndex = (currentIndex + 1) % playerOrder.length; // Cycle back to 0 after the last player
    console.log("Next player:", playerOrder[nextIndex]);
    return playerOrder[nextIndex];
  }
}

export default GameStore;
