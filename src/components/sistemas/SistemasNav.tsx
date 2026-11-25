import { LayoutGrid } from 'lucide-react'
import { PaginaNav } from '@/components/PaginaNav'
import { useSecaoAtual } from '@/hooks/useSecaoAtual'
import { scrollToElement } from '@/lib/scroll'
import { ID_HERO } from './HeroEditor'
import { ID_GRADE, ID_PROJETOS } from './ProjetosGrade'

// Fora do componente: a lista não pode mudar a cada render (ver useSecaoAtual).
const CONTATO = 'contato'
const SECOES = [ID_HERO, ID_PROJETOS, CONTATO]

// Barra do celular da página Sistemas: a PaginaNav com "Projetos" no meio.
export function SistemasNav() {
  const noContato = useSecaoAtual(SECOES) === CONTATO

  return (
    <PaginaNav
      noContato={noContato}
      meio={{
        id: 'projetos',
        icon: <LayoutGrid />,
        label: 'Projetos',
        onClick: () => {
          const grade = document.getElementById(ID_GRADE)
          if (grade) scrollToElement(grade, 120) // 120 px de folga no topo
        },
      }}
    />
  )
}
