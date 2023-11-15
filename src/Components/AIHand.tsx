import React from "react";
import { CardType } from "../Store/GameStore";
import "./AIHandStyle.css";

interface AIHandProps {
  playerLabel: string;
  cards: CardType[];
  coins: number;
}

const AIHand: React.FC<AIHandProps> = ({ playerLabel, cards, coins }) => {
  return (
    <div className="ai-deck">
      <p>{playerLabel}</p>
      <div className="cards">
        {cards.map((card, index) => (
          <div key={index} className="card">
            Card {index + 1}: {card}
          </div>
        ))}
      </div>
      <div className="coins">Coins: {coins}</div>
    </div>
  );
};

export default AIHand;
