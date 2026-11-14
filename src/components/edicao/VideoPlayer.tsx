import { Play } from 'lucide-react'
import { linkDoVideo, type Video } from '@/data/videos'

// Tamanho do player: ocupa a largura de quem o contém (no desktop, a
// coluna de 315px da linha; no celular, a tela toda). A altura sai da
// proporção 9:16.
const moldura = 'relative block aspect-[9/16] w-full overflow-hidden rounded-[12px] bg-ink'

// Por enquanto é uma CAPA ESTÁTICA que leva ao Instagram.
export function VideoPlayer({ video }: { video: Video }) {
  // TODO(futuro): quando houver o arquivo (video.src), este é o lugar do
  // player de verdade. Falta decidir autoplay ao entrar na tela, mudo,
  // controles próprios etc. Hoje nenhum vídeo tem src, então nunca entra aqui.
  if (video.src) {
    return <video src={video.src} poster={video.poster} controls playsInline preload="none" className={`${moldura} object-cover`} />
  }

  return (
    // Tudo é UM link: não é um botão fingindo tocar vídeo, é um link que
    // abre o Instagram, e o leitor de tela anuncia exatamente isso.
    // "group": os filhos reagem ao hover do link (group-hover:…).
    <a
      href={linkDoVideo(video)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Assistir ${video.titulo} no Instagram (abre em nova aba)`}
      className={`group ${moldura}`}
    >
      {/* sem capa (vídeo 4): fica só o fundo grafite da moldura.
          motion-safe: a escala só existe para quem NÃO pediu menos animação */}
      {video.poster && (
        <img
          src={video.poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-[400ms] motion-safe:group-hover:scale-[1.03]"
        />
      )}

      {/* véu escuro de baixo para cima, para o texto branco ter contraste */}
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/25 to-ink/5" />

      {/* Play + selo, empilhados. O grupo começa 36px ACIMA do centro
          (top 50% e sobe 36px = metade do play), então o play fica
          centrado e o selo logo abaixo, a 14px (gap-3.5). */}
      <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-9 flex-col items-center gap-3.5">
        <span className="grid size-[72px] place-items-center rounded-full bg-white/[.92] text-brand transition-transform duration-[400ms] motion-safe:group-hover:scale-[1.06]">
          <Play size={28} fill="currentColor" aria-hidden="true" className="translate-x-0.5" />
        </span>
        {/* pílula escura: as capas têm legenda no meio e o texto solto sumia nela */}
        <span className="rounded-full bg-ink/82 px-3 py-[7px] text-[13px] font-medium whitespace-nowrap text-white">
          Assistir no Instagram ↗
        </span>
      </span>

      {/* barra de progresso decorativa, igual à do visualizador da home.
          Só no desktop: no celular ela some (hidden md:block). */}
      <span aria-hidden="true" className="absolute inset-x-3.5 bottom-4 hidden h-[3px] rounded-full bg-white/35 md:block">
        <span className="block h-full w-[12%] rounded-full bg-brand" />
      </span>
    </a>
  )
}
