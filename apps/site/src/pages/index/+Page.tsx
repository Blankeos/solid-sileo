import { createSignal, For, onCleanup } from "solid-js"
import { sileo } from "solid-sileo"
import { useMetadata } from "vike-metadata-solid"

const INSTALL_COMMAND = "npm install sileo"
const DESCRIPTION =
  "An opinionated toast component for Solid. Gooey SVG morphing, spring physics, and a minimal API - beautiful by default."

export default function Page() {
  useMetadata({
    title: "Sileo - Beautiful Toast Notifications for Solid",
    description:
      "A tiny, beautiful, physics-based toast component for Solid. Gooey SVG morphing, spring animations, and zero dependencies.",
  })

  const [copied, setCopied] = createSignal(false)
  let copyTimer: number | undefined

  onCleanup(() => {
    if (copyTimer !== undefined) {
      window.clearTimeout(copyTimer)
    }
  })

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND)
      setCopied(true)

      if (copyTimer !== undefined) {
        window.clearTimeout(copyTimer)
      }

      copyTimer = window.setTimeout(() => {
        setCopied(false)
      }, 1400)

      sileo.success({
        title: "Copied",
        description: "Installation command copied to clipboard.",
      })
    } catch {
      sileo.error({
        title: "Copy failed",
        description: "Your browser blocked clipboard access.",
      })
    }
  }

  const triggerPromiseToast = () => {
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
        }),
        error: () => ({
          title: "Failed",
          description: "Please try again in a moment.",
        }),
      }
    )
  }

  const openMenuHint = () => {
    sileo.info({
      title: "Menu",
      description: "This demo keeps navigation intentionally minimal.",
    })
  }

  const toggleModeHint = () => {
    sileo.info({
      title: "Dark mode",
      description: "This landing page stays in dark mode for visual parity.",
    })
  }

  const tryItButtons = [
    {
      label: "Success",
      onClick: () =>
        sileo.success({
          title: "Changes saved",
        }),
    },
    {
      label: "Error",
      onClick: () =>
        sileo.error({
          title: "Something went wrong",
          description: "Please try again later.",
        }),
    },
    {
      label: "Warning",
      onClick: () =>
        sileo.warning({
          title: "Storage almost full",
        }),
    },
    {
      label: "Info",
      onClick: () =>
        sileo.info({
          title: "New update available",
        }),
    },
    {
      label: "Action",
      onClick: () =>
        sileo.action({
          title: "File uploaded",
          description: "Share it with your team?",
          button: {
            title: "Share",
            onClick: () => {
              sileo.success({
                title: "Shared!",
                description: "The file link is now ready to send.",
              })
            },
          },
        }),
    },
    {
      label: "Promise",
      onClick: triggerPromiseToast,
    },
    {
      label: "Icon",
      onClick: () =>
        sileo.show({
          title: "Custom icon",
          description: "Bring your own icon for special toast states.",
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
        }),
    },
  ]

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
              class="flex h-8 items-center rounded-full px-3 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
              href="/play"
            >
              Playground
            </a>
            <button
              type="button"
              onClick={toggleModeHint}
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-all hover:text-foreground active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={openMenuHint}
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground sm:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
              aria-hidden="true"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </nav>

        <div class="flex flex-1 flex-col">
          <main class="-mt-10 flex flex-1 flex-col items-center justify-center">
            <h1 class="animate-fade-slide-up font-semibold text-7xl tracking-[-0.08em] sm:text-8xl">
              Sileo<span class="text-neutral-500">.</span>
            </h1>
            <p class="mt-5 max-w-md animate-delay-100 animate-fade-slide-up text-center text-[15px] text-neutral-400 leading-relaxed">
              {DESCRIPTION}
            </p>

            <div class="mt-8 flex animate-delay-200 animate-fade-slide-up flex-col items-center gap-5">
              <button
                type="button"
                onClick={() => void copyCommand()}
                class="group flex h-10 cursor-pointer items-center gap-3 rounded-xl bg-accent pr-3 pl-4 font-medium text-sm transition-all active:scale-[0.98]"
              >
                <span class="select-none font-mono text-muted-foreground">$</span>
                <span class="font-mono text-[13px] text-foreground">{INSTALL_COMMAND}</span>

                <span class="flex size-6 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors group-hover:bg-accent-hover">
                  {copied() ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <title>Copied</title>
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <title>Copy</title>
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  )}
                </span>
              </button>

              <div class="flex items-center gap-5">
                <a
                  class="flex items-center gap-1.5 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
                  href="/play"
                >
                  Playground
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-3"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a
                  class="font-medium text-foreground text-xs transition-colors hover:text-foreground-hover"
                  href="https://sileo.aaryan.design/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
              </div>
            </div>
          </main>

          <div
            id="play"
            class="flex animate-delay-300 animate-fade-in flex-col items-center gap-3 pb-8"
          >
            <p class="font-medium text-[11px] text-neutral-300 uppercase tracking-[0.35em]">
              Try it
            </p>

            <div class="flex flex-wrap items-center justify-center gap-2 px-6">
              <For each={tryItButtons}>
                {(button) => (
                  <button
                    type="button"
                    onClick={button.onClick}
                    class="inline-flex h-9 cursor-pointer items-center justify-center rounded-xl bg-accent px-4 font-medium text-muted-foreground text-xs transition-all hover:bg-accent-hover hover:text-foreground active:scale-95"
                  >
                    {button.label}
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
