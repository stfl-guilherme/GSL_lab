// Peças que "viajam" do cartão para o modal (e de volta). O motion liga
// dois elementos que têm o MESMO layoutId: quando um some e o outro
// aparece, ele anima o novo saindo da posição e do tamanho do antigo.
export const morphIds = (slug: string) => ({
  painel: `sistema-painel-${slug}`,
  midia: `sistema-midia-${slug}`,
  nome: `sistema-nome-${slug}`,
})

// Curva padrão da referência (docs/design/referencia-sistemas-grade-modal.md)
export const CURVA = [0.22, 1, 0.36, 1] as const

export const ABRIR = { duration: 0.6, ease: CURVA } // peças do modal
export const FECHAR = { duration: 0.5, ease: CURVA } // peças do cartão (voltando)
