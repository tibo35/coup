import React, { useState } from "react";
import "./App.css";

// Define the shape of the card type
type CardType = "Duke" | "Captain" | "Assassin" | "Contessa" | "Ambassador";

// Define the shape of each player's state
interface PlayerState {
  cards: CardType[];
  coins: number;
}

// Define the shape of the overall state for all players
interface PlayersState {
  player1: PlayerState;
  player2: PlayerState;
  user: PlayerState;
}
// Define the shape of the overall game state
interface GameState {
  currentPlayer: keyof PlayersState | null;
}

const App: React.FC = () => {
  // Define the initial state with types
  const [players, setPlayers] = useState<PlayersState>({
    player1: { cards: [], coins: 2 },
    player2: { cards: [], coins: 2 },
    user: { cards: [], coins: 2 },
  });
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: null,
  });
  const shuffleAndDealCards = (): void => {
    const cardTypes: CardType[] = [
      "Duke",
      "Captain",
      "Assassin",
      "Contessa",
      "Ambassador",
    ];
    let deck: CardType[] = [];

    // Each type of card has 3 copies
    cardTypes.forEach((type) => {
      for (let i = 0; i < 3; i++) {
        deck.push(type);
      }
    });

    // Shuffle the deck
    deck = deck.sort(() => Math.random() - 0.5);

    // Deal 2 cards to each player
    const updatedPlayers: PlayersState = JSON.parse(JSON.stringify(players));
    Object.keys(updatedPlayers).forEach((player) => {
      updatedPlayers[player as keyof PlayersState].cards = [
        deck.pop()!,
        deck.pop()!,
      ];
    });

    // Determine the starting player after dealing the cards
    const startingPlayer: keyof PlayersState = `player${
      Math.floor(Math.random() * 2) + 1
    }` as keyof PlayersState;

    // Set the game state with the starting player
    setGameState({
      ...gameState,
      currentPlayer: startingPlayer,
    });

    setPlayers(updatedPlayers);
  };

  const getNextPlayer = (
    currentPlayer: keyof PlayersState
  ): keyof PlayersState => {
    const playerOrder: (keyof PlayersState)[] = ["player1", "player2", "user"];
    const currentIndex = playerOrder.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % playerOrder.length; // This will cycle back to 0 after the last player
    return playerOrder[nextIndex];
  };

  const handleTurnEnd = () => {
    if (gameState.currentPlayer) {
      setGameState({
        ...gameState,
        currentPlayer: getNextPlayer(gameState.currentPlayer),
      });
    }
  };

  return (
    <div className="App">
      <header>
        <p>Coup</p>
      </header>
      <div className="board">
        {Object.entries(players).map(([player, data], index) => (
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
              {gameState.currentPlayer === "user"
                ? "User"
                : gameState.currentPlayer}
            </div>
          </div>
        ))}
      </div>
      <div className="actions-start">
        <button onClick={shuffleAndDealCards}>Start/Shuffle</button>
      </div>

      <div className="actions-turn">
        <button>Take Income</button>
        <button>Steal</button>
        <button>Exchange</button>
        <button>Tax</button>
        <button>Assassinate</button>
      </div>
      <div className="actions-challenge">
        <button>Challenge</button>
        <button>Accept</button>
      </div>

      <div className="actions-end">
        <button onClick={handleTurnEnd}>End Turn</button>
      </div>
    </div>
  );
};

export default App;
