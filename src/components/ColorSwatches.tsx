import { COLOR_HEX, contrastColor } from '../constants/colors'

interface ColorSwatchesProps {
  colors: string[]
  selected: string
  onChange: (color: string) => void
}

/**
 * Renders actual colour circles instead of text buttons.
 * Shows the colour name as a small label beneath each swatch.
 */
export default function ColorSwatches({ colors, selected, onChange }: ColorSwatchesProps) {
  return (
    <div className="color-options">
      {colors.map((name) => {
        const hex = COLOR_HEX[name.toLowerCase()] || '#cccccc'
        const isSelected = selected === name
        return (
          <div key={name} className="color-swatch-wrapper">
            <button
              type="button"
              className={`color-swatch ${isSelected ? 'active' : ''}`}
              style={{ backgroundColor: hex }}
              onClick={() => onChange(name)}
              title={name.charAt(0).toUpperCase() + name.slice(1)}
            >
              {isSelected && (
                <span
                  className="color-swatch-check"
                  style={{ color: contrastColor(hex) }}
                >
                  &#10003;
                </span>
              )}
            </button>
            <span className="color-swatch-label">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
