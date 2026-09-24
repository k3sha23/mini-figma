import type { Shape } from "../types/shape"

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
        background: preview ? "rgba(77, 73, 252, 0.08)" : shape.fill,
        border: preview ? "1px dashed #4d49fc" : "none",
        borderRadius: shape.type === "ellipse" ? "50%" : 0,
      }}
    />
  )
}
