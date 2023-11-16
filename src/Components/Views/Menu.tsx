import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  return (
    <div className="menu-container">
      <h1>COUP</h1>
      <nav>
        <ul>
          <li className="custom-btn btn-3">
            <Link to="/play" className="full-width-link">
              Play
            </Link>
          </li>
          <li className="custom-btn btn-3">
            <Link to="/rules" className="full-width-link">
              Rules
            </Link>
          </li>
          <li className="custom-btn btn-3">
            <Link to="/settings" className="full-width-link">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
