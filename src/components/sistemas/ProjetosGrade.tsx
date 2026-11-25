import { AnimatePresence, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { Eyebrow } from '@/components/Eyebrow'
import { Reveal } from '@/components/Reveal'
import { sistemas } from '@/data/sistemas'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { CartaoSistema } from './CartaoSistema'
import { ModalSistema } from './ModalSistema'

export const ID_PROJETOS = 'projetos'
export const ID_GRADE = 'projetos-grade' // a barra do celular rola até aqui

// Qual sistema está aberto, guardado pelo SLUG (não pela posição): um
// link direto (/#/sistemas/ja-na-caixa) só vai precisar preencher isto.
//   origem = cartão clicado (o morph volta para ele)
//   atual  = sistema na tela (muda com as setas e o swipe)
type Aberto = { origem: string; atual: string } | null

export function ProjetosGrade() {
  const [aberto, setAberto] = useState<Aberto>(null)

  // "Reduzir animações" ligado: sem morph e sem inclinação.
  const reduzido = useReducedMotion() ?? false
  const desktop = useMediaQuery('(min-width: 47.5625rem)')
  const comMouse = useMediaQuery('(hover: hover)')

  // Botões dos cartões, por slug: ao fechar o modal o foco volta para o de origem.
  const botoes = useRef(new Map<string, HTMLButtonElement>())

  return (
    <section id={ID_PROJETOS} aria-labelledby="projetos-titulo" className="py-24 md:py-40">
      <div className="wrap">
        <Reveal>
          <Eyebrow>Projetos</Eyebrow>
          <h2 id="projetos-titulo" className="text-title">
            Do banco à tela.
          </h2>
        </Reveal>

        <ul
          id={ID_GRADE}
          className={cn('mt-8 grid gap-5 md:mt-14 md:gap-8', sistemas.length > 1 && 'md:grid-cols-2')}
        >
          {sistemas.map((sistema) => (
            <li key={sistema.slug}>
              <CartaoSistema
                ref={(el) => {
                  if (el) botoes.current.set(sistema.slug, el)
                  else botoes.current.delete(sistema.slug)
                }}
                sistema={sistema}
                escondido={aberto?.origem === sistema.slug}
                morph={desktop && !reduzido} // no celular o modal não cresce do cartão
                inclina={desktop && comMouse && !reduzido}
                onAbrir={() => setAberto({ origem: sistema.slug, atual: sistema.slug })}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* AnimatePresence segura o modal na tela até a animação de saída acabar */}
      <AnimatePresence>
        {aberto && (
          <ModalSistema
            key="modal"
            atual={aberto.atual}
            origem={aberto.origem}
            reduzido={reduzido}
            onTrocar={(slug) => setAberto({ ...aberto, atual: slug })}
            onFechar={() => setAberto(null)}
            devolverFoco={() => botoes.current.get(aberto.origem)?.focus()}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
