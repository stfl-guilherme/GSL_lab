import { useEffect, useRef, useState } from 'react'

// Avisa quando um elemento aparece na tela pela PRIMEIRA vez.
// Depois disso para de observar: a animação de entrada roda uma vez só.
//
// Uso:
//   const { ref, inView } = useInView<HTMLDivElement>()
//   <div ref={ref} className={inView ? 'is-visible' : ''}>
//
// <T extends Element> é um "genérico": quem usa o hook diz qual tipo de
// elemento vai receber o ref (div, ul, section…) e o TypeScript confere.
export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    // a função retornada roda quando o componente sai da tela: limpa o observador
    return () => observer.disconnect()
  }, [inView, threshold])

  return { ref, inView }
}
