import type { Point, Shape, ViewportState } from "../types/shape"
import { MAX_ZOOM, MIN_ZOOM } from "../constants/canvas"

export function screenToWorld(point: Point, viewport: ViewportState): Point {
  return {
    x: (point.x - viewport.pan.x) / viewport.zoom,
    y: (point.y - viewport.pan.y) / viewport.zoom,
  }
}

export function worldToScreen(point: Point, viewport: ViewportState): Point {
  return {
    x: point.x * viewport.zoom + viewport.pan.x,
    y: point.y * viewport.zoom + viewport.pan.y,
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function zoomAtPoint(
  cursor: Point,
  viewport: ViewportState,
  factor: number,
): ViewportState {
  const zoom = clamp(viewport.zoom * factor, MIN_ZOOM, MAX_ZOOM)
  const scale = zoom / viewport.zoom
  return {
    zoom,
    pan: {
      x: cursor.x - (cursor.x - viewport.pan.x) * scale,
      y: cursor.y - (cursor.y - viewport.pan.y) * scale,
    },
  }
}

export function rectFromPoints(a: Point, b: Point) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }
}

export function pointInShape(shape: Shape, point: Point): boolean {
  if (shape.type === "ellipse") {
    const rx = shape.width / 2
    const ry = shape.height / 2
    if (rx === 0 || ry === 0) return false
    const dx = (point.x - shape.x - rx) / rx
    const dy = (point.y - shape.y - ry) / ry
    return dx * dx + dy * dy <= 1
  }
  return (
    point.x >= shape.x &&
    point.x <= shape.x + shape.width &&
    point.y >= shape.y &&
    point.y <= shape.y + shape.height
  )
}

export function findTopmostShape(
  shapes: Shape[],
  point: Point,
): Shape | null {
  for (let i = shapes.length - 1; i >= 0; i -= 1) {
    if (pointInShape(shapes[i], point)) return shapes[i]
  }
  return null
}
