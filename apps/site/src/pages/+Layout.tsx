import type { FlowProps } from "solid-js"
import { Toaster } from "solid-sileo"
import { useMetadata } from "vike-metadata-solid"
import { ThemeContextProvider, themeInitScript, useThemeContext } from "@/contexts/theme.context"
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
      offset={{ top: 18, right: 18 }}
      options={{
        fill: inferredTheme() === "dark" ? "#10151f" : "#ffffff",
        roundness: 18,
        autopilot: true,
        styles: {
          title: inferredTheme() === "dark" ? "text-[#f0f5fc]" : "text-gray-900",
          description: inferredTheme() === "dark" ? "text-[#9aa9bf]" : "text-gray-600",
          badge: inferredTheme() === "dark" ? "text-[#d8e2f0]" : "text-gray-700",
          button: inferredTheme() === "dark" ? "text-[#d8e2f0]" : "text-gray-700",
        },
      }}
    >
      {props.children}
    </Toaster>
  )
}
