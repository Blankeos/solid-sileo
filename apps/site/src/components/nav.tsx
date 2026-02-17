import { createSignal, onCleanup, Show } from "solid-js"
import { usePageContext } from "vike-solid/usePageContext"
import { useThemeContext } from "@/contexts/theme.context"

export function Nav() {
  const { toggleTheme, inferredTheme } = useThemeContext()
  const pageContext = usePageContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false)
  const [isMobileMenuMounted, setIsMobileMenuMounted] = createSignal(false)
  let closeMenuTimer: number | undefined

  const MOBILE_MENU_EXIT_MS = 160

  const isActive = (path: string) => pageContext.urlPathname === path

  const clearCloseMenuTimer = () => {
    if (closeMenuTimer !== undefined) {
      window.clearTimeout(closeMenuTimer)
      closeMenuTimer = undefined
    }
  }

  const openMobileMenu = () => {
    clearCloseMenuTimer()
    setIsMobileMenuMounted(true)
    setIsMobileMenuOpen(true)
  }

  const closeMobileMenu = () => {
    if (!isMobileMenuMounted()) {
      return
    }

    setIsMobileMenuOpen(false)
    clearCloseMenuTimer()
    closeMenuTimer = window.setTimeout(() => {
      setIsMobileMenuMounted(false)
      closeMenuTimer = undefined
    }, MOBILE_MENU_EXIT_MS)
  }

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen()) {
      closeMobileMenu()
      return
    }

    openMobileMenu()
  }

  const themeToggleLabel = () => (inferredTheme() === "dark" ? "Light mode" : "Dark mode")

  onCleanup(() => {
    clearCloseMenuTimer()
  })

  return (
    <>
      <nav class="flex animate-fade-slide-up items-center justify-between py-6">
        <a
          class="flex items-center gap-2.5 tracking-tight transition-opacity hover:opacity-70"
          href="/"
        >
          <span class="font-semibold text-sm">Sileo</span>
        </a>

        <button
          type="button"
          aria-label={isMobileMenuOpen() ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen()}
          aria-controls="mobile-nav-menu"
          onClick={toggleMobileMenu}
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95 sm:hidden"
        >
          <Show
            when={isMobileMenuOpen()}
            fallback={
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
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            }
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Show>
        </button>

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
            class="flex h-8 items-center gap-1.5 rounded-full px-3 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground"
            href="https://sileo.aaryan.design/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
            <span class="rounded-full border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground/80 uppercase tracking-[0.08em]">
              React API
            </span>
          </a>
          <a
            class={[
              "flex h-8 items-center rounded-full px-3 font-medium text-xs transition-colors",
              isActive("/play") ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
            href="/play"
          >
            Playground
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-all hover:text-foreground active:scale-95"
          >
            <Show
              when={inferredTheme() === "dark"}
              fallback={
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
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              }
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
            </Show>
          </button>
        </div>
      </nav>

      <Show when={isMobileMenuMounted()}>
        <button
          type="button"
          aria-label="Close menu"
          class={[
            "fixed inset-0 z-50 bg-black/5 backdrop-blur-sm sm:hidden",
            isMobileMenuOpen() ? "animate-overlay-in" : "animate-overlay-out",
          ].join(" ")}
          onClick={closeMobileMenu}
        />

        <div
          id="mobile-nav-menu"
          class={[
            "fixed top-2 right-2 bottom-2 z-50 flex w-64 flex-col justify-between rounded-2xl border border-border bg-background p-2 shadow-xl will-change-transform sm:hidden",
            isMobileMenuOpen() ? "animate-slide-in" : "animate-slide-out",
          ].join(" ")}
        >
          <div class="flex flex-col gap-1">
            <a
              href="https://github.com/Blankeos/solid-sileo"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              class="flex h-8 items-center rounded-xl px-2 font-medium text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://sileo.aaryan.design/docs"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              class="flex h-8 items-center justify-between gap-2 rounded-xl px-2 font-medium text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground"
            >
              <span>Docs</span>
              <span class="rounded-full border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground/80 uppercase tracking-[0.08em]">
                React API
              </span>
            </a>
            <a
              class={[
                "flex h-8 items-center rounded-xl px-2 font-medium text-xs transition-colors hover:bg-accent hover:text-foreground",
                isActive("/play") ? "text-foreground" : "text-muted-foreground",
              ].join(" ")}
              href="/play"
              onClick={closeMobileMenu}
            >
              Playground
            </a>
          </div>

          <button
            type="button"
            onClick={() => {
              toggleTheme()
              closeMobileMenu()
            }}
            class="flex h-8 cursor-pointer items-center gap-2 rounded-xl px-2 font-medium text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-foreground"
          >
            <Show
              when={inferredTheme() === "dark"}
              fallback={
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
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              }
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
            </Show>
            {themeToggleLabel()}
          </button>
        </div>
      </Show>
    </>
  )
}
