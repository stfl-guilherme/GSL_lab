import type { PortfolioItem } from '@/data/portfolio'
import { cn } from '@/lib/utils'
import { Icon } from './Icon'
import { SiteMockup } from './SiteMockup'

// Capa do arquivo dentro da pasta. O "if (item.kind === …)" faz o
// TypeScript saber qual tipo de item é: depois do primeiro if ele não
// deixa mais usar item.image num site, por exemplo.
export function CardThumb({ item }: { item: PortfolioItem }) {
  if (item.kind === 'site') return <SiteMockup />

  if (item.kind === 'image') {
    return (
      <img
        src={item.image}
        alt=""
        className={cn(
          'block w-full',
          item.deitada ? 'aspect-[16/10] object-left-top' : 'aspect-[4/5]',
          item.fit === 'contain' ? 'bg-[#0d2a2e] object-contain' : 'bg-[#111] object-cover',
        )}
      />
    )
  }

  // vídeo: capa vertical; sem capa, um fundo escuro com o ícone de play
  if (!item.thumbnail) {
    return (
      <span className="grid aspect-[9/16] w-full place-items-center bg-ink text-white/70">
        <Icon name="play" />
      </span>
    )
  }
  return <img src={item.thumbnail} alt="" className="block aspect-[9/16] w-full bg-[#111] object-cover" />
}
