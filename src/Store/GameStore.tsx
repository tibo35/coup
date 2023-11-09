import { makeAutoObservable } from "mobx";
import { action, observable } from "mobx";

export type Player = {
  cards: string[];
  coins: number;
};

export interface PlayersState {
  player1: Player;
  player2: Player;
  user: Player;
}

export type GameState = {
  currentPlayer: keyof PlayersState | null;
};

export class GameStore {
  players: PlayersState = {
    player1: { cards: [], coins: 2 },
    player2: { cards: [], coins: 2 },
    user: { cards: [], coins: 2 },
  };

  gameState: GameState = {
    currentPlayer: "user",
  };

  // Additional properties
  // ...

  constructor() {
    makeAutoObservable(this);
  }

  shuffleAndDealCards = () => {
    const cardTypes = ["Duke", "Captain", "Assassin", "Contessa", "Ambassador"];
    let deck: string[] = [];

    // Populate the deck with the card types
    cardTypes.forEach((type) => {
      for (let i = 0; i < 3; i++) {
        deck.push(type);
      }
    });

    // Shuffle the deck
    deck = deck.sort(() => Math.random() - 0.5);

    // Deal two cards to each player
    const updatedPlayers: PlayersState = {
      player1: { cards: [deck.pop()!, deck.pop()!], coins: 2 }, // The '!' is a non-null assertion operator, assuming that deck will have enough cards.
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
  };
  getTakeIncome = (playerKey: keyof PlayersState) => {
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 1; // Increment the coins by 1 for income
      this.gameState.currentPlayer = this.getNextPlayer(); // Set the next player
      console.log("take income");
    }
  };
  getForeignAid = (playerKey: keyof PlayersState) => {
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 2; // Increment the coins by 2 for foreign aid
      this.gameState.currentPlayer = this.getNextPlayer(); // Set the next player
      console.log("take foreign aid");
    }
  };
  getTax = (playerKey: keyof PlayersState) => {
    if (this.gameState.currentPlayer === playerKey) {
      const player = this.players[playerKey];
      player.coins += 3; // Increment the coins by 3 for tax
      this.gameState.currentPlayer = this.getNextPlayer(); // Set the next player
      console.log("take tax");
    }
  };
  getAssassinate = (
    assassinPlayerKey: keyof PlayersState,
    targetPlayerKey: keyof PlayersState
  ) => {
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
  };

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

    // Move to the next player or handle additional logic here
    this.gameState.currentPlayer = this.getNextPlayer();
  }

  getNextPlayer = (): keyof PlayersState => {
    const playerOrder: (keyof PlayersState)[] = ["player1", "player2", "user"];
    const currentIndex = playerOrder.indexOf(this.gameState.currentPlayer!);
    const nextIndex = (currentIndex + 1) % playerOrder.length; // Cycle back to 0 after the last player
    console.log("get next player");
    return playerOrder[nextIndex];
  };

  aiTakeAction() {
    const currentPlayerKey = this.gameState.currentPlayer;
    if (!currentPlayerKey || currentPlayerKey === "user") {
      console.log("It is not AI's turn.");
      return;
    }

    const currentPlayer = this.players[currentPlayerKey];

    // AI decision-making logic
    if (currentPlayer.coins >= 7) {
      // If the AI has enough coins for a coup, perform a coup
      this.makeCoup(currentPlayerKey);
    } else if (currentPlayer.coins >= 3 && Math.random() < 0.5) {
      // With 3 or more coins, there's a 50% chance to attempt an assassination
      // For simplicity, we'll target a random player (not "user" and not self)
      const potentialTargets = Object.keys(this.players).filter(
        (key) => key !== "user" && key !== currentPlayerKey
      ) as Array<keyof PlayersState>; // Type assertion here
      const target =
        potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
      if (target) {
        this.getAssassinate(currentPlayerKey, target);
      }
    } else if (currentPlayer.coins < 3 && Math.random() < 0.7) {
      // With fewer than 3 coins, there's a 70% chance to take foreign aid
      this.getForeignAid(currentPlayerKey);
    } else {
      // Otherwise, just take income
      this.getTakeIncome(currentPlayerKey);
    }

    // After AI takes action, you may decide to end the turn, offer challenges, etc.
  }
}

export default GameStore;
