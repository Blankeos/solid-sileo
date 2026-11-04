import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { sileo, Toaster } from "./toast";

afterEach(() => {
	cleanup();
	sileo.clear();
});

describe("Toaster store sync", () => {
	it("drops toasts cleared between render and subscription", () => {
		sileo.success({ title: "stale", duration: null });

		// Runs after Toaster's body (snapshot taken) but before its onMount
		// subscribes, i.e. the route-change gap upstream v0.1.6 fixed.
		function ClearInGap() {
			sileo.clear();
			return null;
		}

		const { container } = render(() => (
			<>
				<Toaster />
				<ClearInGap />
			</>
		));

		expect(container.querySelector("[data-sileo-toast]")).toBeNull();
		expect(document.body.textContent).not.toContain("stale");
	});
});

describe("Gooey filter", () => {
	it("applies the filter to an svg group over an explicit user-space region", () => {
		render(() => <Toaster />);
		sileo.success({ title: "hello", duration: null });

		const canvas = document.querySelector<HTMLElement>("[data-sileo-canvas]");
		expect(canvas).not.toBeNull();
		expect(canvas?.style.filter).toBe("");

		const filter = document.querySelector("filter");
		expect(filter?.getAttribute("filterUnits")).toBe("userSpaceOnUse");

		const group = document.querySelector("[data-sileo-svg] > g[filter]");
		expect(group?.getAttribute("filter")).toBe(`url(#${filter?.id})`);
		expect(group?.querySelector("[data-sileo-pill]")).not.toBeNull();
		expect(group?.querySelector("[data-sileo-body]")).not.toBeNull();

		expect(document.querySelector("svg title")?.textContent).toBe(
			"sileo notification",
		);
	});
});
