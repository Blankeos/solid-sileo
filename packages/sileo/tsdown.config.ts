import solid from "rolldown-plugin-solid";
import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["./src/index.ts"],
	format: ["esm", "cjs"],
	dts: true,
	sourcemap: true,
	platform: "neutral",
	plugins: [solid()],
	css: {
		splitting: false,
		fileName: "styles.css",
	},
});
