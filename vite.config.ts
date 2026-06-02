import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://karboard.chbkn.run",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
