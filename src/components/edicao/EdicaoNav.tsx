import { ArrowLeft, ChevronDown, Mail } from 'lucide-react'
import { LimelightNav, type NavItem } from '@/components/ui/limelight-nav'
import { ID_VIDEOS, idDoVideo, videos } from '@/data/videos'
import { useSecaoAtual } from '@/hooks/useSecaoAtual'
import { useVoltarAoInicio } from '@/hooks/useVoltarAoInicio'
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

// Barra fixa embaixo da tela, só no celular.
export function EdicaoNav({ cur }: EdicaoNavProps) {
  const voltar = useVoltarAoInicio()
  const noContato = useSecaoAtual(SECOES) === CONTATO

  // "No fim" = último vídeo ou contato: o botão passa a voltar ao primeiro.
  const noFim = noContato || cur === ULTIMO
  // Antes do primeiro vídeo: -1 + 1 = 0 → vai para o vídeo 1.
  const destino = noFim ? 0 : cur + 1

  const items: NavItem[] = [
    { id: 'voltar', icon: <ArrowLeft />, label: 'Voltar ao início', onClick: voltar },
    {
      id: 'proximo',
      // a seta gira 180° (aponta para cima) quando o destino é voltar ao 1º
      icon: <ChevronDown className={cn('transition-[rotate,opacity] duration-300', noFim && 'rotate-180')} />,
      label: noFim ? 'Voltar ao primeiro vídeo' : 'Próximo vídeo',
      onClick: () => scrollToSection(idDoVideo(destino)),
    },
    { id: 'contato', icon: <Mail />, label: 'Contato', onClick: () => scrollToSection(CONTATO) },
  ]

  return (
    // A faixa ocupa a largura toda só para centralizar; pointer-events-none
    // deixa o toque "atravessar" as laterais vazias. z-30: acima da página,
    // abaixo do visualizador da home (z-50).
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-30 flex justify-center md:hidden">
      <LimelightNav
        items={items}
        // controlado pelo scroll: 2 = Contato, 1 = Próximo. O 0 (Voltar) nunca.
        activeIndex={noContato ? 2 : 1}
        className="pointer-events-auto rounded-xl border-line bg-white shadow-[0_8px_24px_rgb(43_43_46/.10)]"
      />
    </div>
  )
}
