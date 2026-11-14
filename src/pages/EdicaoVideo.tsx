import { useEffect, useRef } from 'react'
import { Contact } from '@/components/Contact'
import { BackButton } from '@/components/edicao/BackButton'
import { EdicaoNav } from '@/components/edicao/EdicaoNav'
import { HeroTimeline } from '@/components/edicao/HeroTimeline'
import { VideosLinhaDoTempo } from '@/components/edicao/VideosLinhaDoTempo'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SkipLink } from '@/components/SkipLink'
import { useActiveVideo } from '@/hooks/useActiveVideo'

// Página /#/edicao-de-video. Cabeçalho, Contato e Rodapé são os MESMOS
// componentes da home; só o miolo (hero + linha do tempo dos vídeos) é próprio daqui.
export function EdicaoVideo() {
  // Trocar de rota não zera a rolagem: quem vem do meio da home chegaria
  // aqui no meio da página. [] = roda uma vez, ao montar.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' }) // 'instant': ignora o smooth do CSS
  }, [])

  // Lista com os 4 <article> dos vídeos (preenchida pelos refs de função
  // lá no VideosLinhaDoTempo). O hook mede esses elementos na rolagem.
  // Fica AQUI, na página, porque dois componentes precisam do resultado:
  // a seção dos vídeos (agulha, clipes, cinza) e a EdicaoNav do celular.
  const artigos = useRef<(HTMLElement | null)[]>([])
  const { cur, progress } = useActiveVideo(artigos)

  return (
    // pb no celular: espaço para a barra fixa não cobrir o rodapé
    // (64px da barra + 16px de distância + folga + área segura do aparelho).
    <div className="@container relative overflow-x-clip pb-[calc(96px+env(safe-area-inset-bottom))] md:pb-0">
      <SkipLink />
      <Header variant="pagina" />
      <main id="topo" tabIndex={-1} className="outline-none">
        <HeroTimeline />
        <VideosLinhaDoTempo artigos={artigos} cur={cur} progress={progress} />
        <Contact variant="pagina" />
      </main>
      <Footer />

      <EdicaoNav cur={cur} />
      <BackButton />
    </div>
  )
}
