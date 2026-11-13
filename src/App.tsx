import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Work } from '@/components/Work'

// A página inteira é só a lista de seções, na ordem em que aparecem.
export default function App() {
  return (
    // @container: os títulos usam a largura deste bloco para crescer (unidade cqi)
    <div className="@container relative overflow-x-clip">
      {/* atalho de teclado: aparece só ao receber foco com Tab */}
      <a
        href="#topo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-20 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2.5 focus:text-[14px] focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="topo">
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
