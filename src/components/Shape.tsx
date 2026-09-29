import type { Shape } from "../types/shape"
import { ACCENT_COLOR, PREVIEW_FILL } from "../constants/canvas"

interface ShapeViewProps {
  shape: Shape
  preview?: boolean
}

export function ShapeView({ shape, preview = false }: ShapeViewProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: shape.x,
        top: shape.y,
        width: shape.width,
        height: shape.height,
        boxSizing: "border-box",
        background: preview ? PREVIEW_FILL : shape.fill,
        border: preview ? `1px dashed ${ACCENT_COLOR}` : "none",
        borderRadius: shape.type === "ellipse" ? "50%" : 0,
      }}
    />
  )
}
