import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false
  },
  styles: {
    global: {
      "html, body, #root": { height: "100%" }
    }
  }
});

export default theme;
