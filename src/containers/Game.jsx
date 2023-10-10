import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { ifSnakeTouchesBoundaries } from "../helperFunctions";
import CountdownTimer from "./CountdownTimer";
import Food from "./Food";
import Snake from "./Snake";

const OuterContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

const SnackGameContainer = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  grid-template-columns: repeat(21, 1fr);
  grid-template-rows: repeat(21, 1fr);
  background-color: #ac6;
  box-shadow: inset 0 0 60px rgba(48, 80, 0, 0.3);
  outline: 4px solid rgba(0, 0, 0, 0.75);
`;

const ScoreAndHighScoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  width: 100%;
`;

const DisplayScore = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const GameOverContainer = styled.div`
  font-size: 120px;
  font-weight: 900;
  line-height: 0.95;
  width: 100%;
  height: 100%;
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translateY(-20%);
  pointer-events: none;
  background: transparent;
`;

const Game = ({ snakeSpeed }) => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timerFunction, setTimeFunction] = useState(true);
  let lastRenderedTime = 0;
  let gameIsOver = false;

  const snakeComponentRef = useRef(null);
  const foodComponentRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setTimeFunction(false);
      window.requestAnimationFrame(startGame);
    }, 4300);
  }, []);

  const startGame = (currentTime) => {
    gameIsOver = checkIfGameIsOver();
    if (gameIsOver) {
      setGameOver(true);
      return;
    }
    window.requestAnimationFrame(startGame);
    const secondSinceLastRendered = (currentTime - lastRenderedTime) / 1000;
    if (secondSinceLastRendered < 1 / snakeSpeed) return;
    lastRenderedTime = currentTime;
    updateGame();
    drawGame();
    setScore(updatedScore());
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

  const snakeIsIntersecting = () => {
    return snakeComponentRef.current.isSnakeIntersecting();
  };

  const updatedScore = () => {
    return snakeComponentRef.current.getTheScore();
  };

  return (
    <OuterContainer>
      {timerFunction ? (
        <CountdownTimer />
      ) : (
        <div>
          <SnackGameContainer
            id="gameContainer"
            className={gameOver ? "hideBoard" : ""}
          >
            <Snake ref={snakeComponentRef} />
            <Food
              ref={foodComponentRef}
              onSnake={(position) => checkIfFoodIsCaptured(position)}
              expandSnake={(amount) => expandSnake(amount)}
            />
            {gameOver && <GameOverContainer>Game Over!</GameOverContainer>}
          </SnackGameContainer>
          <ScoreAndHighScoreContainer id={"scoreContainer"}>
            <DisplayScore className="score">{score}</DisplayScore>
            <DisplayScore className="score">H: {score}</DisplayScore>
          </ScoreAndHighScoreContainer>
        </div>
      )}
    </OuterContainer>
  );
};

export default Game;
