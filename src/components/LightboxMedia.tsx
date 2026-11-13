import type { PortfolioItem } from '@/data/portfolio'
import { Icon } from './Icon'
import { SiteMockup } from './SiteMockup'

const playClass =
  'absolute top-1/2 left-1/2 grid size-[72px] -translate-1/2 place-items-center rounded-full bg-white/[.92] text-brand'

// O conteúdo grande do visualizador: muda conforme o tipo do item.
export function LightboxMedia({ item }: { item: PortfolioItem }) {
  if (item.kind === 'image') {
    return (
      <img
        src={item.image}
        alt={item.alt ?? item.name}
        className="block max-h-[min(72vh,820px)] max-w-full rounded-[10px]"
      />
    )
  }

  if (item.kind === 'site') {
    return (
      <div className="w-[min(80vw,760px)] max-w-full overflow-hidden rounded-[10px] border border-line">
        <SiteMockup />
      </div>
    )
  }

  // vídeo: capa vertical 9:16 com o botão de play por cima
  return (
    <div className="relative aspect-[9/16] w-[min(calc(min(72vh,640px)*9/16),calc(92vw-24px))] overflow-hidden rounded-[10px] bg-ink">
      {item.thumbnail && <img src={item.thumbnail} alt="" className="block size-full object-cover" />}

      {/* Com "url" no portfolio.ts: o play abre o vídeo em nova aba.
          Sem "url": é só um enfeite, por isso fica escondido do leitor de tela. */}
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Assistir ${item.name} (abre em nova aba)`}
          className={playClass}
        >
          <Icon name="play" size={28} className="fill-current" />
        </a>
      ) : (
        <span aria-hidden="true" className={playClass}>
          <Icon name="play" size={28} className="fill-current" />
        </span>
      )}

      {/* barra de progresso decorativa */}
      <span aria-hidden="true" className="absolute inset-x-3.5 bottom-4 h-[3px] rounded-full bg-white/35">
        <span className="block h-full w-[12%] rounded-full bg-brand" />
      </span>
    </div>
  )
}
