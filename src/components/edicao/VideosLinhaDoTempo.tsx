import type { RefObject } from 'react'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { ID_VIDEOS, videos } from '@/data/videos'
import { BarraClipes, WRAP_VIDEOS } from './BarraClipes'
import { VideoLinha } from './VideoLinha'

interface VideosLinhaDoTempoProps {
  artigos: RefObject<(HTMLElement | null)[]>
  cur: number
  progress: number
}

// A seção dos vídeos: título, barra fixa (desktop) e as 4 linhas.
// O cur/progress vêm da página (useActiveVideo), não são calculados aqui.
export function VideosLinhaDoTempo({ artigos, cur, progress }: VideosLinhaDoTempoProps) {
  return (
    <section id={ID_VIDEOS} aria-labelledby="videos-titulo" className="pt-24 md:pt-[200px]">
      <Reveal className={`${WRAP_VIDEOS} mb-14 md:mb-24`}>
        <Eyebrow>Os cortes</Eyebrow>
        <h2 id="videos-titulo" className="text-title">
          Na linha do tempo.
        </h2>
      </Reveal>

      {/* A barra precisa ser filha DIRETA da seção (e não de um bloco
          menor): o sticky só gruda enquanto o pai dela está na tela. */}
      <BarraClipes artigos={artigos} cur={cur} progress={progress} />

      <div className={`${WRAP_VIDEOS} flex flex-col gap-36 pt-2 md:gap-[280px] md:pt-[200px]`}>
        {videos.map((video, i) => (
          <VideoLinha
            key={video.id}
            video={video}
            indice={i}
            ativo={i === Math.max(0, cur)}
            // "ref de função": o React chama com o elemento ao montar
            // (e com null ao desmontar); guardamos na posição i da lista.
            artigoRef={(el) => {
              artigos.current[i] = el
            }}
          />
        ))}
      </div>
    </section>
  )
}
