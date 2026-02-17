import { animate, spring } from "motion";
import {
	createEffect,
	createMemo,
	createRenderEffect,
	createSignal,
	type JSX,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import {
	ArrowRight,
	Check,
	CircleAlert,
	LifeBuoy,
	LoaderCircle,
	X,
} from "./icons";
import type { SileoButton, SileoState, SileoStyles } from "./types";
import "./styles.css";

/* --------------------------------- Config --------------------------------- */

const HEIGHT = 40;
const WIDTH = 350;
const DEFAULT_ROUNDNESS = 18;
const DURATION_MS = 600;
const DURATION_S = DURATION_MS / 1000;
const BLUR_RATIO = 0.5;
const PILL_PADDING = 10;
const MIN_EXPAND_RATIO = 2.25;
const SWAP_COLLAPSE_MS = 200;
const HEADER_EXIT_MS = DURATION_MS * 0.7;
const SWIPE_DISMISS = 30;
const SWIPE_MAX = 20;

type State = SileoState;

interface View {
	title?: string;
	description?: JSX.Element;
	state: State;
	icon?: JSX.Element | null;
	styles?: SileoStyles;
	button?: SileoButton;
	fill: string;
}

interface SileoProps {
	id: string;
	fill?: string;
	state?: State;
	title?: string;
	description?: JSX.Element;
	position?: "left" | "center" | "right";
	expand?: "top" | "bottom";
	className?: string;
	icon?: JSX.Element | null;
	styles?: SileoStyles;
	button?: SileoButton;
	roundness?: number;
	exiting?: boolean;
	autoExpandDelayMs?: number;
	autoCollapseDelayMs?: number;
	canExpand?: boolean;
	interruptKey?: string;
	refreshKey?: string;
	onMouseEnter?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
	onMouseLeave?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
	onDismiss?: () => void;
}

/* ---------------------------------- Icons --------------------------------- */

const STATE_ICON: Record<State, JSX.Element> = {
	success: <Check />,
	loading: <LoaderCircle data-sileo-icon="spin" aria-hidden="true" />,
	error: <X />,
	warning: <CircleAlert />,
	info: <LifeBuoy />,
	action: <ArrowRight />,
};

function GooeyDefs(props: { filterId: string; blur: number }) {
	return (
		<defs>
			<filter
				id={props.filterId}
				x="-20%"
				y="-20%"
				width="140%"
				height="140%"
				color-interpolation-filters="sRGB"
			>
				<feGaussianBlur
					in="SourceGraphic"
					stdDeviation={props.blur}
					result="blur"
				/>
				<feColorMatrix
					in="blur"
					type="matrix"
					values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
					result="goo"
				/>
				<feComposite in="SourceGraphic" in2="goo" operator="atop" />
			</filter>
		</defs>
	);
}

/* -------------------------------- Component -------------------------------- */

export function Sileo(props: SileoProps) {
	const next = createMemo<View>(() => {
		const resolvedState = props.state ?? "success";
		return {
			title: props.title ?? resolvedState,
			description: props.description,
			state: resolvedState,
			icon: props.icon,
			styles: props.styles,
			button: props.button,
			fill: props.fill ?? "#FFFFFF",
		};
	});

	const [view, setView] = createSignal<View>(next());
	const [applied, setApplied] = createSignal<string | undefined>(
		props.refreshKey,
	);
	const [isExpanded, setIsExpanded] = createSignal(false);
	const [ready, setReady] = createSignal(false);
	const [pillWidth, setPillWidth] = createSignal(0);
	const [contentHeight, setContentHeight] = createSignal(0);

	const hasDesc = createMemo(
		() => Boolean(view().description) || Boolean(view().button),
	);
	const isLoading = createMemo(() => view().state === "loading");
	const open = createMemo(() => hasDesc() && isExpanded() && !isLoading());
	const allowExpand = createMemo(() => {
		if (isLoading()) return false;
		return (
			props.canExpand ??
			(!props.interruptKey ||
				(props.interruptKey && props.interruptKey === props.id))
		);
	});

	const headerKey = createMemo(() => `${view().state}-${view().title ?? ""}`);
	const filterId = createMemo(() => `sileo-gooey-${props.id}`);
	const resolvedRoundness = createMemo(() =>
		Math.max(0, props.roundness ?? DEFAULT_ROUNDNESS),
	);
	const blur = createMemo(() => resolvedRoundness() * BLUR_RATIO);

	const [headerRef, setHeaderRef] = createSignal<HTMLDivElement>();
	const [contentRef, setContentRef] = createSignal<HTMLDivElement>();
	const [innerRef, setInnerRef] = createSignal<HTMLDivElement>();
	const [buttonRef, setButtonRef] = createSignal<HTMLButtonElement>();
	const [pillRef, setPillRef] = createSignal<SVGRectElement>();
	const [bodyRef, setBodyRef] = createSignal<SVGRectElement>();

	let headerExitTimer: number | undefined;
	let autoExpandTimer: number | undefined;
	let autoCollapseTimer: number | undefined;
	let swapTimer: number | undefined;
	let pillAnimation: ReturnType<typeof animate> | undefined;
	let bodyAnimation: ReturnType<typeof animate> | undefined;
	let headerPad: number | null = null;
	let lastRefreshKey = props.refreshKey;
	let pending: { key?: string; payload: View } | null = null;
	let pointerStart: number | null = null;
	let frozenExpanded = HEIGHT * MIN_EXPAND_RATIO;

	const [headerLayer, setHeaderLayer] = createSignal<{
		current: { key: string; view: View };
		prev: { key: string; view: View } | null;
	}>({ current: { key: headerKey(), view: view() }, prev: null });

	createRenderEffect(() => {
		const el = innerRef();
		const header = headerRef();
		if (!el || !header) return;

		if (headerPad === null) {
			const styles = getComputedStyle(header);
			headerPad =
				Number.parseFloat(styles.paddingLeft) +
				Number.parseFloat(styles.paddingRight);
		}

		const horizontalPad = headerPad;
		const measure = () => {
			const width = el.scrollWidth + horizontalPad + PILL_PADDING;
			if (width > PILL_PADDING) {
				setPillWidth((prev) => (prev === width ? prev : width));
			}
		};

		measure();
		let rafId = 0;
		const observer = new ResizeObserver(() => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(measure);
		});

		observer.observe(el);
		onCleanup(() => {
			cancelAnimationFrame(rafId);
			observer.disconnect();
		});
	});

	createRenderEffect(() => {
		const descriptionVisible = hasDesc();
		if (!descriptionVisible) {
			setContentHeight(0);
			return;
		}

		const el = contentRef();
		if (!el) return;

		const measure = () => {
			const height = el.scrollHeight;
			setContentHeight((prev) => (prev === height ? prev : height));
		};

		measure();
		let rafId = 0;
		const observer = new ResizeObserver(() => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(measure);
		});

		observer.observe(el);
		onCleanup(() => {
			cancelAnimationFrame(rafId);
			observer.disconnect();
		});
	});

	onMount(() => {
		const raf = requestAnimationFrame(() => setReady(true));
		onCleanup(() => cancelAnimationFrame(raf));
	});

	createRenderEffect(() => {
		const key = headerKey();
		const currentView = view();
		setHeaderLayer((layer) => {
			if (layer.current.key === key) {
				if (layer.current.view === currentView) return layer;
				return { ...layer, current: { key, view: currentView } };
			}

			return {
				prev: layer.current,
				current: { key, view: currentView },
			};
		});
	});

	createEffect(() => {
		if (!headerLayer().prev) return;

		if (headerExitTimer !== undefined) {
			clearTimeout(headerExitTimer);
		}

		headerExitTimer = window.setTimeout(() => {
			headerExitTimer = undefined;
			setHeaderLayer((layer) => ({ ...layer, prev: null }));
		}, HEADER_EXIT_MS);

		onCleanup(() => {
			if (headerExitTimer !== undefined) {
				clearTimeout(headerExitTimer);
				headerExitTimer = undefined;
			}
		});
	});

	createEffect(() => {
		const refreshKey = props.refreshKey;
		const nextView = next();
		const shouldSwap = open();
		const incomingHasDesc =
			Boolean(nextView.description) || Boolean(nextView.button);

		if (refreshKey === undefined) {
			setView(nextView);
			setApplied(undefined);
			pending = null;
			lastRefreshKey = refreshKey;
			return;
		}

		if (lastRefreshKey === refreshKey) return;
		lastRefreshKey = refreshKey;

		if (swapTimer !== undefined) {
			clearTimeout(swapTimer);
			swapTimer = undefined;
		}

		if (shouldSwap && incomingHasDesc) {
			pending = { key: refreshKey, payload: nextView };
			setIsExpanded(false);
			swapTimer = window.setTimeout(() => {
				swapTimer = undefined;
				const pendingView = pending;
				if (!pendingView) return;
				setView(pendingView.payload);
				setApplied(pendingView.key);
				pending = null;
			}, SWAP_COLLAPSE_MS);
		} else {
			pending = null;
			setView(nextView);
			setApplied(refreshKey);
			if (!incomingHasDesc) setIsExpanded(false);
		}
	});

	createEffect(() => {
		const descriptionVisible = hasDesc();
		const expandDelay = props.autoExpandDelayMs;
		const collapseDelay = props.autoCollapseDelayMs;
		const canAutoExpand = allowExpand();
		const exiting = props.exiting ?? false;
		applied();

		if (autoExpandTimer !== undefined) {
			clearTimeout(autoExpandTimer);
			autoExpandTimer = undefined;
		}
		if (autoCollapseTimer !== undefined) {
			clearTimeout(autoCollapseTimer);
			autoCollapseTimer = undefined;
		}

		if (!descriptionVisible) {
			setIsExpanded(false);
			return;
		}

		if (exiting || !canAutoExpand) {
			setIsExpanded(false);
			return;
		}

		if (expandDelay == null && collapseDelay == null) return;

		const resolvedExpandDelay = expandDelay ?? 0;
		const resolvedCollapseDelay = collapseDelay ?? 0;

		if (resolvedExpandDelay > 0) {
			autoExpandTimer = window.setTimeout(
				() => setIsExpanded(true),
				resolvedExpandDelay,
			);
		} else {
			setIsExpanded(true);
		}

		if (resolvedCollapseDelay > 0) {
			autoCollapseTimer = window.setTimeout(
				() => setIsExpanded(false),
				resolvedCollapseDelay,
			);
		}

		onCleanup(() => {
			if (autoExpandTimer !== undefined) clearTimeout(autoExpandTimer);
			if (autoCollapseTimer !== undefined) clearTimeout(autoCollapseTimer);
		});
	});

	const minExpanded = HEIGHT * MIN_EXPAND_RATIO;
	const rawExpanded = createMemo(() =>
		hasDesc() ? Math.max(minExpanded, HEIGHT + contentHeight()) : minExpanded,
	);

	createEffect(() => {
		const expandedValue = rawExpanded();
		if (open()) {
			frozenExpanded = expandedValue;
		}
	});

	const expanded = createMemo(() => (open() ? rawExpanded() : frozenExpanded));
	const svgHeight = createMemo(() =>
		hasDesc() ? Math.max(expanded(), minExpanded) : HEIGHT,
	);
	const expandedContent = createMemo(() => Math.max(0, expanded() - HEIGHT));
	const resolvedPillWidth = createMemo(() =>
		Math.max(pillWidth() || HEIGHT, HEIGHT),
	);
	const pillHeight = createMemo(() => HEIGHT + blur() * 3);
	const pillX = createMemo(() => {
		const position = props.position ?? "left";
		if (position === "right") return WIDTH - resolvedPillWidth();
		if (position === "center") return (WIDTH - resolvedPillWidth()) / 2;
		return 0;
	});

	createRenderEffect(() => {
		const pill = pillRef();
		const body = bodyRef();
		if (!pill || !body) return;

		const isExpanded = open();
		const immediate = !ready();
		const pillTransition = immediate
			? { duration: 0 }
			: {
					type: spring,
					bounce: 0.25,
					duration: DURATION_S,
				};
		const bodyTransition = immediate
			? { duration: 0 }
			: {
					type: spring,
					bounce: isExpanded ? 0.25 : 0,
					duration: DURATION_S,
				};

		pillAnimation?.stop();
		bodyAnimation?.stop();

		pillAnimation = animate(
			pill,
			{
				x: pillX(),
				width: resolvedPillWidth(),
				height: isExpanded ? pillHeight() : HEIGHT,
			},
			pillTransition,
		);

		bodyAnimation = animate(
			body,
			{
				height: isExpanded ? expandedContent() : 0,
				opacity: isExpanded ? 1 : 0,
			},
			bodyTransition,
		);
	});

	const canvasStyle = createMemo<JSX.CSSProperties>(() => ({
		filter: `url(#${filterId()})`,
	}));

	const rootStyle = createMemo(() => {
		const expand = props.expand ?? "bottom";
		return {
			"--_h": `${open() ? expanded() : HEIGHT}px`,
			"--_pw": `${resolvedPillWidth()}px`,
			"--_px": `${pillX()}px`,
			"--_ht": `translateY(${open() ? (expand === "bottom" ? 3 : -3) : 0}px) scale(${open() ? 0.9 : 1})`,
			"--_co": `${open() ? 1 : 0}`,
		} as JSX.CSSProperties;
	});

	const handleEnter: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
		event,
	) => {
		props.onMouseEnter?.(event);
		if (hasDesc()) setIsExpanded(true);
	};

	const handleLeave: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
		event,
	) => {
		props.onMouseLeave?.(event);
		setIsExpanded(false);
	};

	const handleTransitionEnd: JSX.EventHandlerUnion<
		HTMLButtonElement,
		TransitionEvent
	> = (event) => {
		if (event.propertyName !== "height" && event.propertyName !== "transform") {
			return;
		}

		if (open()) return;
		const pendingView = pending;
		if (!pendingView) return;

		if (swapTimer !== undefined) {
			clearTimeout(swapTimer);
			swapTimer = undefined;
		}

		setView(pendingView.payload);
		setApplied(pendingView.key);
		pending = null;
	};

	const handlePointerDown: JSX.EventHandlerUnion<
		HTMLButtonElement,
		PointerEvent
	> = (event) => {
		if ((props.exiting ?? false) || !props.onDismiss) return;
		const target = event.target as HTMLElement | null;
		if (target?.closest("[data-sileo-button]")) return;
		pointerStart = event.clientY;
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	onMount(() => {
		const el = buttonRef();
		if (!el) return;

		const onMove = (event: PointerEvent) => {
			if (pointerStart === null) return;
			const deltaY = event.clientY - pointerStart;
			const sign = deltaY > 0 ? 1 : -1;
			const clamped = Math.min(Math.abs(deltaY), SWIPE_MAX) * sign;
			el.style.transform = `translateY(${clamped}px)`;
		};

		const onUp = (event: PointerEvent) => {
			if (pointerStart === null) return;
			const deltaY = event.clientY - pointerStart;
			pointerStart = null;
			el.style.transform = "";
			if (Math.abs(deltaY) > SWIPE_DISMISS) {
				props.onDismiss?.();
			}
		};

		el.addEventListener("pointermove", onMove, { passive: true });
		el.addEventListener("pointerup", onUp, { passive: true });

		onCleanup(() => {
			el.removeEventListener("pointermove", onMove);
			el.removeEventListener("pointerup", onUp);
		});
	});

	onCleanup(() => {
		if (headerExitTimer !== undefined) clearTimeout(headerExitTimer);
		if (autoExpandTimer !== undefined) clearTimeout(autoExpandTimer);
		if (autoCollapseTimer !== undefined) clearTimeout(autoCollapseTimer);
		if (swapTimer !== undefined) clearTimeout(swapTimer);
		pillAnimation?.stop();
		bodyAnimation?.stop();
	});

	return (
		<button
			ref={setButtonRef}
			type="button"
			data-sileo-toast
			data-ready={ready()}
			data-expanded={open()}
			data-exiting={props.exiting ?? false}
			data-edge={props.expand ?? "bottom"}
			data-position={props.position ?? "left"}
			data-state={view().state}
			class={props.className}
			style={rootStyle()}
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
			onTransitionEnd={handleTransitionEnd}
			onPointerDown={handlePointerDown}
		>
			<div
				data-sileo-canvas
				data-edge={props.expand ?? "bottom"}
				style={canvasStyle()}
			>
				<svg
					data-sileo-svg
					width={WIDTH}
					height={svgHeight()}
					viewBox={`0 0 ${WIDTH} ${svgHeight()}`}
				>
					<title>Sileo Notification</title>
					<GooeyDefs filterId={filterId()} blur={blur()} />
					<rect
						ref={setPillRef}
						data-sileo-pill
						x={0}
						width={HEIGHT}
						height={HEIGHT}
						rx={resolvedRoundness()}
						ry={resolvedRoundness()}
						fill={view().fill}
					/>
					<rect
						ref={setBodyRef}
						data-sileo-body
						y={HEIGHT}
						width={WIDTH}
						height={0}
						opacity={0}
						rx={resolvedRoundness()}
						ry={resolvedRoundness()}
						fill={view().fill}
					/>
				</svg>
			</div>

			<div
				ref={setHeaderRef}
				data-sileo-header
				data-edge={props.expand ?? "bottom"}
			>
				<div data-sileo-header-stack>
					<Show keyed when={headerLayer().current.key}>
						{(_key) => (
							<div
								ref={setInnerRef}
								data-sileo-header-inner
								data-layer="current"
							>
								<div
									data-sileo-badge
									data-state={headerLayer().current.view.state}
									class={headerLayer().current.view.styles?.badge}
								>
									{headerLayer().current.view.icon ??
										STATE_ICON[headerLayer().current.view.state]}
								</div>
								<span
									data-sileo-title
									data-state={headerLayer().current.view.state}
									class={headerLayer().current.view.styles?.title}
								>
									{headerLayer().current.view.title}
								</span>
							</div>
						)}
					</Show>

					<Show keyed when={headerLayer().prev}>
						{(prev) => (
							<div
								data-sileo-header-inner
								data-layer="prev"
								data-exiting="true"
							>
								<div
									data-sileo-badge
									data-state={prev.view.state}
									class={prev.view.styles?.badge}
								>
									{prev.view.icon ?? STATE_ICON[prev.view.state]}
								</div>
								<span
									data-sileo-title
									data-state={prev.view.state}
									class={prev.view.styles?.title}
								>
									{prev.view.title}
								</span>
							</div>
						)}
					</Show>
				</div>
			</div>

			<Show when={hasDesc()}>
				<div
					data-sileo-content
					data-edge={props.expand ?? "bottom"}
					data-visible={open()}
				>
					<div
						ref={setContentRef}
						data-sileo-description
						class={view().styles?.description}
					>
						{view().description}
						<Show keyed when={view().button}>
							{(button) => (
								// biome-ignore lint/a11y/useValidAnchor: toast action cannot be a nested button
								<a
									href="#"
									data-sileo-button
									data-state={view().state}
									class={view().styles?.button}
									onClick={(event) => {
										event.preventDefault();
										event.stopPropagation();
										button.onClick();
									}}
								>
									{button.title}
								</a>
							)}
						</Show>
					</div>
				</div>
			</Show>
		</button>
	);
}
