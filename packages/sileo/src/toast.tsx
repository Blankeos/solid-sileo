import {
	createEffect,
	createMemo,
	createSignal,
	For,
	type JSX,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { Sileo } from "./sileo";
import {
	SILEO_POSITIONS,
	type SileoOptions,
	type SileoPosition,
	type SileoState,
} from "./types";

/* -------------------------------- Constants ------------------------------- */

const DEFAULT_DURATION = 6000;
const EXIT_DURATION = DEFAULT_DURATION * 0.1;
const AUTO_EXPAND_DELAY = DEFAULT_DURATION / 30;
const AUTO_COLLAPSE_DELAY = DEFAULT_DURATION - 2000;

const pillAlign = (pos: SileoPosition) =>
	pos.includes("right") ? "right" : pos.includes("center") ? "center" : "left";
const expandDir = (pos: SileoPosition) =>
	pos.startsWith("top") ? ("bottom" as const) : ("top" as const);

/* ---------------------------------- Types --------------------------------- */

interface InternalSileoOptions extends SileoOptions {
	id?: string;
	state?: SileoState;
}

interface SileoItem extends InternalSileoOptions {
	id: string;
	instanceId: string;
	exiting?: boolean;
	autoExpandDelayMs?: number;
	autoCollapseDelayMs?: number;
}

type SileoOffsetValue = number | string;
type SileoOffsetConfig = Partial<
	Record<"top" | "right" | "bottom" | "left", SileoOffsetValue>
>;

export interface SileoToasterProps {
	children?: JSX.Element;
	position?: SileoPosition;
	offset?: SileoOffsetValue | SileoOffsetConfig;
	options?: Partial<SileoOptions>;
}

/* ------------------------------ Global State ------------------------------ */

type SileoListener = (toasts: SileoItem[]) => void;

const store = {
	toasts: [] as SileoItem[],
	listeners: new Set<SileoListener>(),
	position: "top-right" as SileoPosition,
	options: undefined as Partial<SileoOptions> | undefined,

	emit() {
		for (const listener of this.listeners) listener(this.toasts);
	},

	update(fn: (prev: SileoItem[]) => SileoItem[]) {
		this.toasts = fn(this.toasts);
		this.emit();
	},
};

let idCounter = 0;
const generateId = () =>
	`${++idCounter}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const timeoutKey = (toast: SileoItem) => `${toast.id}:${toast.instanceId}`;

/* ------------------------------- Toast API -------------------------------- */

const dismissToast = (id: string) => {
	const item = store.toasts.find((toast) => toast.id === id);
	if (!item || item.exiting) return;

	store.update((prev) =>
		prev.map((toast) =>
			toast.id === id ? { ...toast, exiting: true } : toast,
		),
	);

	setTimeout(
		() => store.update((prev) => prev.filter((toast) => toast.id !== id)),
		EXIT_DURATION,
	);
};

const resolveAutopilot = (
	opts: InternalSileoOptions,
	duration: number | null,
): { expandDelayMs?: number; collapseDelayMs?: number } => {
	if (opts.autopilot === false || !duration || duration <= 0) return {};
	const config =
		typeof opts.autopilot === "object" ? opts.autopilot : undefined;
	const clamp = (value: number) => Math.min(duration, Math.max(0, value));

	return {
		expandDelayMs: clamp(config?.expand ?? AUTO_EXPAND_DELAY),
		collapseDelayMs: clamp(config?.collapse ?? AUTO_COLLAPSE_DELAY),
	};
};

const mergeOptions = (options: InternalSileoOptions) => ({
	...store.options,
	...options,
	styles: { ...store.options?.styles, ...options.styles },
});

const buildSileoItem = (
	merged: InternalSileoOptions,
	id: string,
	fallbackPosition?: SileoPosition,
): SileoItem => {
	const duration = merged.duration ?? DEFAULT_DURATION;
	const autopilot = resolveAutopilot(merged, duration);

	return {
		...merged,
		id,
		instanceId: generateId(),
		position: merged.position ?? fallbackPosition ?? store.position,
		autoExpandDelayMs: autopilot.expandDelayMs,
		autoCollapseDelayMs: autopilot.collapseDelayMs,
	};
};

const createToast = (options: InternalSileoOptions) => {
	const liveToasts = store.toasts.filter((toast) => !toast.exiting);
	const merged = mergeOptions(options);

	const id = merged.id ?? "sileo-default";
	const prev = liveToasts.find((toast) => toast.id === id);
	const item = buildSileoItem(merged, id, prev?.position);

	if (prev) {
		store.update((toasts) =>
			toasts.map((toast) => (toast.id === id ? item : toast)),
		);
	} else {
		store.update((toasts) => [
			...toasts.filter((toast) => toast.id !== id),
			item,
		]);
	}

	return { id, duration: merged.duration ?? DEFAULT_DURATION };
};

const updateToast = (id: string, options: InternalSileoOptions) => {
	const existing = store.toasts.find((toast) => toast.id === id);
	if (!existing) return;

	const item = buildSileoItem(mergeOptions(options), id, existing.position);
	store.update((toasts) =>
		toasts.map((toast) => (toast.id === id ? item : toast)),
	);
};

export interface SileoPromiseOptions<T = unknown> {
	loading: Pick<SileoOptions, "title" | "icon">;
	success: SileoOptions | ((data: T) => SileoOptions);
	error: SileoOptions | ((err: unknown) => SileoOptions);
	action?: SileoOptions | ((data: T) => SileoOptions);
	position?: SileoPosition;
}

export const sileo = {
	show: (opts: SileoOptions) => createToast(opts).id,
	success: (opts: SileoOptions) =>
		createToast({ ...opts, state: "success" }).id,
	error: (opts: SileoOptions) => createToast({ ...opts, state: "error" }).id,
	warning: (opts: SileoOptions) =>
		createToast({ ...opts, state: "warning" }).id,
	info: (opts: SileoOptions) => createToast({ ...opts, state: "info" }).id,
	action: (opts: SileoOptions) => createToast({ ...opts, state: "action" }).id,

	promise: <T,>(
		promise: Promise<T> | (() => Promise<T>),
		opts: SileoPromiseOptions<T>,
	): Promise<T> => {
		const { id } = createToast({
			...opts.loading,
			state: "loading",
			duration: null,
			position: opts.position,
		});

		const promiseResult = typeof promise === "function" ? promise() : promise;

		promiseResult
			.then((data) => {
				if (opts.action) {
					const actionOptions =
						typeof opts.action === "function" ? opts.action(data) : opts.action;
					updateToast(id, { ...actionOptions, state: "action", id });
				} else {
					const successOptions =
						typeof opts.success === "function"
							? opts.success(data)
							: opts.success;
					updateToast(id, { ...successOptions, state: "success", id });
				}
			})
			.catch((err) => {
				const errorOptions =
					typeof opts.error === "function" ? opts.error(err) : opts.error;
				updateToast(id, { ...errorOptions, state: "error", id });
			});

		return promiseResult;
	},

	dismiss: dismissToast,

	clear: (position?: SileoPosition) =>
		store.update((toasts) =>
			position ? toasts.filter((toast) => toast.position !== position) : [],
		),
};

/* ------------------------------ Toaster Component ------------------------- */

type ButtonMouseHandler = JSX.EventHandler<HTMLButtonElement, MouseEvent>;

export function Toaster(props: SileoToasterProps) {
	const [toasts, setToasts] = createSignal<SileoItem[]>(store.toasts);
	const [activeId, setActiveId] = createSignal<string>();

	let hovering = false;
	let latestToastId: string | undefined;
	let latestToasts = toasts();

	const timers = new Map<string, number>();
	const handlersCache = new Map<
		string,
		{
			enter: ButtonMouseHandler;
			leave: ButtonMouseHandler;
			dismiss: () => void;
		}
	>();

	createEffect(() => {
		store.position = props.position ?? "top-right";
		store.options = props.options;
	});

	const clearAllTimers = () => {
		for (const timer of timers.values()) clearTimeout(timer);
		timers.clear();
	};

	const schedule = (items: SileoItem[]) => {
		if (hovering) return;

		for (const item of items) {
			if (item.exiting) continue;
			const key = timeoutKey(item);
			if (timers.has(key)) continue;

			const duration = item.duration ?? DEFAULT_DURATION;
			if (duration === null || duration <= 0) continue;

			timers.set(
				key,
				window.setTimeout(() => dismissToast(item.id), duration),
			);
		}
	};

	onMount(() => {
		const listener: SileoListener = (next) => setToasts(next);
		store.listeners.add(listener);

		onCleanup(() => {
			store.listeners.delete(listener);
			clearAllTimers();
		});
	});

	createEffect(() => {
		const nextToasts = toasts();
		latestToasts = nextToasts;

		const toastKeys = new Set(nextToasts.map(timeoutKey));
		const toastIds = new Set(nextToasts.map((toast) => toast.id));

		for (const [key, timer] of timers) {
			if (!toastKeys.has(key)) {
				clearTimeout(timer);
				timers.delete(key);
			}
		}

		for (const id of handlersCache.keys()) {
			if (!toastIds.has(id)) handlersCache.delete(id);
		}

		schedule(nextToasts);
	});

	const latest = createMemo(() => {
		const list = toasts();
		for (let index = list.length - 1; index >= 0; index -= 1) {
			if (!list[index]?.exiting) return list[index]?.id;
		}
		return undefined;
	});

	createEffect(() => {
		const id = latest();
		latestToastId = id;
		setActiveId(id);
	});

	const getHandlers = (toastId: string) => {
		let cached = handlersCache.get(toastId);
		if (cached) return cached;

		cached = {
			enter: () => {
				setActiveId((prev) => (prev === toastId ? prev : toastId));
				if (hovering) return;
				hovering = true;
				clearAllTimers();
			},
			leave: () => {
				setActiveId((prev) => (prev === latestToastId ? prev : latestToastId));
				if (!hovering) return;
				hovering = false;
				schedule(latestToasts);
			},
			dismiss: () => dismissToast(toastId),
		};

		handlersCache.set(toastId, cached);
		return cached;
	};

	const getViewportStyle = (
		pos: SileoPosition,
	): JSX.CSSProperties | undefined => {
		const offset = props.offset;
		if (offset === undefined) return undefined;

		const offsets =
			typeof offset === "object"
				? offset
				: { top: offset, right: offset, bottom: offset, left: offset };

		const style: JSX.CSSProperties = {};
		const withPx = (value: SileoOffsetValue) =>
			typeof value === "number" ? `${value}px` : value;

		if (pos.startsWith("top") && offsets.top !== undefined)
			style.top = withPx(offsets.top);
		if (pos.startsWith("bottom") && offsets.bottom !== undefined) {
			style.bottom = withPx(offsets.bottom);
		}
		if (pos.endsWith("left") && offsets.left !== undefined)
			style.left = withPx(offsets.left);
		if (pos.endsWith("right") && offsets.right !== undefined) {
			style.right = withPx(offsets.right);
		}

		return style;
	};

	const byPosition = createMemo(() => {
		const map = {} as Partial<Record<SileoPosition, SileoItem[]>>;
		for (const toast of toasts()) {
			const pos = toast.position ?? props.position ?? "top-right";
			const bucket = map[pos];
			if (bucket) {
				bucket.push(toast);
			} else {
				map[pos] = [toast];
			}
		}
		return map;
	});

	return (
		<>
			{props.children}
			<For each={SILEO_POSITIONS}>
				{(pos) => {
					const items = createMemo(() => byPosition()[pos] ?? []);
					const itemIds = createMemo(() => items().map((toast) => toast.id));
					const itemsById = createMemo(() => {
						const map = new Map<string, SileoItem>();
						for (const toast of items()) {
							map.set(toast.id, toast);
						}
						return map;
					});
					const pill = pillAlign(pos);
					const expand = expandDir(pos);

					return (
						<Show when={itemIds().length > 0}>
							<section
								data-sileo-viewport
								data-position={pos}
								aria-live="polite"
								style={getViewportStyle(pos)}
							>
								<For each={itemIds()}>
									{(toastId) => {
										const item = createMemo(() => itemsById().get(toastId));
										const handlers = getHandlers(toastId);

										return (
											<Show when={item()}>
												{(current) => (
													<Sileo
														id={current().id}
														state={current().state}
														title={current().title}
														description={current().description}
														position={pill}
														expand={expand}
														icon={current().icon}
														fill={current().fill}
														styles={current().styles}
														button={current().button}
														roundness={current().roundness}
														exiting={current().exiting}
														autoExpandDelayMs={current().autoExpandDelayMs}
														autoCollapseDelayMs={current().autoCollapseDelayMs}
														refreshKey={current().instanceId}
														canExpand={
															activeId() === undefined ||
															activeId() === current().id
														}
														onMouseEnter={handlers.enter}
														onMouseLeave={handlers.leave}
														onDismiss={handlers.dismiss}
													/>
												)}
											</Show>
										);
									}}
								</For>
							</section>
						</Show>
					);
				}}
			</For>
		</>
	);
}
