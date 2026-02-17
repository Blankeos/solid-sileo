const TITLE_TEMPLATE = "%s | Sileo Playground"

export default function getTitle(title: string = "Home") {
  return TITLE_TEMPLATE.replace("%s", title)
}
