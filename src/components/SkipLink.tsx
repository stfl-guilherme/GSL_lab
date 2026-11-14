import type { MouseEvent } from 'react'
import { scrollToSection } from '@/lib/scroll'

// Atalho de teclado "Pular para o conteúdo": fica invisível e aparece só ao
// receber foco com Tab. Além de rolar, leva o FOCO para o <main id="topo">,
// para o próximo Tab continuar dali (é para isso que esse link existe).
// A página que usar precisa ter <main id="topo" tabIndex={-1}>.
export function SkipLink() {
  function skipToContent(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault() // sem isso o "#topo" viraria rota no HashRouter
    scrollToSection('topo')
    document.getElementById('topo')?.focus({ preventScroll: true })
  }

  return (
    <a
      href="#topo"
      onClick={skipToContent}
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-20 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2.5 focus:text-[14px] focus:text-white"
    >
      Pular para o conteúdo
    </a>
  )
}
