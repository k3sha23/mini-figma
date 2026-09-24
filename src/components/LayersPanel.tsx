import type { Shape } from "../types/shape"

interface LayersPanelProps {
  shapes: Shape[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

function LayerIcon({ type }: { type: Shape["type"] }) {
  const common = {
    width: 12,
    height: 12,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
  } as const
  return type === "ellipse" ? (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  ) : (
    <svg {...common}>
      <rect width="18" height="18" x="3" y="3" rx="1" />
    </svg>
  )
}

export function LayersPanel({ shapes, selectedId, onSelect }: LayersPanelProps) {
  return (
    <section aria-label="Слои" className="flex min-h-0 flex-1 flex-col p-4">
      <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-graphite">
        Слои
      </h2>

      {shapes.length === 0 ? (
        <p className="mt-3 text-[13px] leading-relaxed text-graphite">
          Пока пусто — создайте фигуру на канвасе
        </p>
      ) : (
        <ul className="mt-2 min-h-0 flex-1 space-y-0.5 overflow-y-auto">
          {[...shapes].reverse().map((shape) => {
            const isSelected = shape.id === selectedId
            return (
              <li key={shape.id}>
                <button
                  type="button"
                  onClick={() => onSelect(shape.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors ${
                    isSelected
                      ? "bg-mist text-ink"
                      : "text-graphite hover:bg-mist/60"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                      isSelected ? "text-accent" : "text-graphite"
                    }`}
                  >
                    <LayerIcon type={shape.type} />
                  </span>
                  <span className="truncate">{shape.name}</span>
                  <span
                    aria-hidden
                    style={{ backgroundColor: shape.fill }}
                    className="ml-auto h-3 w-3 shrink-0 rounded-full border border-black/10"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
