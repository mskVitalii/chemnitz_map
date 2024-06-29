import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  server: {
    port: 3000,
    host: "localhost"
  },
  build: {
    outDir: "build"
  },

  resolve: {
    alias: [
      { find: "@app/", replacement: path.resolve(__dirname, "./src") },
      { find: "@utils/", replacement: path.resolve(__dirname, "./src/utils") },
      { find: "@state/", replacement: path.resolve(__dirname, "./src/state") },
      {
        find: "@components/",
        replacement: path.resolve(__dirname, "./src/components")
      },
      { find: "@pages/", replacement: path.resolve(__dirname, "./src/pages") },
      {
        find: "@assets/",
        replacement: path.resolve(__dirname, "./src/assets")
      },
      {
        find: "@interfaces/",
        replacement: path.resolve(__dirname, "./src/interfaces")
      }
    ]
  }
});
