import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Tailwind-Switch/",
  plugins: [tailwindcss()],
});