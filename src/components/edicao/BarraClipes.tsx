import type { RefObject } from 'react'
import { videos } from '@/data/videos'
import { scrollToElement } from '@/lib/scroll'
import { cn } from '@/lib/utils'

// Marcas da régua: só enfeite, não são tempos reais dos vídeos.
const REGUA = ['00:00', '00:15', '00:30', '00:45', '01:00']
// Quanto o vídeo para ABAIXO do topo da janela ao clicar num clipe:
// a altura desta barra (~127px) + um respiro.
const FOLGA_DA_BARRA = 150

// Container desta seção. O botão flutuante de voltar (desktop) ocupa de
// 24px a 88px da borda esquerda e cobriria o player dos vídeos 1 e 3.
// Até 1408px (88rem) a margem normal (48px) não basta, então nessa faixa
// usamos 112px dos dois lados (88 + 24 de respiro). A partir de 1408px
// o centro da página já afasta o conteúdo o suficiente.
export const WRAP_VIDEOS = 'wrap md:max-[88rem]:px-28'

const doisDigitos = (n: number) => String(n).padStart(2, '0')

interface BarraClipesProps {
  artigos: RefObject<(HTMLElement | null)[]>
  cur: number // -1 antes do primeiro vídeo
  progress: number // 0 a 1
}

// Barra que gruda no topo enquanto os vídeos passam. Só no desktop:
// "hidden md:block" = escondida até 761px.
export function BarraClipes({ artigos, cur, progress }: BarraClipesProps) {
  // Antes do primeiro vídeo (cur = -1) o clipe 01 já aparece aceso.
  const ativo = Math.max(0, cur)

  const irPara = (i: number) => {
    const el = artigos.current[i]
    if (el) scrollToElement(el, FOLGA_DA_BARRA)
  }

  return (
    <div className="sticky top-0 z-30 hidden border-b border-line bg-white pt-3 pb-3.5 md:block">
      <div className={WRAP_VIDEOS}>
        {/* "relative": a agulha (absolute) se posiciona em relação a este bloco.
            pt-[30px]: espaço em cima para a etiqueta da agulha caber. */}
        <div className="relative pt-[30px]">
          <div
            aria-hidden="true"
            className="tl-ruler flex h-[26px] justify-between border-b border-line text-[10px] tracking-[.06em] text-mute tabular-nums"
          >
            {REGUA.map((marca) => (
              <span key={marca}>{marca}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-4 gap-1">
            {videos.map((video, i) => (
              <button
                key={video.id}
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ir para o vídeo ${i + 1}: ${video.titulo}`}
                aria-current={i === ativo ? 'true' : undefined}
                className={cn(
                  'flex h-9 min-w-0 cursor-pointer items-center gap-2 rounded-[7px] px-3.5 text-left text-[12px] font-medium tracking-[.04em] whitespace-nowrap transition-colors duration-300',
                  i === ativo ? 'bg-brand text-white' : 'bg-off text-mute',
                )}
              >
                <b className="font-extrabold">{doisDigitos(i + 1)}</b>
                {/* truncate = overflow hidden + reticências no fim */}
                <span className="truncate">{video.titulo}</span>
              </button>
            ))}
          </div>

          {/* Agulha: o "left" vem do progress (0 → 0%, 1 → 100%).
              É style inline porque o valor muda a cada quadro de rolagem. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[26px] -bottom-1.5 z-[2] -ml-px w-0.5 bg-brand"
            style={{ left: `${progress * 100}%` }}
          >
            <span className="absolute -top-[26px] left-px -translate-x-1/2 rounded-[5px] bg-brand px-2 py-[5px] text-[11px] font-medium tracking-[.04em] whitespace-nowrap text-white tabular-nums">
              {doisDigitos(ativo + 1)} / {doisDigitos(videos.length)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
