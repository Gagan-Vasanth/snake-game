import React, { useState, useEffect } from "react";
import { styled } from "styled-components";

const TimerContainer = styled.div`
  font-size: 3rem;
  animation: scale 1s infinite;
  grid-column: 11;
  grid-row: 11;

  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const CountdownTimer = () => {
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer >= 1) {
        setTimer(timer - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return <TimerContainer>{timer > 0 ? timer : "Go!"}</TimerContainer>;
};

export default CountdownTimer;
