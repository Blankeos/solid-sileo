import "@/styles/global.css"
import type { FlowProps } from "solid-js"
import { Toaster } from "solid-sileo"
import { useMetadata } from "vike-metadata-solid"

useMetadata.setGlobalDefaults({
  title: "Sileo - Beautiful Toast Notifications for Solid",
  description:
    "A tiny, beautiful, physics-based toast component for Solid. Gooey SVG morphing, spring animations, and zero dependencies.",
})

export default function RootLayout(props: FlowProps) {
  return (
    <Toaster
      position="top-right"
      offset={{ top: 18, right: 18 }}
      options={{
        fill: "#10151f",
        roundness: 18,
        autopilot: true,
        styles: {
          title: "text-[#f0f5fc]",
          description: "text-[#9aa9bf]",
          badge: "text-[#d8e2f0]",
          button: "text-[#d8e2f0]",
        },
      }}
    >
      {props.children}
    </Toaster>
  )
}
