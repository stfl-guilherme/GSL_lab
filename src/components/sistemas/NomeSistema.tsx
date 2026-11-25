import type { Sistema } from '@/data/sistemas'

// O nome do sistema no cartão e no modal. Com logo, cada pedaço sai na
// fonte e na cor do logo; o leitor de tela continua lendo o nome inteiro.
export function NomeSistema({ sistema }: { sistema: Sistema }) {
  const { logo } = sistema
  if (!logo) return sistema.nome

  return (
    <span style={{ fontFamily: logo.fonte, fontWeight: logo.peso, letterSpacing: 0 }}>
      {logo.partes.map((parte) => (
        <span key={parte.texto} style={{ color: parte.cor }}>
          {parte.texto}
        </span>
      ))}
    </span>
  )
}
