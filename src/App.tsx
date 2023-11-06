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
const challengeWindowTime = 10000; // 5 seconds for challenge window

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
  const [openChallengeWindow, setOpenChallengeWindow] =
    useState<boolean>(false);
  const [isChallenged, setIsChallenged] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [proposedAction, setProposedAction] = useState<(() => void) | null>(
    null
  );
  const [challengeTimeout, setChallengeTimeout] =
    useState<NodeJS.Timeout | null>(null);

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
    console.log("Shuffled and dealt cards.");
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
      console.log(gameState.currentPlayer + " take Income");
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
      console.log(gameState.currentPlayer + " take foreignAid");
    }
  };
  const handleTax = () => {
    if (gameState.currentPlayer && !incomeTaken) {
      // This is the action that will be committed if not challenged
      if (gameState.currentPlayer) {
        const updatedPlayers = { ...players };
        updatedPlayers[gameState.currentPlayer].coins += 3;
        setPlayers(updatedPlayers);
        console.log(gameState.currentPlayer + " takes Tax");
        setTaxTaken(true);
      }
    }
  };

  const handleTurnEnd = () => {
    if (!isChallenged) {
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
        console.log("next turn");
      }
    } else {
      // Implement what happens when a challenge occurs
      // For example, handle the resolution of the challenge
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
        console.log(
          `${gameState.currentPlayer} is attempting to assassinate ${targetKey}`
        );

        // Remove a card from the target player
        if (updatedPlayers[targetKey].cards.length > 0) {
          updatedPlayers[targetKey].cards.pop();
        }

        setPlayers(updatedPlayers);
      } else {
        alert("Invalid target.");
        return;
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
        console.log(`${gameState.currentPlayer} is couing ${targetKey}`);
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
  // AI action logic
  const aiTakeAction = () => {
    if (gameState.currentPlayer && gameState.currentPlayer !== "user") {
      // Get the AI's current state
      const aiState = players[gameState.currentPlayer];

      // Decide what action to take based on the AI's state
      if (aiState.coins >= 7) {
        // If the AI has enough coins for a coup, perform a coup
        handleCoup();
      } else if (aiState.coins >= 3 && Math.random() < 0.5) {
        // With 3 or more coins, there's a 50% chance to attempt an assassination

        handleAssassinate();
      } else if (aiState.coins < 3 && Math.random() < 0.7) {
        // With fewer than 3 coins, there's a 70% chance to take foreign aid
        handleForeignAid();
      } else {
        // Otherwise, just take income
        handleTakeIncome();
      }
      // offer challenge
      offerChallenge();
    }
  };
  const offerChallenge = () => {
    setOpenChallengeWindow(true);
    const timeoutId = setTimeout(() => {
      if (!isChallenged) {
        // If no challenge is made, proceed with the action
        if (proposedAction) proposedAction();
        handleTurnEnd();
      }
      resetTurnState();
    }, challengeWindowTime);
    setChallengeTimeout(timeoutId);
  };
  const handleAccept = () => {
    setIsChallenged(false);
    console.log("move is accepted");
    setOpenChallengeWindow(false);
    if (challengeTimeout) clearTimeout(challengeTimeout);
    if (proposedAction) proposedAction();
    handleTurnEnd(); // Move to the next turn only after action is accepted
  };

  const handleChallenge = () => {
    setIsChallenged(true);
    console.log("move is Challenged");
    if (challengeTimeout) clearTimeout(challengeTimeout);
    // Resolve challenge here, then possibly call handleTurnEnd after resolution
  };
  const resetTurnState = () => {
    setProposedAction(null);
    setOpenChallengeWindow(false);
    setIsChallenged(false);
    setChallengeTimeout(null);
    // Proceed to next player's turn...
  };
  // Effect hook to trigger AI actions when it's AI's turn
  useEffect(() => {
    if (gameState.currentPlayer && gameState.currentPlayer !== "user") {
      const aiActionDelay = setTimeout(aiTakeAction, 1000); // AI will "think" for 1 second
      return () => clearTimeout(aiActionDelay);
    }
  }, [gameState.currentPlayer]);

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
        <button onClick={handleTakeIncome} /*disabled={incomeTaken}*/>
          Take Income
        </button>
        <button onClick={handleForeignAid} /*disabled={foreignAidTaken}*/>
          Foreign Aid
        </button>
        <button onClick={handleTax} /*disabled={taxTaken}*/>Tax</button>
        <button>Steal</button>
        <button onClick={handleCoup} /*disabled={coup}*/>Coup</button>
        <button>Exchange</button>
        <button onClick={handleAssassinate} /*disabled={assassinate}*/>
          Assassinate
        </button>
      </div>
      <div className="actions-challenge">
        {openChallengeWindow && (
          <button onClick={handleChallenge}>Challenge</button>
        )}
        <button>Block</button>
        <button onClick={handleAccept}>Accept</button>
      </div>

      <div className="actions-end">
        <button onClick={handleTurnEnd}>End Turn</button>
      </div>
    </div>
  );
};

export default App;
