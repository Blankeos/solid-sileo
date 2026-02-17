import { createSignal, For } from "solid-js"
import { sileo } from "solid-sileo"
import { useMetadata } from "vike-metadata-solid"

const POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const

type Position = (typeof POSITIONS)[number]

const TOAST_TYPES = [
  { label: "Success", state: "success" as const },
  { label: "Error", state: "error" as const },
  { label: "Warning", state: "warning" as const },
  { label: "Info", state: "info" as const },
  { label: "Action", state: "action" as const },
  { label: "Icon", state: "icon" as const },
  { label: "Promise", state: "promise" as const },
]

export default function Page() {
  useMetadata({
    title: "Playground | Sileo",
    description: "Interactive playground for testing Sileo toast notifications.",
  })

  const [selectedPosition, setSelectedPosition] = createSignal<Position>("top-center")

  const triggerToast = (type: string) => {
    const position = selectedPosition()

    switch (type) {
      case "success":
        sileo.success({
          title: "Changes saved",
          position,
        })
        break
      case "error":
        sileo.error({
          title: "Something went wrong",
          description: "Please try again later.",
          position,
        })
        break
      case "warning":
        sileo.warning({
          title: "Storage almost full",
          position,
        })
        break
      case "info":
        sileo.info({
          title: "New update available",
          position,
        })
        break
      case "action":
        sileo.action({
          title: "File uploaded",
          description: "Share it with your team?",
          position,
          button: {
            title: "Share",
            onClick: () => {
              sileo.success({
                title: "Shared!",
                description: "The file link is now ready to send.",
              })
            },
          },
        })
        break
      case "icon":
        sileo.show({
          title: "Custom icon",
          description: "Bring your own icon for special toast states.",
          position,
          icon: (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <title>Diamond icon</title>
              <path d="m6 3 6 7-6 11-4-8 4-10Z" />
              <path d="m18 3-6 7 6 11 4-8-4-10Z" />
              <path d="M8 13h8" />
            </svg>
          ),
        })
        break
      case "promise":
        void sileo.promise(
          () =>
            new Promise<string>((resolve, reject) => {
              window.setTimeout(() => {
                if (Math.random() > 0.2) {
                  resolve("Deployment complete.")
                } else {
                  reject(new Error("Transient failure"))
                }
              }, 1200)
            }),
          {
            loading: { title: "Loading..." },
            success: (message) => ({
              title: "Done!",
              description: message,
              position,
            }),
            error: () => ({
              title: "Failed",
              description: "Please try again in a moment.",
              position,
            }),
          }
        )
        break
    }
  }

  return (
    <div class="min-h-dvh w-full bg-background text-foreground">
      <div class="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-6">
        <nav class="flex animate-fade-slide-up items-center justify-between py-6">
          <a
            class="flex items-center gap-2.5 tracking-tight transition-opacity hover:opacity-70"
            href="/"
          >
            <span class="font-semibold text-sm">Sileo</span>
          </a>

          <div class="hidden items-center gap-1 sm:flex">
            <a
              href="https://github.com/Blankeos/solid-sileo"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-8 items-center rounded-full px-3 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              class="flex h-8 items-center rounded-full px-3 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
              href="https://sileo.aaryan.design/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
            <a
              class="flex h-8 items-center rounded-full px-3 font-medium text-foreground text-xs transition-colors"
              href="/play"
            >
              Playground
            </a>
          </div>
        </nav>

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
              <For each={TOAST_TYPES}>
                {(type) => (
                  <button
                    type="button"
                    onClick={() => triggerToast(type.state)}
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
      </div>
    </div>
  )
}
