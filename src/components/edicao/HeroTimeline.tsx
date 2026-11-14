import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/scroll'

// ---------------------------------------------------------------
// Textos do hero. Troque aqui.
// ---------------------------------------------------------------
const EYEBROW = 'GSL Lab · Edição de vídeo'
const TITULO = 'Edição de'
const TITULO_DESTAQUE = 'vídeo.' // parte em vermelho
const SUBTITULO =
  'Cortes verticais para Reels e Shorts: ritmo, legenda e som pensados para prender quem está rolando o feed.'
const REGUA = ['00:00', '00:01', '00:02', '00:03']
// A posição e o tempo de cada clipe estão no index.css (.tl-clip-1, -2, -3).
const CLIPES = [
  { nome: 'Vídeo', className: 'tl-clip-1 bg-brand text-white' },
  { nome: 'Legendas', className: 'tl-clip-2 bg-rabisco text-ink' },
  { nome: 'Áudio', className: 'tl-clip-3 bg-ink text-white' },
]

// Os números abaixo precisam bater com a animação da agulha no index.css
// (.tl-head: 2.6s de duração, .4s de atraso).
const FPS = 30
const DURACAO_S = 2.6
const ATRASO_MS = 400
const ULTIMO_QUADRO = Math.round(DURACAO_S * FPS) // 78 quadros = 2 s e 18 quadros

// 78 → "00:00:02:18" (horas:minutos:segundos:quadros)
function formatarTimecode(quadro: number) {
  const segundos = String(Math.floor(quadro / FPS)).padStart(2, '0')
  const quadros = String(quadro % FPS).padStart(2, '0')
  return `00:00:${segundos}:${quadros}`
}

// Conta os quadros de 0 a 78, no mesmo ritmo da agulha.
function useTimecode() {
  // A função dentro do useState roda uma vez só, na montagem: com "reduzir
  // animações" já começamos no valor final e o efeito abaixo não faz nada.
  const [quadro, setQuadro] = useState(() => (prefersReducedMotion() ? ULTIMO_QUADRO : 0))

  useEffect(() => {
    if (prefersReducedMotion()) return

    const inicio = performance.now() + ATRASO_MS
    let raf = 0

    // O navegador chama tick() antes de cada pintura da tela (~60x por segundo)
    // e passa o horário atual. Em vez de somar +1 a cada chamada, calculamos o
    // quadro pelo TEMPO que passou: se a aba travar, o contador não atrasa.
    const tick = (agora: number) => {
      const q = Math.max(0, Math.min(ULTIMO_QUADRO, Math.floor(((agora - inicio) / 1000) * FPS)))
      setQuadro(q) // se o valor for igual ao anterior, o React não redesenha
      if (q < ULTIMO_QUADRO) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Cleanup: se o componente sair da tela no meio da contagem, cancela o
    // próximo tick (senão ele tentaria atualizar um componente que não existe mais).
    return () => cancelAnimationFrame(raf)
  }, []) // [] = roda só uma vez, ao montar

  return formatarTimecode(quadro)
}

export function HeroTimeline() {
  const timecode = useTimecode()

  return (
    <section
      id="edicao-hero"
      aria-labelledby="edicao-titulo"
      className="wrap flex min-h-[700px] flex-col justify-center md:min-h-[900px]"
    >
      <p className="tl-eyebrow mb-5 text-[12px] font-medium tracking-[.24em] text-brand uppercase">{EYEBROW}</p>

      {/* "relative": a agulha (absolute) se posiciona em relação a este bloco,
          que contém o título e as trilhas */}
      <div className="relative">
        <h1
          id="edicao-titulo"
          className="tl-title text-[clamp(40px,8.2vw,126px)] leading-[.98] font-extrabold tracking-[-.035em]"
        >
          {TITULO} <span className="text-brand">{TITULO_DESTAQUE}</span>
        </h1>

        {/* aria-hidden: é enfeite, o leitor de tela pula */}
        <div aria-hidden="true" className="mt-14 md:mt-16">
          <div className="tl-ruler flex h-[26px] justify-between border-b border-line text-[10px] tracking-[.06em] text-mute tabular-nums">
            {REGUA.map((marca) => (
              <span key={marca}>{marca}</span>
            ))}
          </div>

          {CLIPES.map((clipe) => (
            <div key={clipe.nome} className="relative mt-2 h-9 rounded-[7px] bg-off">
              <span
                className={cn(
                  'tl-clip absolute inset-y-0 flex items-center rounded-[7px] px-2.5 text-[11px] font-medium tracking-[.04em] md:px-3.5 md:text-[12px]',
                  clipe.className,
                )}
              >
                {clipe.nome}
              </span>
            </div>
          ))}
        </div>

        {/* agulha + etiqueta do timecode */}
        <div aria-hidden="true" className="tl-head absolute -top-10 -bottom-2 z-[2] -ml-px w-0.5 bg-brand">
          <span className="tl-tag absolute -top-7 left-0 rounded-[5px] bg-brand px-2 py-[5px] text-[11px] font-medium tracking-[.04em] whitespace-nowrap text-white tabular-nums">
            {timecode}
          </span>
        </div>
      </div>

      <p className="tl-sub mt-7 max-w-[520px] text-[16px] leading-[1.55] md:text-[18px]">{SUBTITULO}</p>
    </section>
  )
}
