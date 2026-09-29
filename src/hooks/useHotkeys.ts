import { useEffect, useRef } from "react"
import { TOOL_BY_CODE } from "../constants/tools"
import type { ToolId } from "../types/shape"

interface HotkeysHandlers {
  onTool: (tool: ToolId) => void
  onUndo: () => void
  onRedo: () => void
}

export function useHotkeys(handlers: HotkeysHandlers) {
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

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

      if ((event.ctrlKey || event.metaKey) && event.code === "KeyZ") {
        event.preventDefault()
        if (event.shiftKey) {
          handlersRef.current.onRedo()
        } else {
          handlersRef.current.onUndo()
        }
        return
      }

      if (event.ctrlKey || event.metaKey || event.altKey) return

      const tool = TOOL_BY_CODE[event.code]
      if (tool) {
        event.preventDefault()
        handlersRef.current.onTool(tool)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
}
