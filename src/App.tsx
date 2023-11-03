import React, { useState, useEffect } from "react";
import "./App.css";

type CardType = "Duke" | "Captain" | "Assassin" | "Contessa" | "Ambassador";

interface PlayerState {
  cards: CardType[];
  coins: number;
}

interface PlayersState {
  player1: PlayerState;
  player2: PlayerState;
  user: PlayerState;
}
interface GameState {
  currentPlayer: keyof PlayersState | null;
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<PlayersState>({
    player1: { cards: [], coins: 2 },
    player2: { cards: [], coins: 2 },
    user: { cards: [], coins: 2 },
  });
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: null,
  });
  const [incomeTaken, setIncomeTaken] = useState<boolean>(false);
  const [foreignAidTaken, setforeignAidTaken] = useState<boolean>(false);
  const [taxTaken, setTaxTaken] = useState<boolean>(false);
  const [assassinate, setAssassinate] = useState<boolean>(false);
  const [coup, setCoup] = useState<boolean>(false);

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

    // Reset the coins for each player and deal 2 cards to each player
    const updatedPlayers: PlayersState = {
      player1: { cards: [deck.pop()!, deck.pop()!], coins: 2 },
      player2: { cards: [deck.pop()!, deck.pop()!], coins: 2 },
      user: { cards: [deck.pop()!, deck.pop()!], coins: 2 },
    };

    // Determine the starting player after dealing the cards
    const startingPlayer: keyof PlayersState = `player${
      Math.floor(Math.random() * 2) + 1
    }` as keyof PlayersState;

    // Set the game state with the starting player
    setGameState({
      currentPlayer: startingPlayer,
    });

    setPlayers(updatedPlayers);
    setIncomeTaken(false);
  };
  const getNextPlayer = (
    currentPlayer: keyof PlayersState
  ): keyof PlayersState => {
    const playerOrder: (keyof PlayersState)[] = ["player1", "player2", "user"];
    const currentIndex = playerOrder.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % playerOrder.length; // This will cycle back to 0 after the last player
    return playerOrder[nextIndex];
  };
  const handleTakeIncome = () => {
    if (gameState.currentPlayer && !incomeTaken) {
      // Create a copy of players state
      const updatedPlayers = { ...players };
      // Update the coin count for the current player
      updatedPlayers[gameState.currentPlayer].coins += 1;

      // Update the players state with the new coin count
      setPlayers(updatedPlayers);

      // Set the incomeTaken to true
      setIncomeTaken(true);
    }
  };
  const handleForeignAid = () => {
    if (gameState.currentPlayer && !incomeTaken) {
      // Create a copy of players state
      const updatedPlayers = { ...players };
      // Update the coin count for the current player
      updatedPlayers[gameState.currentPlayer].coins += 2;

      // Update the players state with the new coin count
      setPlayers(updatedPlayers);

      // Set the incomeTaken to true
      setforeignAidTaken(true);
    }
  };
  const handleTax = () => {
    if (gameState.currentPlayer && !incomeTaken) {
      // Create a copy of players state
      const updatedPlayers = { ...players };
      // Update the coin count for the current player
      updatedPlayers[gameState.currentPlayer].coins += 3;

      // Update the players state with the new coin count
      setPlayers(updatedPlayers);

      // Set the incomeTaken to true
      setTaxTaken(true);
    }
  };
  const handleTurnEnd = () => {
    if (gameState.currentPlayer) {
      setGameState({
        ...gameState,
        currentPlayer: getNextPlayer(gameState.currentPlayer),
      });
      // Reset the incomeTaken as the turn is ending
      setIncomeTaken(false);
      setTaxTaken(false);
      setforeignAidTaken(false);
      setAssassinate(false);
      setCoup(false);
    }
  };
  const handleAssassinate = () => {
    if (
      gameState.currentPlayer &&
      players[gameState.currentPlayer].coins >= 3
    ) {
      // Get the list of potential targets by excluding the current player
      const potentialTargets = Object.keys(players).filter(
        (player) => player !== gameState.currentPlayer
      );

      const targetPlayerKey = prompt(
        `Who do you want to assassinate? (${potentialTargets.join(", ")})`
      );

      // Check if the selected target is a valid player and is not the current player
      if (targetPlayerKey && potentialTargets.includes(targetPlayerKey)) {
        const updatedPlayers = { ...players };

        // Cast targetPlayerKey to keyof PlayersState to satisfy TypeScript
        const targetKey = targetPlayerKey as keyof PlayersState;

        // Deduct 3 coins from the current player
        updatedPlayers[gameState.currentPlayer].coins -= 3;

        // Remove a card from the target player
        if (updatedPlayers[targetKey].cards.length > 0) {
          updatedPlayers[targetKey].cards.pop();
        }

        setPlayers(updatedPlayers);
      } else {
        alert("Invalid target.");
      }
    } else {
      alert("You cannot assassinate because you do not have enough coins.");
    }
    setAssassinate(true);
  };
  const handleCoup = () => {
    if (
      gameState.currentPlayer &&
      players[gameState.currentPlayer].coins >= 3
    ) {
      // Get the list of potential targets by excluding the current player
      const potentialTargets = Object.keys(players).filter(
        (player) => player !== gameState.currentPlayer
      );

      const targetPlayerKey = prompt(
        `Who do you want to coup? (${potentialTargets.join(", ")})`
      );

      // Check if the selected target is a valid player and is not the current player
      if (targetPlayerKey && potentialTargets.includes(targetPlayerKey)) {
        const updatedPlayers = { ...players };

        // Cast targetPlayerKey to keyof PlayersState to satisfy TypeScript
        const targetKey = targetPlayerKey as keyof PlayersState;

        // Deduct 7 coins from the current player
        updatedPlayers[gameState.currentPlayer].coins -= 7;

        // Remove a card from the target player
        if (updatedPlayers[targetKey].cards.length > 0) {
          updatedPlayers[targetKey].cards.pop();
        }

        setPlayers(updatedPlayers);
      } else {
        alert("Invalid target.");
      }
    } else {
      alert("You cannot coup because you don't have enough coins.");
    }
    setCoup(true);
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
        <button onClick={handleTakeIncome} disabled={incomeTaken}>
          Take Income
        </button>
        <button onClick={handleForeignAid} disabled={foreignAidTaken}>
          Foreign Aid
        </button>
        <button onClick={handleTax} disabled={taxTaken}>
          Tax
        </button>
        <button>Steal</button>
        <button onClick={handleCoup} disabled={coup}>
          Coup
        </button>
        <button>Exchange</button>
        <button onClick={handleAssassinate} disabled={assassinate}>
          Assassinate
        </button>
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
