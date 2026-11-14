import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { folders, type FolderId, type PortfolioItem } from '@/data/portfolio'
import { useInView } from '@/hooks/useInView'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Eyebrow } from './Eyebrow'
import { Folder } from './Folder'
import { Icon } from './Icon'
import { Lightbox } from './Lightbox'
import { Reveal } from './Reveal'

// "O que eu faço". Este componente é o DONO do estado:
//   openId   → qual pasta está aberta (só uma por vez)
//   viewing  → qual arquivo está no visualizador
// As pastas só recebem o estado por props e avisam quando são clicadas.
// Isso se chama "levantar o estado" (lifting state up) e é o que garante
// que abrir uma pasta feche a outra.
export function Work() {
  const [openId, setOpenId] = useState<FolderId | null>(null)
  const [viewing, setViewing] = useState<PortfolioItem | null>(null)
  const { ref: gridRef, inView } = useInView<HTMLDivElement>()
  const canHover = useMediaQuery('(hover: hover)') // true só com mouse
  const navigate = useNavigate()

  // Um elemento <div class="folder"> por pasta. É um ref (e não estado)
  // porque só precisamos LER esses elementos dentro do listener; guardar
  // num ref não redesenha a tela.
  const folderEls = useRef<(HTMLDivElement | null)[]>([])

  // Clique no botão de uma pasta:
  //   fechada                → abre (e fecha a outra, porque openId é um só)
  //   aberta + Edição vídeo  → vai para a página de Edição
  //   aberta + outras        → fecha
  function handleActivate(id: FolderId) {
    if (openId !== id) setOpenId(id)
    else if (id === 'video') navigate('/edicao-de-video')
    else setOpenId(null)
  }

  // Clique fora e Esc. Os listeners ficam no document (pegam a página
  // toda) e só existem ENQUANTO há pasta aberta: com tudo fechado, o
  // efeito sai cedo e não registra nada.
  //
  // O efeito roda de novo quando openId ou viewing mudam. Antes disso o
  // React chama o "return" (cleanup), que tira os listeners antigos.
  // Sem o cleanup, cada abertura somaria mais um listener.
  useEffect(() => {
    if (openId === null) return

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Element
      // Visualizador aberto: o fundo dele cobre a tela inteira, então
      // qualquer toque agora é "dentro do visualizador" (inclusive o toque
      // no fundo que o fecha). Esse toque não pode fechar a pasta.
      // O closest() é o reforço: mesmo que o Radix feche o visualizador
      // antes deste listener rodar (e viewing já seja null), o alvo
      // continua sendo o fundo dele (data-slot="dialog-overlay").
      if (viewing || target.closest('[data-slot="dialog-overlay"]')) return
      // dentro de alguma pasta? (inclui as miniaturas, que são filhas dela)
      // então quem decide é o onClick dela, não este listener.
      if (folderEls.current.some((el) => el?.contains(target))) return
      setOpenId(null)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      // Com o visualizador aberto, o Esc é dele: o Radix o fecha e marca o
      // evento com preventDefault() ("já tratei"). Checar só o viewing não
      // basta: o Radix escuta ANTES (fase de captura), o React redesenha no
      // meio do caminho e este listener já chega aqui com viewing = null.
      if (viewing || e.defaultPrevented) return
      setOpenId(null) // o Folder devolve o foco ao botão dele (ver Folder.tsx)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openId, viewing])

  return (
    <section id="trabalhos" aria-labelledby="trabalhos-titulo" className="pt-10 pb-24 md:pb-40">
      <div className="wrap">
        <Reveal className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <div>
            <Eyebrow>O que eu faço</Eyebrow>
            <h2 id="trabalhos-titulo" className="text-title">
              Abra uma pasta.
            </h2>
          </div>
          <p className="flex items-center gap-2.5 text-[15px] text-mute">
            <Icon name="hand" size={18} />
            {canHover ? 'Clique numa pasta para abrir.' : 'Toque numa pasta para abrir.'}
          </p>
        </Reveal>

        {/* celular: uma coluna (Sistemas primeiro); desktop: três iguais lado a lado */}
        <div ref={gridRef} className="mt-10 grid gap-11 md:mt-16 md:grid-cols-3 md:gap-7">
          {folders.map((folder, i) => (
            <Folder
              key={folder.id}
              // "ref callback": o React chama esta função com o elemento ao
              // montar (e com null ao desmontar). No React 19, ref é uma
              // prop comum, sem precisar de forwardRef.
              ref={(el) => {
                folderEls.current[i] = el
              }}
              folder={folder}
              index={i}
              isOpen={openId === folder.id}
              assembled={inView}
              canHover={canHover}
              onActivate={() => handleActivate(folder.id)}
              onOpenItem={setViewing}
            />
          ))}
        </div>
      </div>

      {/* só existe na página enquanto há um arquivo escolhido */}
      {viewing && <Lightbox item={viewing} onClose={() => setViewing(null)} />}
    </section>
  )
}
