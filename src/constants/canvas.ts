import type { ShapeType } from "../types/shape"

export const GRID_SIZE = 20

export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 4
export const ZOOM_FACTOR = 1.1

export const MIN_SHAPE_SIZE = 2

export const DEFAULT_FILL = "#d9d9d9"

export const SHAPE_TYPE_LABELS: Record<ShapeType, string> = {
  rect: "Прямоугольник",
  ellipse: "Эллипс",
}

export const SHAPE_COLORS = [
  "#000000",
  "#595959",
  "#d9d9d9",
  "#ffffff",
  "#4d49fc",
  "#00b6ff",
  "#24cb71",
  "#ff7237",
  "#33dfdf",
  "#b98e01",
  "#e4ff97",
  "#c4baff",
  "#ffc9c1",
  "#c7f8fb",
]
