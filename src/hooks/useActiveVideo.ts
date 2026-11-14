import { useEffect, useState, type RefObject } from 'react'

// Diz qual vídeo está "na tela" e quanto da lista já foi percorrido.
//
//   cur      → índice do vídeo atual (0, 1, 2, 3) ou -1 antes do primeiro.
//   progress → de 0 a 1: onde a agulha da barra fica (0 = início, 1 = fim).
//
// Uso (na página):
//   const artigos = useRef<(HTMLElement | null)[]>([])
//   const { cur, progress } = useActiveVideo(artigos)
//   <article ref={(el) => { artigos.current[i] = el }}>
//
// É a ÚNICA fonte de "qual vídeo está na tela": agulha, clipe ativo,
// destaque das linhas e o "Próximo vídeo" do celular leem daqui.

type Estado = { cur: number; progress: number }

// Faz a conta com as posições ATUAIS dos artigos na tela.
function medir(artigos: (HTMLElement | null)[]): Estado {
  const els = artigos.filter((el): el is HTMLElement => el !== null)
  const total = els.length
  if (total === 0) return { cur: -1, progress: 0 }

  // Linha de referência: o meio da janela (em px a partir do topo da janela).
  const linha = window.innerHeight * 0.5
  // getBoundingClientRect().top = distância do topo do elemento ao topo da
  // JANELA. Negativo = o topo já subiu para fora da tela.
  const topos = els.map((el) => el.getBoundingClientRect().top)

  // cur = o ÚLTIMO vídeo cujo topo já subiu acima da linha.
  let cur = -1
  topos.forEach((topo, i) => {
    if (topo <= linha) cur = i
  })
  if (cur === -1) return { cur, progress: 0 }

  // Fração dentro do vídeo atual: 0 quando o topo dele está na linha,
  // 1 quando o topo do PRÓXIMO chega na linha. Para o último vídeo, o
  // "fim" é o fundo dele mesmo.
  const inicio = topos[cur]
  const fim = cur < total - 1 ? topos[cur + 1] : els[cur].getBoundingClientRect().bottom
  const fracao = Math.min(1, Math.max(0, (linha - inicio) / (fim - inicio)))

  // Cada vídeo vale 1/total da barra: o vídeo 2 (cur = 1) na metade
  // do caminho dá (1 + 0,5) / 4 = 0,375.
  return { cur, progress: (cur + fracao) / total }
}

export function useActiveVideo(artigos: RefObject<(HTMLElement | null)[]>) {
  const [estado, setEstado] = useState<Estado>({ cur: -1, progress: 0 })

  useEffect(() => {
    let raf = 0 // id do quadro agendado; 0 = nenhum na fila

    const atualizar = () => {
      raf = 0
      const novo = medir(artigos.current)
      // Passando uma FUNÇÃO ao setEstado, recebemos o valor anterior.
      // Devolver o MESMO objeto (prev) faz o React não redesenhar nada.
      setEstado((prev) =>
        prev.cur === novo.cur && Math.abs(prev.progress - novo.progress) <= 0.002 ? prev : novo,
      )
    }

    // O scroll dispara dezenas de vezes por quadro em alguns aparelhos.
    // Se já existe uma conta agendada para o próximo quadro, ignoramos:
    // no máximo UMA conta por pintura de tela.
    const agendar = () => {
      if (raf) return
      raf = requestAnimationFrame(atualizar)
    }

    atualizar() // estado inicial certo (ex.: recarregou no meio da página)

    // passive: true promete ao navegador que não vamos chamar
    // preventDefault(), então ele pode rolar sem esperar o nosso código.
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)

    // Cleanup: ao sair da página, remove os ouvintes e cancela o quadro pendente.
    return () => {
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
      cancelAnimationFrame(raf)
    }
  }, [artigos]) // o objeto da ref é sempre o mesmo: o efeito roda uma vez só

  return estado
}
