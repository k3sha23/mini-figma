export type ShapeType = "rect" | "ellipse"

export type ToolId = "select" | "rect" | "ellipse"

export interface Point {
  x: number
  y: number
}

export interface Shape {
  id: string
  name: string
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
  fill: string
}

export interface ViewportState {
  zoom: number
  pan: Point
}

export interface ShapeDraft {
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
}
