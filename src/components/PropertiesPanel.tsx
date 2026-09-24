import type { Shape } from "../types/shape"
import { SHAPE_COLORS } from "../constants/canvas"

interface PropertiesPanelProps {
  selected: Shape | null
  onColorChange: (fill: string) => void
}

export function PropertiesPanel({ selected, onColorChange }: PropertiesPanelProps) {
  return (
    <section aria-label="Свойства" className="border-b border-mist p-4">
      <h2 className="font-mono text-[12px] uppercase tracking-[0.05em] text-graphite">
        Свойства
      </h2>

      {!selected ? (
        <p className="mt-3 text-[13px] leading-relaxed text-graphite">
          Выберите фигуру на канвасе или в списке слоёв
        </p>
      ) : (
        <div className="mt-3">
          <p className="mb-3 text-[13px] font-medium text-ink">{selected.name}</p>
          <p className="mb-2 font-mono text-[12px] uppercase tracking-[0.05em] text-graphite">
            Цвет
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {SHAPE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                aria-label={`Цвет ${color}`}
                onClick={() => onColorChange(color)}
                style={{ backgroundColor: color }}
                className={`h-6 w-6 rounded-lg border transition ${
                  selected.fill.toLowerCase() === color.toLowerCase()
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-black/10 hover:border-ink/50"
                }`}
              />
            ))}
          </div>
          <label className="mt-3 flex items-center justify-between gap-2 text-[13px] text-graphite">
            Свой цвет
            <input
              type="color"
              value={selected.fill}
              onChange={(event) => onColorChange(event.target.value)}
              className="h-6 w-10 cursor-pointer rounded-lg border border-black/10 bg-transparent p-0.5"
            />
          </label>
        </div>
      )}
    </section>
  )
}
