import React, { useEffect } from "react";
import {
  Box, VStack, HStack, Text, Button, useColorModeValue, Badge
} from "@chakra-ui/react";
import TetrisBoard from "./TetrisBoard.jsx";
import useTetrisLogic from "../hooks/useTetrisLogic.js";

export default function Tetris({ player, onQuit }) {
  const panelBg = useColorModeValue("white", "whiteAlpha.200");

  const {
    board, next, score, level, lines, lives,
    running, gameOver,
    start, togglePause,
    moveLeft, moveRight, rotate, softDrop, hardDrop
  } = useTetrisLogic();

  // keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (!running || gameOver) return;
      if (e.key === "ArrowLeft") moveLeft();
      else if (e.key === "ArrowRight") moveRight();
      else if (e.key === "ArrowDown") softDrop();
      else if (e.key === "ArrowUp") rotate();
      else if (e.code === "Space") { e.preventDefault(); hardDrop(); }
      else if (e.key.toLowerCase() === "p") togglePause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, gameOver, moveLeft, moveRight, rotate, softDrop, hardDrop, togglePause]);

  useEffect(() => { start(); }, [start]);

  return (
    <VStack w="full" spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontWeight="bold">Player: {player}</Text>
        <HStack>
          <Badge colorScheme="purple">
            {running && !gameOver ? "RUNNING" : gameOver ? "GAME OVER" : "PAUSED"}
          </Badge>
          <Button size="sm" onClick={togglePause}>{running ? "Pause" : "Resume"}</Button>
          <Button size="sm" colorScheme="red" onClick={onQuit}>Quit</Button>
          <Button size="sm" onClick={start}>Restart</Button>
        </HStack>
      </HStack>

      <HStack align="start" spacing={6}>
        <TetrisBoard board={board} next={next} />

        <Box p={4} rounded="md" bg={panelBg} minW="180px">
          <VStack align="stretch" spacing={2}>
            <Text>⭐ Score: {score}</Text>
            <Text>⬆️ Level: {level}</Text>
            <Text>📏 Lines: {lines}</Text>
            <Text>❤️ Lives: {lives}</Text>
            <Box mt={3}>
              <Text fontSize="sm" opacity={0.7}>Controls</Text>
              <Text className="small">← → move • ↑ rotate • ↓ soft drop • Space hard drop • P pause</Text>
            </Box>
          </VStack>
        </Box>
      </HStack>
    </VStack>
  );
}
