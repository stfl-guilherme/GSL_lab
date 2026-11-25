import { ArrowLeft, Mail } from 'lucide-react'
import { LimelightNav, type NavItem } from '@/components/ui/limelight-nav'
import { useVoltarAoInicio } from '@/hooks/useVoltarAoInicio'
import { scrollToSection } from '@/lib/scroll'

interface PaginaNavProps {
  meio: NavItem // o botão do meio é de cada página ("Próximo vídeo", "Projetos"…)
  // A página já descobre isso (useSecaoAtual) para montar o botão do meio;
  // recebendo pronto, não criamos um segundo observador de rolagem.
  noContato: boolean
}

// Barra fixa embaixo da tela das páginas internas, só no celular:
// Voltar ao início · botão da página · Contato.
export function PaginaNav({ meio, noContato }: PaginaNavProps) {
  const voltar = useVoltarAoInicio()

  const items: NavItem[] = [
    { id: 'voltar', icon: <ArrowLeft />, label: 'Voltar ao início', onClick: voltar },
    meio,
    { id: 'contato', icon: <Mail />, label: 'Contato', onClick: () => scrollToSection('contato') },
  ]

  return (
    // A faixa ocupa a largura toda só para centralizar; pointer-events-none
    // deixa o toque "atravessar" as laterais vazias. z-30: acima da página,
    // abaixo do visualizador da home (z-50).
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-30 flex justify-center md:hidden">
      <LimelightNav
        items={items}
        // controlado pelo scroll: 2 = Contato, 1 = o do meio. O 0 (Voltar) nunca.
        activeIndex={noContato ? 2 : 1}
        className="pointer-events-auto rounded-xl border-line bg-white shadow-[0_8px_24px_rgb(43_43_46/.10)]"
      />
    </div>
  )
}
