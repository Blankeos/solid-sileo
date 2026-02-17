import { fileURLToPath, URL } from "node:url"
import vikeRoutegen from "@blankeos/vike-routegen"
import tailwindcss from "@tailwindcss/vite"
import vike from "vike/plugin"
import vikeSolid from "vike-solid/vite"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tailwindcss(), tsConfigPaths(), vike(), vikeSolid(), vikeRoutegen()],
  resolve: {
    alias: {
      "solid-sileo": fileURLToPath(new URL("../../packages/sileo/src/index.ts", import.meta.url)),
    },
  },
  server: { port: 3000 },
  preview: { port: 3000 },
  envPrefix: ["PUBLIC_"],
})
