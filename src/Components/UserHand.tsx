import React from "react";
import { CardType } from "../Store/GameStore";
import "./UserHand.css";
interface UserHandProps {
  cards: CardType[];
  coins: number;
}

const UserHand: React.FC<UserHandProps> = ({ cards, coins }) => {
  return (
    <div className="user-deck">
      <p>User</p>
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

export default UserHand;
