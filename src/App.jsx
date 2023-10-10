import React from "react";
import Game from "./containers/Game";
import "./App.css";

const SNAKE_SPEED = 5;

const App = () => {
  return <Game snakeSpeed={SNAKE_SPEED} />;
};

export default App;
