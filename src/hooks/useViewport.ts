import { useCallback, useEffect, useRef, useState } from "react"
import type { Point, ViewportState } from "../types/shape"
import { ZOOM_FACTOR } from "../constants/canvas"
import { zoomAtPoint } from "../utils/geometry"

export function useViewport() {
  const [viewport, setViewport] = useState<ViewportState>(() => ({
    zoom: 1,
    pan: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  }))
  const viewportRef = useRef(viewport)
  viewportRef.current = viewport

  const [spaceHeld, setSpaceHeld] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef<{ cursor: Point; pan: Point } | null>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return
      }
      if (event.code === "Space") {
        event.preventDefault()
        if (!event.repeat) setSpaceHeld(true)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") setSpaceHeld(false)
    }
    const onBlur = () => {
      setSpaceHeld(false)
      panStartRef.current = null
      setIsPanning(false)
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("blur", onBlur)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("blur", onBlur)
    }
  }, [])

  const startPan = useCallback((cursor: Point) => {
    panStartRef.current = { cursor, pan: viewportRef.current.pan }
    setIsPanning(true)
  }, [])

  const movePan = useCallback((cursor: Point) => {
    const start = panStartRef.current
    if (!start) return
    setViewport((current) => ({
      ...current,
      pan: {
        x: start.pan.x + (cursor.x - start.cursor.x),
        y: start.pan.y + (cursor.y - start.cursor.y),
      },
    }))
  }, [])

  const endPan = useCallback(() => {
    panStartRef.current = null
    setIsPanning(false)
  }, [])

  const handleWheel = useCallback((cursor: Point, deltaY: number) => {
    const factor = deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR
    setViewport((current) => zoomAtPoint(cursor, current, factor))
  }, [])

  return {
    viewport,
    spaceHeld,
    isPanning,
    startPan,
    movePan,
    endPan,
    handleWheel,
  }
}

export type ViewportApi = ReturnType<typeof useViewport>
