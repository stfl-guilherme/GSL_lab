import { useEffect } from 'react'
import { Contact } from '@/components/Contact'
import { BackButton } from '@/components/edicao/BackButton'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SkipLink } from '@/components/SkipLink'
import { HeroEditor } from '@/components/sistemas/HeroEditor'
import { ProjetosGrade } from '@/components/sistemas/ProjetosGrade'
import { SistemasNav } from '@/components/sistemas/SistemasNav'

// Página /#/sistemas. Mesmo modelo da EdicaoVideo: Cabeçalho, Contato e
// Rodapé são os componentes da home; o miolo (hero + projetos) é daqui.
export function Sistemas() {
  // Trocar de rota não zera a rolagem (ver EdicaoVideo).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    // pb no celular: espaço para a barra fixa não cobrir o rodapé
    <div className="@container relative overflow-x-clip pb-[calc(96px+env(safe-area-inset-bottom))] md:pb-0">
      <SkipLink />
      <Header variant="pagina" />
      <main id="topo" tabIndex={-1} className="outline-none">
        <HeroEditor />
        <ProjetosGrade />
        <Contact variant="pagina" />
      </main>
      <Footer />

      <SistemasNav />
      <BackButton />
    </div>
  )
}
