import { useEffect, useState } from 'react'

// Diz se uma media query do CSS é verdadeira AGORA e atualiza o
// componente quando ela muda.
//
// Uso:
//   const canHover = useMediaQuery('(hover: hover)') // true só com mouse
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
