import { useState } from 'react'
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

        {/* celular: uma coluna (Sites primeiro); desktop: três iguais lado a lado */}
        <div ref={gridRef} className="mt-10 grid gap-11 md:mt-16 md:grid-cols-3 md:gap-7">
          {folders.map((folder, i) => (
            <Folder
              key={folder.id}
              folder={folder}
              index={i}
              isOpen={openId === folder.id}
              assembled={inView}
              canHover={canHover}
              onToggle={() => setOpenId((current) => (current === folder.id ? null : folder.id))}
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
