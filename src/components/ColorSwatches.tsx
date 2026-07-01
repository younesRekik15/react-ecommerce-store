import { contrastColor } from '../constants/colors'

interface ColorSwatchesProps {
  colors: string[]
  selected: string
  onChange: (color: string) => void
}

export default function ColorSwatches({ colors, selected, onChange }: ColorSwatchesProps) {
  return (
    <div className="color-options">
      {colors.map((hex) => (
        <button
          key={hex}
          type="button"
          className={`color-swatch ${selected === hex ? 'active' : ''}`}
          style={{ backgroundColor: hex }}
          onClick={() => onChange(hex)}
          title={hex}
        >
          {selected === hex && (
            <span className="color-swatch-check" style={{ color: contrastColor(hex) }}>
              &#10003;
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
