import React from "react";
import {
  Box, VStack, HStack, Input, Select, Button, Text, useColorModeValue
} from "@chakra-ui/react";

export default function Dashboard({ player, setPlayer, themeAccent, setThemeAccent, onStart }) {
  const cardBg = useColorModeValue("white", "whiteAlpha.200");

  return (
    <Box w="full" p={6} rounded="lg" shadow="md" bg={cardBg}>
      <VStack align="stretch" spacing={4}>
        <Text>Enter your player name and choose a theme.</Text>

        <HStack spacing={4} align="flex-end" flexWrap="wrap">
          <Box flex="1 1 260px">
            <Text mb={1} fontWeight="semibold">Player name</Text>
            <Input
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="e.g. Alex"
            />
          </Box>

          <Box minW="220px">
            <Text mb={1} fontWeight="semibold">Board accent</Text>
            <Select value={themeAccent} onChange={(e) => setThemeAccent(e.target.value)}>
              <option value="cyan">Cyan</option>
              <option value="pink">Pink</option>
              <option value="orange">Orange</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
            </Select>
          </Box>

          <Button
            colorScheme="teal"
            onClick={onStart}
            isDisabled={!player.trim()}
          >
            Start Game
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
