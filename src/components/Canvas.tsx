import { useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react"
import type { Point, Shape, ToolId } from "../types/shape"
import { GRID_SIZE, MIN_SHAPE_SIZE, ACCENT_COLOR } from "../constants/canvas"
import {
  findTopmostShape,
  rectFromPoints,
  screenToWorld,
  worldToScreen,
} from "../utils/geometry"
import type { ShapesApi } from "../hooks/useShapes"
import type { ViewportApi } from "../hooks/useViewport"
import { ShapeView } from "./Shape"

interface CanvasProps {
  tool: ToolId
  viewport: ViewportApi
  shapesApi: ShapesApi
}

export function Canvas({ tool, viewport, shapesApi }: CanvasProps) {
  const { viewport: view, spaceHeld, isPanning, startPan, movePan, endPan, handleWheel } = viewport
  const containerRef = useRef<HTMLDivElement | null>(null)
  const createOriginRef = useRef<Point | null>(null)
  const moveRef = useRef<{ id: string; offset: Point; batchOpen: boolean } | null>(null)
  const [draft, setDraft] = useState<Shape | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = container.getBoundingClientRect()
      handleWheel(
        { x: event.clientX - rect.left, y: event.clientY - rect.top },
        event.deltaY,
      )
    }
    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [handleWheel])

  const getLocalPoint = (event: { clientX: number; clientY: number }): Point => {
    const container = containerRef.current
    if (!container) return { x: 0, y: 0 }
    const rect = container.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const container = containerRef.current
    if (!container) return
    const local = getLocalPoint(event)

    if (spaceHeld) {
      startPan(local)
    } else if (tool === "select") {
      const world = screenToWorld(local, view)
      const hit = findTopmostShape(shapesApi.shapes, world)
      shapesApi.select(hit ? hit.id : null)
      if (hit) {
        // Историю открываем лениво — при первом реальном сдвиге фигуры,
        // чтобы клик без движения не тратил шаг undo.
        moveRef.current = {
          id: hit.id,
          offset: { x: world.x - hit.x, y: world.y - hit.y },
          batchOpen: false,
        }
      }
    } else {
      const world = screenToWorld(local, view)
      createOriginRef.current = world
      setDraft({
        id: "draft",
        name: "",
        type: tool,
        x: world.x,
        y: world.y,
        width: 0,
        height: 0,
        fill: "transparent",
      })
    }
    container.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const local = getLocalPoint(event)
    movePan(local)

    if (createOriginRef.current) {
      const world = screenToWorld(local, view)
      const rect = rectFromPoints(createOriginRef.current, world)
      setDraft((current) =>
        current ? { ...current, ...rect } : current,
      )
    } else if (moveRef.current) {
      const move = moveRef.current
      const world = screenToWorld(local, view)
      const nextX = world.x - move.offset.x
      const nextY = world.y - move.offset.y
      const shape = shapesApi.shapes.find((item) => item.id === move.id)
      const unchanged =
        shape !== undefined && shape.x === nextX && shape.y === nextY
      if (!unchanged) {
        if (!move.batchOpen) {
          shapesApi.beginBatch()
          move.batchOpen = true
        }
        shapesApi.updateShape(move.id, { x: nextX, y: nextY })
      }
    }
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    endPan()

    if (createOriginRef.current) {
      const local = getLocalPoint(event)
      const world = screenToWorld(local, view)
      const rect = rectFromPoints(createOriginRef.current, world)
      createOriginRef.current = null
      setDraft(null)
      if (rect.width >= MIN_SHAPE_SIZE && rect.height >= MIN_SHAPE_SIZE) {
        shapesApi.addShape({ type: draft?.type ?? "rect", ...rect })
      }
    }
    moveRef.current = null

    const container = containerRef.current
    if (container?.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId)
    }
  }

  const cursor = spaceHeld
    ? isPanning
      ? "grabbing"
      : "grab"
    : tool === "select"
      ? "default"
      : "crosshair"

  const selected = shapesApi.selectedShape
  let selection: ReactNode = null
  if (selected) {
    const topLeft = worldToScreen({ x: selected.x, y: selected.y }, view)
    const width = selected.width * view.zoom
    const height = selected.height * view.zoom
    const handles: Point[] = [
      { x: topLeft.x, y: topLeft.y },
      { x: topLeft.x + width, y: topLeft.y },
      { x: topLeft.x, y: topLeft.y + height },
      { x: topLeft.x + width, y: topLeft.y + height },
    ]
    selection = (
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: topLeft.x - 2,
            top: topLeft.y - 2,
            width: width + 4,
            height: height + 4,
            border: `2px solid ${ACCENT_COLOR}`,
          }}
        />
        {handles.map((handle, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: handle.x - 4.5,
              top: handle.y - 4.5,
              width: 9,
              height: 9,
              background: "#ffffff",
              border: `1.5px solid ${ACCENT_COLOR}`,
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 flex-1 select-none overflow-hidden"
      style={{
        cursor,
        touchAction: "none",
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(circle, #c9c9c9 1px, transparent 1px)",
        backgroundSize: `${GRID_SIZE * view.zoom}px ${GRID_SIZE * view.zoom}px`,
        backgroundPosition: `${view.pan.x}px ${view.pan.y}px`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transform: `translate(${view.pan.x}px, ${view.pan.y}px) scale(${view.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {shapesApi.shapes.map((shape) => (
          <ShapeView key={shape.id} shape={shape} />
        ))}
        {draft && <ShapeView shape={draft} preview />}
      </div>

      {selection}

      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-mist bg-white/90 px-3 py-1 font-mono text-[12px] tracking-[0.03em] text-graphite">
        {Math.round(view.zoom * 100)}%
      </div>
    </div>
  )
}
