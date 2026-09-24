import { useState } from "react"
import type { ToolId } from "./types/shape"
import { useViewport } from "./hooks/useViewport"
import { useShapes } from "./hooks/useShapes"
import { useHotkeys } from "./hooks/useHotkeys"
import { Canvas } from "./components/Canvas"
import { Toolbar } from "./components/Toolbar"
import { PropertiesPanel } from "./components/PropertiesPanel"
import { LayersPanel } from "./components/LayersPanel"

export default function App() {
  const [tool, setTool] = useState<ToolId>("select")
  const viewport = useViewport()
  const shapesApi = useShapes()

  useHotkeys({
    onTool: setTool,
    onUndo: shapesApi.undo,
    onRedo: shapesApi.redo,
  })

  const handleColorChange = (fill: string) => {
    if (shapesApi.selectedId) {
      shapesApi.setFill(shapesApi.selectedId, fill)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-paper text-ink">
      <Toolbar tool={tool} onToolChange={setTool} />
      <Canvas tool={tool} viewport={viewport} shapesApi={shapesApi} />
      <aside className="flex w-60 shrink-0 flex-col border-l border-mist bg-paper">
        <PropertiesPanel
          selected={shapesApi.selectedShape}
          onColorChange={handleColorChange}
        />
        <LayersPanel
          shapes={shapesApi.shapes}
          selectedId={shapesApi.selectedId}
          onSelect={shapesApi.select}
        />
      </aside>
    </div>
  )
}
