import type { ToolId } from "../types/shape"
import { TOOLS } from "../constants/tools"

interface ToolbarProps {
  tool: ToolId
  onToolChange: (tool: ToolId) => void
}

function ToolIcon({ id }: { id: ToolId }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const

  if (id === "select") {
    return (
      <svg {...common}>
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      </svg>
    )
  }
  if (id === "rect") {
    return (
      <svg {...common}>
        <rect width="18" height="18" x="3" y="3" rx="1" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

export function Toolbar({ tool, onToolChange }: ToolbarProps) {
  return (
    <nav className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-mist bg-paper py-3">
      {TOOLS.map((def) => {
        const active = tool === def.id
        return (
          <button
            key={def.id}
            type="button"
            title={`${def.label} (${def.hotkey.toUpperCase()})`}
            aria-label={def.label}
            aria-pressed={active}
            onClick={() => onToolChange(def.id)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              active
                ? "bg-accent text-white"
                : "text-ink hover:bg-mist"
            }`}
          >
            <ToolIcon id={def.id} />
          </button>
        )
      })}
    </nav>
  )
}
