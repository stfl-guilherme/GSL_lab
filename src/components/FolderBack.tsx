import designBack from '@/assets/design-3.jpg'
import rabisco from '@/assets/hero-rabisco-lab.png'
import type { FolderId } from '@/data/portfolio'

const film =
  'absolute inset-x-[-2%] h-[5%] bg-[repeating-linear-gradient(90deg,rgb(220_219_216/.55)_0_14px,transparent_14px_28px)]'

// Arte do painel traseiro de cada pasta, com as cores da marca.
export function FolderBack({ id }: { id: FolderId }) {
  if (id === 'sites') {
    return (
      <div className="folder-back bg-brand">
        <img src={rabisco} alt="" className="absolute top-[-26%] left-[-12%] w-[124%] max-w-none opacity-55" />
      </div>
    )
  }

  if (id === 'design') {
    return (
      <div className="folder-back">
        <img src={designBack} alt="" className="absolute inset-0 size-full object-cover object-[50%_18%]" />
      </div>
    )
  }

  // vídeo: grafite com "furos" de filme e um REC
  return (
    <div className="folder-back bg-ink">
      <span className={`${film} top-[3%]`} />
      <span className={`${film} top-[20%]`} />
      <span className="absolute top-[9.5%] right-[7%] flex items-center gap-1.5 text-[10px] tracking-[.2em] text-rabisco">
        <span className="size-2 rounded-full bg-brand" />
        REC
      </span>
    </div>
  )
}
