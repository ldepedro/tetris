import React, { useState } from "react";
import { Box, Container, Heading, VStack, useColorModeValue } from "@chakra-ui/react";
import Dashboard from "./components/Dashboard.jsx";
import Tetris from "./components/Tetris.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

export default function App() {
  const [player, setPlayer] = useState("");
  const [themeAccent, setThemeAccent] = useState("cyan"); // for board accents
  const [started, setStarted] = useState(false);

  const bg = useColorModeValue("gray.100", "gray.800");

  return (
    <Box minH="100vh" bg={bg} py={6}>
      <Container maxW="container.md">
        <VStack spacing={6}>
          <Heading>Chakra Tetris</Heading>
          <ThemeToggle />

          {!started ? (
            <Dashboard
              player={player}
              setPlayer={setPlayer}
              themeAccent={themeAccent}
              setThemeAccent={setThemeAccent}
              onStart={() => setStarted(true)}
            />
          ) : (
            <Tetris player={player} accent={themeAccent} onQuit={() => setStarted(false)} />
          )}
        </VStack>
      </Container>
    </Box>
  );
}
