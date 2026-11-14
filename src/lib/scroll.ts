// O sistema está com "reduzir animações" ligado?
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Rola a página até a seção com esse id.
//
// Por que não usar href="#sobre"? Com o HashRouter, tudo depois do "#" na
// URL é a ROTA. "#sobre" viraria a rota "/sobre", que não existe.
// Então rolamos "na mão" com scrollIntoView.
export function scrollToSection(id: string) {
  // Quem pediu "reduzir animações" no sistema recebe um salto instantâneo.
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

// Rola até um elemento, parando "folga" px ABAIXO do topo da janela.
// Usado quando há uma barra fixa em cima que cobriria o começo do elemento.
// getBoundingClientRect().top = distância do elemento ao topo da JANELA;
// somando window.scrollY vira a distância ao topo da PÁGINA.
export function scrollToElement(el: HTMLElement, folga = 0) {
  const top = el.getBoundingClientRect().top + window.scrollY - folga
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
}
