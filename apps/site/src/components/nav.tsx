import { Show } from "solid-js"
import { usePageContext } from "vike-solid/usePageContext"
import { useThemeContext } from "@/contexts/theme.context"

export function Nav() {
  const { toggleTheme, inferredTheme } = useThemeContext()
  const pageContext = usePageContext()

  const isActive = (path: string) => pageContext.urlPathname === path

  return (
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
  )
}
