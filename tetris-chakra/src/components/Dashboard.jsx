import React from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

export default function Dashboard({ player, setPlayer, onStart }) {
  const cardBg = useColorModeValue("white", "whiteAlpha.200");

  return (
    <Box w="full" p={6} rounded="lg" shadow="md" bg={cardBg}>
      <VStack align="stretch" spacing={4}>
        <Text>Enter your player name to start.</Text>

        <HStack spacing={4} align="flex-end" flexWrap="wrap">
          <Box flex="1 1 260px">
            <Text mb={1} fontWeight="semibold">Player name</Text>
            <Input
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              placeholder="e.g. Alex"
            />
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
