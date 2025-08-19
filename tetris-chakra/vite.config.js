import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for React + Chakra UI in Codespaces
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // expose to Codespaces
    port: 5173,
    strictPort: true
  }
});
