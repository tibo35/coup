import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Menu from "./Components/Views/Menu";
import BoardGame from "./Components/Views/Board";
import Settings from "./Components/Views/Settings";
import Rules from "./Components/Views/Rules";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/play" element={<BoardGame />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </Router>
  );
};

export default App;
