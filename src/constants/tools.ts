import type { ToolId } from "../types/shape"

export interface ToolDef {
  id: ToolId
  label: string
  hotkey: string
}

export const TOOLS: ToolDef[] = [
  { id: "select", label: "Курсор", hotkey: "v" },
  { id: "rect", label: "Прямоугольник", hotkey: "r" },
  { id: "ellipse", label: "Эллипс", hotkey: "o" },
]

export const TOOL_BY_CODE: Partial<Record<string, ToolId>> = {
  KeyV: "select",
  KeyR: "rect",
  KeyO: "ellipse",
}
