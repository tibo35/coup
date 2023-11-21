import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  return (
    <div className="menu-container">
      <h1>COUP</h1>
      <nav>
        <ul>
          <li className="button-73">
            <Link to="/play">Play</Link>
          </li>
          <li className="button-73">
            <Link to="/rules">Rules</Link>
          </li>
          <li className="button-73">
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
