import React from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div>
      <h1>Menu</h1>
      <nav>
        <ul>
          <li>
            <Link to="/play">Play</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/rules">Rules</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
