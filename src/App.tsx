import React, { useState } from "react";
import "./App.css";

// Define the shape of the card type
type CardType = "Duke" | "Captain" | "Assassin" | "Contessa" | "Ambassador";

// Define the shape of each player's state
interface PlayerState {
  cards: CardType[];
}

// Define the shape of the overall state for all players
interface PlayersState {
  player1: PlayerState;
  player2: PlayerState;
  user: PlayerState;
}

const App: React.FC = () => {
  // Define the initial state with types
  const [players, setPlayers] = useState<PlayersState>({
    player1: { cards: [] },
    player2: { cards: [] },
    user: { cards: [] },
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

    setPlayers(updatedPlayers);
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
          </div>
        ))}
      </div>
      <div className="actions">
        <button onClick={shuffleAndDealCards}>Start/Shuffle</button>
        <button>Take Income</button>
        <button>Steal</button>
        <button>Exchange</button>
        <button>Tax</button>
        <button>Assassinate</button>
        <button>Challenge</button>
      </div>
    </div>
  );
};

export default App;
