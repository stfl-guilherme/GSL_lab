import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { PortfolioItem } from '@/data/portfolio'
import { Icon } from './Icon'
import { LightboxMedia } from './LightboxMedia'

interface LightboxProps {
  item: PortfolioItem
  onClose: () => void
}

// Visualizador que abre ao clicar num arquivo. Usa o Dialog do shadcn/ui
// (Radix), que já resolve a parte difícil de acessibilidade: Esc fecha,
// clicar fora fecha, o foco fica preso aqui dentro e a página de trás não rola.
export function Lightbox({ item, onClose }: LightboxProps) {
  // Guarda quem estava com o foco quando o visualizador abriu (o arquivo
  // clicado). A função dentro do useState roda uma vez só, na montagem.
  const [opener] = useState(() => document.activeElement)

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        overlayClassName="lightbox-bg cursor-zoom-out"
        // ao fechar, o foco volta para o arquivo: quem usa teclado não se perde
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          if (opener instanceof HTMLElement) opener.focus()
        }}
        className="lightbox-card max-w-[min(92vw,880px)] cursor-auto rounded-[18px] bg-white p-3 shadow-[0_30px_80px_rgb(43_43_46/.22)]"
      >
        <LightboxMedia item={item} />

        <div className="flex items-baseline justify-between gap-6 px-1.5 pt-3.5 pb-1">
          <DialogTitle className="text-[15px]">{item.name}</DialogTitle>
          <DialogDescription className="text-[13px] text-mute">{item.detail}</DialogDescription>
        </div>

        <DialogClose
          aria-label="Fechar"
          className="absolute -top-4 -right-4 grid size-11 cursor-pointer place-items-center rounded-full bg-ink text-white"
        >
          <Icon name="close" size={18} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
