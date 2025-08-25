import React from "react";
import { Box, Grid, GridItem, VStack, Text, useColorModeValue } from "@chakra-ui/react";

const CELL = 26; // px

export default function TetrisBoard({ board, next }) {
  const border = useColorModeValue("gray.300", "whiteAlpha.400");
  const emptyBg = useColorModeValue("gray.200", "gray.700");

  const accentMap = {
    cyan: "cyan.400",
    pink: "pink.400",
    orange: "orange.400",
    green: "green.400",
    purple: "purple.400",
  };

  return (
    <VStack align="center" spacing={3}>
      {/* Main board */}
      <Grid
        templateColumns={`repeat(${board[0].length}, ${CELL}px)`}
        templateRows={`repeat(${board.length}, ${CELL}px)`}
        gap="2px"
        p="8px"
        border={`2px solid ${border}`}
        rounded="md"
        bg={useColorModeValue("white", "blackAlpha.500")}
      >
        {board.flatMap((row, r) =>
          row.map((cell, c) => (
            <GridItem
              key={`${r}-${c}`}
              w={`${CELL}px`}
              h={`${CELL}px`}
              rounded="2px"
              bg={cell ? accentMap[cell.color] || "teal.400" : emptyBg}
              boxShadow={cell ? "inset 0 0 6px rgba(0,0,0,0.4)" : "none"}
            />
          ))
        )}
      </Grid>

      {/* Next piece preview */}
      <Box>
        <Text fontSize="sm" mb={1} opacity={0.8}>Next</Text>
        <Grid
          templateColumns={`repeat(4, 18px)`}
          templateRows={`repeat(4, 18px)`}
          gap="2px"
          p="6px"
          border={`1px solid ${border}`}
          rounded="md"
          bg={useColorModeValue("white", "blackAlpha.400")}
        >
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => {
              const filled = next?.shape?.[r]?.[c] === 1;
              const color = next?.color;
              return (
                <Box
                  key={`${r}-${c}`}
                  w="18px"
                  h="18px"
                  rounded="2px"
                  bg={filled ? accentMap[color] || "teal.400" : useColorModeValue("gray.200","gray.700")}
                />
              );
            })
          )}
        </Grid>
      </Box>
    </VStack>
  );
}
