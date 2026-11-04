import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [solid()],
	resolve: { conditions: ["development", "browser"] },
	test: {
		environment: "happy-dom",
		include: ["src/**/*.test.{ts,tsx}"],
		server: { deps: { inline: [/solid-js/, /@solidjs/] } },
	},
});
