import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/profile/characters/",
  plugins: [solid({ ssr: false })],
});
