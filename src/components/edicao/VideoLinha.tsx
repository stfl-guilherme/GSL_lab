import type { Ref } from 'react'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { formatarVisualizacoes, idDoVideo, type Video } from '@/data/videos'
import { cn } from '@/lib/utils'
import { VideoPlayer } from './VideoPlayer'

interface VideoLinhaProps {
  video: Video
  indice: number // posição na lista, começando em 0
  ativo: boolean // é o vídeo em foco? Os outros ficam em cinza
  artigoRef: Ref<HTMLElement> // o useActiveVideo mede este <article>
}

// Um vídeo da linha do tempo: player de um lado, texto do outro.
// Celular: uma coluna, sempre o player primeiro.
export function VideoLinha({ video, indice, ativo, artigoRef }: VideoLinhaProps) {
  const id = idDoVideo(indice) // "video-1": o "Próximo vídeo" do celular rola até aqui
  const numero = String(indice + 1).padStart(2, '0') // "01"
  const invertido = indice % 2 === 1 // vídeos 2 e 4: player à direita (só desktop)

  // Ficha: junta só o que existir. ['0:42', undefined] → "0:42";
  // ['0:42', 'corte'] → "0:42 · corte"; nada → "" (e a linha não aparece).
  const ficha = [video.duracao, video.feito].filter(Boolean).join(' · ')

  return (
    // O ref fica no <article>, que NÃO se mexe. O <Reveal> de dentro é que
    // sobe 28px ao aparecer; se o ref estivesse nele, a medição do hook e a
    // rolagem dos clipes sairiam 28px erradas antes da animação.
    <article id={id} ref={artigoRef} aria-labelledby={`${id}-titulo`}>
      <Reveal
        className={cn(
          'grid items-center gap-7 md:gap-[88px]',
          invertido ? 'md:grid-cols-[minmax(0,1fr)_auto]' : 'md:grid-cols-[auto_minmax(0,1fr)]',
        )}
      >
        {/* Fora de foco: cinza e meio transparente, SÓ no player */}
        <div
          className={cn(
            'transition-[filter,opacity] duration-500 md:w-[315px]',
            !ativo && 'opacity-55 grayscale',
            invertido && 'md:order-2', // order-2 = vai para depois do texto
          )}
        >
          <VideoPlayer video={video} />
        </div>

        <div className="flex flex-col items-start gap-6 px-1 md:gap-5 md:px-0">
          <div>
            <Eyebrow className="mb-2">Vídeo {numero}</Eyebrow>
            <h3
              id={`${id}-titulo`}
              className="text-[clamp(26px,2.6vw,36px)] leading-[1.1] font-extrabold tracking-[-.02em]"
            >
              {video.titulo}
            </h3>
          </div>

          <div>
            <p className="text-[clamp(48px,5.6vw,84px)] leading-[.95] font-extrabold tracking-[-.035em]">
              {formatarVisualizacoes(video.visualizacoes)}
            </p>
            <p className="mt-3 text-[16px] text-mute">visualizações</p>
          </div>

          <p className="max-w-[480px] text-[18px] leading-[1.6]">{video.descricao}</p>

          {ficha && <p className="text-[14px] text-mute">{ficha}</p>}
        </div>
      </Reveal>
    </article>
  )
}
