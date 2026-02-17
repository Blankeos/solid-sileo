import type { FlowProps } from "solid-js"
import { useMetadata } from "vike-metadata-solid"
import { Nav } from "@/components/nav"
import { ThemeContextProvider, themeInitScript, useThemeContext } from "@/contexts/theme.context"
import { Toaster } from "../../../../packages/sileo/src/index"
import "@/styles/global.css"

useMetadata.setGlobalDefaults({
  title: "Sileo - Beautiful Toast Notifications for Solid",
  description:
    "A tiny, beautiful, physics-based toast component for Solid. Gooey SVG morphing, spring animations, and zero dependencies.",
  icons: {
    icon: "/favicon.ico",
  },
  otherJSX: () => {
    return <script innerHTML={themeInitScript} />
  },
})

export default function RootLayout(props: FlowProps) {
  return (
    <ThemeContextProvider>
      <LayoutWithToaster>{props.children}</LayoutWithToaster>
    </ThemeContextProvider>
  )
}

function LayoutWithToaster(props: FlowProps) {
  const { inferredTheme } = useThemeContext()

  return (
    <Toaster
      position="top-center"
      offset={8}
      options={{
        fill: inferredTheme() === "dark" ? "#ffffff" : "#171717",
        styles: {
          description: inferredTheme() === "dark" ? "text-black/60!" : "text-white/75!",
        },
      }}
    >
      <div class="min-h-dvh w-full bg-background text-foreground">
        <div class="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-6">
          <Nav />
          {props.children}
        </div>
      </div>
    </Toaster>
  )
}
