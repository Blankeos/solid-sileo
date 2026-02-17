import { type SileoPosition, sileo } from "../../../../packages/sileo/src/index"

export type DemoToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "action"
  | "promise"
  | "custom-icon"

export const HOMEPAGE_TOAST_BUTTONS: Array<{
  label: string
  type: DemoToastType
}> = [
  { label: "Success", type: "success" },
  { label: "Error", type: "error" },
  { label: "Warning", type: "warning" },
  { label: "Info", type: "info" },
  { label: "Action", type: "action" },
  { label: "Promise", type: "promise" },
  { label: "Icon", type: "custom-icon" },
]

export const PLAYGROUND_TOAST_BUTTONS: Array<{
  label: string
  type: DemoToastType
}> = [
  { label: "Success", type: "success" },
  { label: "Error", type: "error" },
  { label: "Warning", type: "warning" },
  { label: "Info", type: "info" },
  { label: "Action", type: "action" },
  { label: "Icon", type: "custom-icon" },
  { label: "Promise", type: "promise" },
]

const ArrowUpIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-3.5"
    aria-hidden="true"
  >
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
)

const FileIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-3.5"
    aria-hidden="true"
  >
    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
  </svg>
)

const RocketIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-3.5"
    aria-hidden="true"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 4.5-2 4.5s3.24-.5 4.5-2c.71-.85.7-2.12-.06-2.88-.76-.76-2.03-.77-2.88-.06z" />
    <path d="m12 15-3-3a24.94 24.94 0 0 1 3.69-6.08 12 12 0 0 1 6.36-3.86 24.94 24.94 0 0 1-3.84 6.33A24.95 24.95 0 0 1 12 15z" />
    <path d="M9 12h.01" />
  </svg>
)

const UnitedLogo = () => (
  <img
    src="https://sileo.aaryan.design/united.png"
    alt="United Airlines"
    width="70"
    height="28"
    class="-ml-1.5 h-7.5 w-auto object-contain invert-0 dark:invert"
  />
)

const ArrowRight = (props: { class?: string }) => (
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
    class={props.class}
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

function FlightBookingDescription() {
  return (
    <div class="-mt-1.5 flex flex-col gap-4">
      <div class="-mb-4 flex items-center justify-between">
        <UnitedLogo />
        <div class="font-medium text-[13px] leading-none tracking-tight opacity-50">
          PNR <span class="text-white dark:text-black">EC2QW4</span>
        </div>
      </div>

      <div class="flex items-center justify-between overflow-visible">
        <span class="mt-4 font-medium text-2xl text-white leading-none tracking-tight dark:text-black">
          DEL
        </span>

        <div class="relative mx-1 flex max-h-[10px] flex-1 items-center overflow-visible">
          <svg
            viewBox="0 0 300 120"
            fill="none"
            preserveAspectRatio="none"
            class="mask-x-from-77% mask-x-to-87% absolute inset-x-0 bottom-0 -mb-5 h-[80px] w-full overflow-visible"
          >
            <title>Flight path</title>
            <path
              d="M 4 118 Q 150 -20 296 118"
              stroke="#22c55e"
              stroke-width="2"
              stroke-dasharray="6 4"
              stroke-opacity="0.5"
              fill="none"
              vector-effect="non-scaling-stroke"
              shape-rendering="geometricPrecision"
            ></path>
          </svg>

          <div class="absolute bottom-[-1rem] left-3 z-10 flex size-5 items-center justify-center rounded-full bg-green-500/30">
            <ArrowRight class="size-4 -rotate-40 text-green-500" />
          </div>

          <div class="absolute right-3 bottom-[-1rem] z-10 flex size-5 items-center justify-center rounded-full bg-green-500/30">
            <ArrowRight class="size-4 rotate-40 text-green-500" />
          </div>
        </div>

        <span class="mt-4 font-medium text-2xl text-white leading-none tracking-tight dark:text-black">
          SFO
        </span>
      </div>
    </div>
  )
}

export function fireDemoToast(type: DemoToastType, position?: SileoPosition) {
  switch (type) {
    case "success":
      sileo.success({
        title: "Changes Saved",
        description:
          "Changes saved successfully to the database. Please refresh the page to see the changes.",
        position,
      })
      break

    case "error":
      sileo.error({
        title: "Something Went Wrong",
        description:
          "We're having trouble saving your changes to the server. Please try again in a few minutes.",
        position,
      })
      break

    case "warning":
      sileo.warning({
        title: "Storage Almost Full",
        description:
          "You've used 95% of your available storage. Please upgrade your plan to continue.",
        position,
      })
      break

    case "info":
      sileo.action({
        title: "New Update Available",
        description:
          "Version 2.0 is now available. Please update your app to continue using the latest features.",
        icon: <ArrowUpIcon />,
        position,
      })
      break

    case "action":
      sileo.action({
        title: "File Uploaded",
        description: "Your file has been uploaded. Share it with your team?",
        icon: <FileIcon />,
        button: {
          title: "Share Now",
          onClick: () => {
            sileo.success({
              title: "Link Copied",
              position,
            })
          },
        },
        position,
      })
      break

    case "promise":
      void sileo.promise(
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, 2500)
        }),
        {
          loading: { title: "Booking Flight" },
          success: {
            title: "Booking Confirmed",
            button: {
              title: "View Details",
              onClick: () => {
                sileo.success({
                  title: "Details Viewed",
                  position,
                })
              },
            },
            description: <FlightBookingDescription />,
            position,
          },
          error: {
            title: "Booking Failed",
            position,
          },
          position,
        }
      )
      break

    case "custom-icon":
      sileo.success({
        title: "Deployment Started",
        description: "Your app is being deployed to production.",
        icon: <RocketIcon />,
        position,
      })
      break
  }
}
