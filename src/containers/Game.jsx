import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Food from "./Food";
import Snake from "./Snake";

const OuterContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SnackGameContainer = styled.div`
  border: 2px solid black;
  display: grid;
  grid-template-columns: repeat(21, 1fr);
  grid-template-rows: repeat(21, 1fr);
`;

const Game = ({ snakeSpeed }) => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  let lastRenderedTime = 0;
  let gameIsOver = false;

  const snakeComponentRef = useRef(null);
  const foodComponentRef = useRef(null);

  useEffect(() => {
    window.requestAnimationFrame(startGame);
  }, []);

  const startGame = (currentTime) => {
    if (gameIsOver) {
      if (confirm("You lost! Press Ok to Start Again..")) {
        return (window.location = "/");
      }
      return false;
    }
    window.requestAnimationFrame(startGame);
    const secondSinceLastRendered = (currentTime - lastRenderedTime) / 1000;
    if (secondSinceLastRendered < 1 / snakeSpeed) return;
    lastRenderedTime = currentTime;

    updateGame();
    drawGame();
    setScore(updatedScore());
    gameIsOver = checkIfGameIsOver();
    if (gameIsOver) {
      setGameOver(true);
    }
  };

  const updateGame = () => {
    snakeComponentRef.current.updateSnake();
    foodComponentRef.current.updateFood();
  };

  const drawGame = () => {
    const gameContainerDiv = document.getElementById("gameContainer");
    gameContainerDiv.innerHTML = "";
    snakeComponentRef.current.drawSnake();
    foodComponentRef.current.drawFood();
  };

  const checkIfFoodIsCaptured = (position) => {
    return snakeComponentRef.current.onSnake(position);
  };

  const expandSnake = (amount) => {
    return snakeComponentRef.current.expandSnake(amount);
  };

  const getSnakeHeadPosition = () => {
    return snakeComponentRef.current.getSnakeHeadAxis();
  };

  const checkIfGameIsOver = () => {
    return (
      ifSnakeTouchesBoundaries(getSnakeHeadPosition()) || snakeIsIntersecting()
    );
  };

  const ifSnakeTouchesBoundaries = (position) => {
    return (
      position.x < 1 || position.x > 21 || position.y < 1 || position.y > 21
    );
  };

  const snakeIsIntersecting = () => {
    return snakeComponentRef.current.isSnakeIntersecting();
  };

  const updatedScore = () => {
    return snakeComponentRef.current.getTheScore();
  };

  return (
    <OuterContainer>
      <div>Your Current Score: {score}</div>
      <SnackGameContainer
        id="gameContainer"
        // style={gameOver ? { opacity: "0.25", userSelect: "none" } : {}}
      >
        <Snake ref={snakeComponentRef} />
        <Food
          ref={foodComponentRef}
          onSnake={(position) => checkIfFoodIsCaptured(position)}
          expandSnake={(amount) => expandSnake(amount)}
        />
      </SnackGameContainer>
    </OuterContainer>
  );
};

export default Game;
