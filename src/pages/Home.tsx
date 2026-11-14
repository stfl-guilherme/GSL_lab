import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { SkipLink } from '@/components/SkipLink'
import { Work } from '@/components/Work'

// Formato do "state" que outra página pode mandar ao voltar para cá.
type HomeState = { scrollTo?: string } | null

// A home é só a lista de seções, na ordem em que aparecem.
export function Home() {
  const location = useLocation()
  // Como chegamos aqui: 'PUSH' = clique num link/navigate; 'POP' = F5 ou
  // botão voltar do navegador (nesses o navegador restaura a rolagem sozinho).
  const navigationType = useNavigationType()
  // location.state chega como "unknown" (pode ser qualquer coisa),
  // por isso dizemos ao TypeScript que formato esperamos.
  const scrollTo = (location.state as HomeState)?.scrollTo

  // Roda ao montar (e se o pedido mudar): se alguém pediu uma seção, rola até ela.
  // Sem animação: a pessoa deve "aparecer" já nas pastas, não ver a página descer.
  // 'instant' e não 'auto': o html tem scroll-behavior: smooth no CSS, e 'auto'
  // obedeceria o CSS (rolaria suave).
  useEffect(() => {
    if (scrollTo) {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'instant' })
    } else if (navigationType === 'PUSH') {
      // Veio de outra página pelo logo, sem pedir seção: começa do topo.
      // (Trocar de rota não zera a rolagem sozinho.)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [scrollTo, navigationType])

  return (
    // @container: os títulos usam a largura deste bloco para crescer (unidade cqi)
    <div className="@container relative overflow-x-clip">
      <SkipLink />
      <Header />
      {/* tabIndex -1: pode receber foco por código, mas não entra no Tab */}
      <main id="topo" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
