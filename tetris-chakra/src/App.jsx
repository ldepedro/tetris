import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import Dashboard from "./components/Dashboard.jsx";
import Tetris from "./components/Tetris.jsx";

export default function App() {
  const [player, setPlayer] = useState("");
  const [theme, setTheme] = useState("blue.900");
  const [startGame, setStartGame] = useState(false);

  return (
    <Box bg={theme} minH="100vh" color="white" p={4}>
      {!startGame ? (
        <Dashboard
          player={player}
          setPlayer={setPlayer}
          setTheme={setTheme}
          startGame={() => setStartGame(true)}
        />
      ) : (
        <Tetris player={player} theme={theme} />
      )}
    </Box>
  );
}
