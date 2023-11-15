import React from "react";
import { CardType } from "../Store/GameStore";
import "./UserHand.css";

const cardImages = {
  Duke: require("../Assets/cards/duke.png"),
  Captain: require("../Assets/cards/captain.png"),
  Assassin: require("../Assets/cards/assassin.png"),
  Contessa: require("../Assets/cards/contessa.png"),
  Ambassador: require("../Assets/cards/ambassador.png"),
};

interface UserHandProps {
  cards: CardType[];
  coins: number;
}

const UserHand: React.FC<UserHandProps> = ({ cards, coins }) => {
  return (
    <div className="user-deck">
      <p>You</p>
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

export default UserHand;
