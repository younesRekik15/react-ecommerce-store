import { useRef } from 'react'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
  id?: string
}

/**
 * Tunisian phone input (+216 xx xxx xxx).
 *
 * - Prefixes the value with +216 automatically
 * - Strips all non-digit characters
 * - Formats as "+216 XX XXX XXX" while typing
 * - Only allows digits after the prefix
 */
export default function PhoneInput({ value, onChange, required, id }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  /** Return only the digits past the +216 prefix */
  function stripPrefix(val: string): string {
    return val.replace(/^\+216\s*/, '').replace(/\D/g, '')
  }

  /** Format raw digits into "+216 XX XXX XXX" */
  function formatDigits(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 8)
    if (digits.length <= 2) return `+216 ${digits}`
    if (digits.length <= 5) return `+216 ${digits.slice(0, 2)} ${digits.slice(2)}`
    return `+216 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)}`
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const digits = stripPrefix(raw)
    onChange(formatDigits(digits))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    /* Allow navigation keys */
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)) {
      return
    }
    /* Prevent non-digit input */
    if (!/^\d$/.test(e.key)) {
      e.preventDefault()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text')
    const digits = pasted.replace(/\D/g, '').slice(0, 8)
    e.preventDefault()
    onChange(formatDigits(digits))
  }

  /* Place caret after the prefix area on focus */
  function handleFocus() {
    const el = inputRef.current
    if (!el) return
    const prefixLen = '+216 '.length
    if (el.selectionStart !== null && el.selectionStart < prefixLen) {
      const pos = Math.max(el.value.length, prefixLen)
      el.setSelectionRange(pos, pos)
    }
  }

  return (
    <input
      ref={inputRef}
      id={id}
      type="tel"
      inputMode="numeric"
      required={required}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      placeholder="+216 __ ___ ___"
      autoComplete="tel"
    />
  )
}
