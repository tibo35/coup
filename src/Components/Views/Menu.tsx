import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  return (
    <div className="menu-container">
      <h1>COUP</h1>
      <nav>
        <ul>
          <li>
            <Link className="button-73" to="/play">
              Play
            </Link>
          </li>
          <li>
            <Link className="button-73" to="/rules">
              Rules
            </Link>
          </li>
          <li>
            <Link className="button-73" to="/settings">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
