import React from "react";
import { VStack, Input, Button, Select, Heading } from "@chakra-ui/react";

export default function Dashboard({ player, setPlayer, setTheme, startGame }) {
  return (
    <VStack spacing={4}>
      <Heading>🎮 Tetris Game</Heading>
      <Input
        placeholder="Enter your name"
        value={player}
        onChange={(e) => setPlayer(e.target.value)}
      />
      <Select onChange={(e) => setTheme(e.target.value)} placeholder="Choose Theme">
        <option value="blue.900">Blue</option>
        <option value="gray.900">Gray</option>
        <option value="purple.900">Purple</option>
        <option value="black">Dark</option>
      </Select>
      <Button
        colorScheme="teal"
        onClick={startGame}
        isDisabled={!player.trim()}
      >
        Start Game
      </Button>
    </VStack>
  );
}
