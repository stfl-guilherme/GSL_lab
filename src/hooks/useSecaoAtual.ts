import { useEffect, useState } from 'react'

// Diz qual seção está "no meio da tela" agora (devolve o id dela).
//
// Como: rootMargin '-50% 0px -50% 0px' encolhe a área observada até virar
// uma LINHA horizontal no meio da tela. Só uma seção por vez cruza essa
// linha, então não precisamos comparar "quem está mais visível".
// Se a linha estiver num trecho sem seção (ex.: rodapé), vale a última.
//
// IMPORTANTE: passe uma lista que não muda a cada render (uma constante
// fora do componente). Lista nova = o efeito roda de novo.
export function useSecaoAtual(ids: string[]) {
  const [atual, setAtual] = useState(ids[0])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setAtual(entry.target.id)
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return atual
}
