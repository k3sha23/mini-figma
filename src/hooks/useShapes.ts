import { useCallback, useRef, useState } from "react"
import type { Shape, ShapeDraft } from "../types/shape"
import { DEFAULT_FILL, SHAPE_TYPE_LABELS } from "../constants/canvas"

interface ShapesState {
  shapes: Shape[]
  past: Shape[][]
  future: Shape[][]
  selectedId: string | null
}

const HISTORY_LIMIT = 50

function pushHistory(state: ShapesState): ShapesState {
  return {
    ...state,
    past: [...state.past.slice(-(HISTORY_LIMIT - 1)), state.shapes],
    future: [],
  }
}

export function useShapes() {
  const [state, setState] = useState<ShapesState>({
    shapes: [],
    past: [],
    future: [],
    selectedId: null,
  })
  const countersRef = useRef<Record<Shape["type"], number>>({
    rect: 0,
    ellipse: 0,
  })

  const select = useCallback((id: string | null) => {
    setState((current) =>
      current.selectedId === id ? current : { ...current, selectedId: id },
    )
  }, [])

  const beginBatch = useCallback(() => {
    setState(pushHistory)
  }, [])

  const addShape = useCallback((draft: ShapeDraft) => {
    if (draft.width <= 0 || draft.height <= 0) return null
    const id = crypto.randomUUID()
    const count = countersRef.current[draft.type] + 1
    countersRef.current[draft.type] = count
    const shape: Shape = {
      id,
      name: `${SHAPE_TYPE_LABELS[draft.type]} ${count}`,
      type: draft.type,
      x: draft.x,
      y: draft.y,
      width: draft.width,
      height: draft.height,
      fill: DEFAULT_FILL,
    }
    setState((current) => ({
      ...pushHistory(current),
      shapes: [...current.shapes, shape],
      selectedId: id,
    }))
    return id
  }, [])

  const updateShape = useCallback(
    (
      id: string,
      patch: Partial<Pick<Shape, "x" | "y" | "width" | "height" | "fill">>,
    ) => {
      setState((current) => ({
        ...current,
        shapes: current.shapes.map((shape) =>
          shape.id === id ? { ...shape, ...patch } : shape,
        ),
      }))
    },
    [],
  )

  const setFill = useCallback((id: string, fill: string) => {
    setState((current) => {
      const shape = current.shapes.find((item) => item.id === id)
      if (!shape || shape.fill === fill) return current
      return {
        ...pushHistory(current),
        shapes: current.shapes.map((item) =>
          item.id === id ? { ...item, fill } : item,
        ),
      }
    })
  }, [])

  const undo = useCallback(() => {
    setState((current) => {
      if (current.past.length === 0) return current
      const previous = current.past[current.past.length - 1]
      const selectedId =
        current.selectedId !== null &&
        previous.some((shape) => shape.id === current.selectedId)
          ? current.selectedId
          : null
      return {
        ...current,
        shapes: previous,
        past: current.past.slice(0, -1),
        future: [current.shapes, ...current.future].slice(0, HISTORY_LIMIT),
        selectedId,
      }
    })
  }, [])

  const redo = useCallback(() => {
    setState((current) => {
      if (current.future.length === 0) return current
      const [next, ...rest] = current.future
      const selectedId =
        current.selectedId !== null &&
        next.some((shape) => shape.id === current.selectedId)
          ? current.selectedId
          : null
      return {
        ...current,
        shapes: next,
        past: [...current.past, current.shapes].slice(-HISTORY_LIMIT),
        future: rest,
        selectedId,
      }
    })
  }, [])

  const selectedShape =
    state.shapes.find((shape) => shape.id === state.selectedId) ?? null

  return {
    shapes: state.shapes,
    selectedId: state.selectedId,
    selectedShape,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    select,
    beginBatch,
    addShape,
    updateShape,
    setFill,
    undo,
    redo,
  }
}

export type ShapesApi = ReturnType<typeof useShapes>
