import { createSignal, For } from "solid-js"
import { useMetadata } from "vike-metadata-solid"
import { fireDemoToast, PLAYGROUND_TOAST_BUTTONS } from "@/lib/toast-presets"

const POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const

type Position = (typeof POSITIONS)[number]

export default function Page() {
  useMetadata({
    title: "Playground | Sileo",
    description: "Interactive playground for testing Sileo toast notifications.",
  })

  const [selectedPosition, setSelectedPosition] = createSignal<Position>("top-center")

  return (
    <>
      <div class="flex flex-1 flex-col">
        <main class="-mt-10 flex flex-1 flex-col items-center justify-center">
          <h1 class="animate-fade-slide-up font-semibold text-4xl tracking-[-0.08em] sm:text-5xl">
            Playground<span class="text-neutral-500">.</span>
          </h1>
          <p class="mt-4 max-w-sm animate-delay-100 animate-fade-slide-up text-center text-[15px] text-neutral-400 leading-relaxed">
            Pick a position, click any type to fire it live.
          </p>
        </main>

        <div class="flex animate-delay-200 animate-fade-in flex-col items-center gap-3 pb-8">
          <div class="flex flex-wrap items-center justify-center gap-1.5">
            <For each={POSITIONS}>
              {(position) => (
                <button
                  type="button"
                  onClick={() => setSelectedPosition(position)}
                  class={[
                    "inline-flex h-9 cursor-pointer items-center justify-center rounded-xl px-4 font-medium text-xs transition-all active:scale-95",
                    selectedPosition() === position
                      ? "bg-foreground text-background hover:bg-foreground hover:text-background"
                      : "bg-accent text-muted-foreground hover:bg-accent-hover hover:text-foreground",
                  ].join(" ")}
                >
                  {position}
                </button>
              )}
            </For>
          </div>

          <div class="my-4 w-[80%] border-border border-t border-dashed" />

          <div class="flex flex-wrap items-center justify-center gap-2 px-6">
            <For each={PLAYGROUND_TOAST_BUTTONS}>
              {(type) => (
                <button
                  type="button"
                  onClick={() => fireDemoToast(type.type, selectedPosition())}
                  class="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-accent px-4 font-medium text-muted-foreground text-xs transition-all hover:bg-accent-hover hover:text-foreground active:scale-95"
                >
                  {type.label}
                </button>
              )}
            </For>
          </div>
        </div>
      </div>

      <footer class="flex items-center justify-between border-border border-t py-6 transition-colors duration-150">
        <span class="text-muted-foreground text-xs">Sileo - MIT License</span>
        <a
          class="text-muted-foreground text-xs transition-colors hover:text-foreground"
          href="/play"
        >
          Playground -&gt;
        </a>
      </footer>
    </>
  )
}
