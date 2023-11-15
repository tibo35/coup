import React from "react";
import { CardType } from "../Store/GameStore";
import "./AIHandStyle.css";

interface AIHandProps {
  playerLabel: string;
  cards: CardType[];
  coins: number;
}
const cardImages = {
  Duke: require("../Assets/cards/duke.png"),
  Captain: require("../Assets/cards/captain.png"),
  Assassin: require("../Assets/cards/assassin.png"),
  Contessa: require("../Assets/cards/contessa.png"),
  Ambassador: require("../Assets/cards/ambassador.png"),
};
const AIHand: React.FC<AIHandProps> = ({ playerLabel, cards, coins }) => {
  return (
    <div className="ai-deck">
      <p>{playerLabel}</p>
      <div className="cards">
        {cards.map((card, index) => (
          <div key={index} className="card">
            <img src={cardImages[card]} alt={card} />
          </div>
        ))}
      </div>
      <div className="coins">Coins: {coins}</div>
    </div>
  );
};

export default AIHand;

/* SHOWING ONLY BACK:

import React from "react";
import { CardType } from "../Store/GameStore";
import "./AIHandStyle.css";

interface AIHandProps {
  playerLabel: string;
  cards: CardType[];
  coins: number;
}
const aiCardImage = require("../Assets/cards/backCard.png");

const AIHand: React.FC<AIHandProps> = ({ playerLabel, cards, coins }) => {
  return (
    <div className="ai-deck">
      <p>{playerLabel}</p>
      <div className="cards">
        {cards.map((card, index) => (
          <div key={index} className="card">
            
            <img src={aiCardImage} alt="AI Card" />
          </div>
        ))}
      </div>
      <div className="coins">Coins: {coins}</div>
    </div>
  );
};

export default AIHand;
*/
