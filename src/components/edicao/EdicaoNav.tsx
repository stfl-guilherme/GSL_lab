import { ChevronDown } from 'lucide-react'
import { PaginaNav } from '@/components/PaginaNav'
import { ID_VIDEOS, idDoVideo, videos } from '@/data/videos'
import { useSecaoAtual } from '@/hooks/useSecaoAtual'
import { scrollToSection } from '@/lib/scroll'
import { cn } from '@/lib/utils'

// Seções grandes da página, na ordem. Ficam FORA do componente para a
// lista ser sempre a mesma (o useSecaoAtual depende disso). Aqui elas só
// servem para saber se estamos no Contato; QUAL vídeo está na tela vem
// do useActiveVideo (prop "cur").
const HERO = 'edicao-hero' // mesmo id usado no HeroTimeline
const CONTATO = 'contato'
const SECOES = [HERO, ID_VIDEOS, CONTATO]
const ULTIMO = videos.length - 1

interface EdicaoNavProps {
  cur: number // vídeo atual (useActiveVideo); -1 antes do primeiro
}

// Barra do celular da página de Edição: a PaginaNav com "Próximo vídeo" no meio.
export function EdicaoNav({ cur }: EdicaoNavProps) {
  const noContato = useSecaoAtual(SECOES) === CONTATO

  // "No fim" = último vídeo ou contato: o botão passa a voltar ao primeiro.
  const noFim = noContato || cur === ULTIMO
  // Antes do primeiro vídeo: -1 + 1 = 0 → vai para o vídeo 1.
  const destino = noFim ? 0 : cur + 1

  return (
    <PaginaNav
      noContato={noContato}
      meio={{
        id: 'proximo',
        // a seta gira 180° (aponta para cima) quando o destino é voltar ao 1º
        icon: <ChevronDown className={cn('transition-[rotate,opacity] duration-300', noFim && 'rotate-180')} />,
        label: noFim ? 'Voltar ao primeiro vídeo' : 'Próximo vídeo',
        onClick: () => scrollToSection(idDoVideo(destino)),
      }}
    />
  )
}
