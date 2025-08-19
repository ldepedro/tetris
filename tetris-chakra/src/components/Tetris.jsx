import React, { useState, useEffect } from "react";
import { VStack, Text, Button, HStack } from "@chakra-ui/react";

export default function Tetris({ player }) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(1000);

  // Fake Tetris loop (replace with actual grid logic later)
  useEffect(() => {
    const interval = setInterval(() => {
      setScore((s) => s + 10);
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  useEffect(() => {
    if (score > 0 && score % 100 === 0) {
      setLevel((l) => l + 1);
      setSpeed((s) => Math.max(200, s - 100)); // faster blocks
    }
  }, [score]);

  const loseLife = () => {
    setLives((l) => l - 1);
    if (lives <= 1) alert("Game Over!");
  };

  return (
    <VStack spacing={4}>
      <Text fontSize="2xl">👤 Player: {player}</Text>
      <Text>⭐ Score: {score}</Text>
      <Text>⬆️ Level: {level}</Text>
      <Text>❤️ Lives: {lives}</Text>

      <HStack>
        <Button onClick={() => setScore((s) => s + 10)}>+10 Score</Button>
        <Button onClick={loseLife}>Lose Life</Button>
      </HStack>
    </VStack>
  );
}
