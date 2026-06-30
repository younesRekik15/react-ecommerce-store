import { useEffect } from 'react'

const BASE = 'StitchCraft'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : BASE
  }, [title])
}
