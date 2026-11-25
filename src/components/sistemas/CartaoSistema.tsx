import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { useRef, type MouseEvent, type Ref } from 'react'
import type { Sistema } from '@/data/sistemas'
import { FECHAR, morphIds } from './morph'

interface CartaoSistemaProps {
  ref?: Ref<HTMLButtonElement> // a grade guarda para devolver o foco ao fechar o modal
  sistema: Sistema
  escondido: boolean // é o cartão de origem do modal aberto
  morph: boolean // false com "reduzir animações": sem morph
  inclina: boolean // inclinação 3D: só desktop com mouse e sem "reduzir animações"
  onAbrir: () => void
}

const limitar = (n: number) => Math.max(-6, Math.min(6, n))

export function CartaoSistema({ ref, sistema, escondido, morph, inclina, onAbrir }: CartaoSistemaProps) {
  const ids = morphIds(sistema.slug)

  // ---------- Inclinação 3D ----------
  // Mexe direto no style do elemento (sem estado): o mouse dispara dezenas
  // de eventos por segundo e não precisamos redesenhar o React a cada um.
  const inclinacao = useRef<HTMLSpanElement>(null)
  const raf = useRef(0)

  function aoMover(e: MouseEvent<HTMLButtonElement>) {
    if (!inclina) return
    const caixa = e.currentTarget.getBoundingClientRect()
    // posição do mouse no cartão, de -0,5 (borda esquerda/topo) a 0,5
    const mx = (e.clientX - caixa.left) / caixa.width - 0.5
    const my = (e.clientY - caixa.top) / caixa.height - 0.5
    cancelAnimationFrame(raf.current) // um desenho por quadro, no máximo
    raf.current = requestAnimationFrame(() => {
      const el = inclinacao.current
      if (!el) return
      el.style.transition = 'transform .12s linear'
      el.style.transform = `perspective(900px) rotateX(${limitar(-my * 12)}deg) rotateY(${limitar(mx * 12)}deg)`
    })
  }

  // instantaneo: sem os .5s de volta (o morph mede o cartão na hora do clique)
  function endireitar(instantaneo = false) {
    cancelAnimationFrame(raf.current)
    const el = inclinacao.current
    if (!el) return
    el.style.transition = instantaneo ? 'none' : '' // '' = volta para a transição da classe
    el.style.transform = ''
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-haspopup="dialog"
      onClick={() => {
        endireitar(true) // o morph parte do cartão reto
        onAbrir()
      }}
      onMouseMove={aoMover}
      onMouseLeave={() => endireitar()}
      className="group relative block aspect-[4/5] w-full cursor-pointer rounded-[24px] text-left focus-visible:outline-3 focus-visible:outline-offset-4 md:aspect-[16/10]"
      // aberto no modal: o cartão vira um "buraco" do mesmo tamanho
      style={{ visibility: escondido ? 'hidden' : undefined }}
    >
      <span
        ref={inclinacao}
        className="block size-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] [transform:perspective(900px)_rotateX(0)_rotateY(0)]"
      >
        {/* Enquanto o modal está aberto as peças moram LÁ (mesmo layoutId):
            aqui elas não são desenhadas. Ao fechar, voltam a ser, e o
            motion anima a volta do modal para cá. */}
        {!escondido && (
          <motion.span
            layoutId={morph ? ids.painel : undefined}
            transition={FECHAR}
            className="absolute inset-0 block overflow-hidden bg-off shadow-[0_8px_24px_rgb(43_43_46/.08)]"
            style={{ borderRadius: 24 }}
          >
            <motion.span
              layoutId={morph ? ids.midia : undefined}
              transition={FECHAR}
              className="absolute inset-0 block overflow-hidden"
              style={{ borderRadius: 24 }}
            >
              {/* <picture>: o navegador escolhe o print pela largura da tela */}
              <picture>
                <source media="(min-width: 47.5625rem)" srcSet={sistema.printDesktop} />
                <img
                  src={sistema.printCelular}
                  alt=""
                  className="size-full origin-top-left object-cover object-left-top md:transition-[filter,scale] md:duration-500 md:motion-safe:scale-105 md:motion-safe:blur-[3px] md:group-hover:scale-100 md:group-hover:blur-none md:group-focus-visible:scale-100 md:group-focus-visible:blur-none"
                />
              </picture>
            </motion.span>

            <span
              aria-hidden="true"
              className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/94 text-ink transition-[rotate] duration-400 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-45 group-focus-visible:rotate-45"
            >
              <Plus className="size-5" strokeWidth={2} />
            </span>

            {/* Faixa de vidro. Dentro de <button> só cabe texto "em linha"
                (nada de h3, p ou ul), por isso tudo aqui é <span>. */}
            <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 border-t border-white/60 bg-white/72 px-[18px] pt-4 pb-[18px] backdrop-blur-[16px] md:px-6 md:pt-[18px] md:pb-5">
              <motion.span
                layoutId={morph ? ids.nome : undefined}
                transition={FECHAR}
                className="block text-[22px] leading-[1.15] font-extrabold tracking-[-.01em] text-ink"
              >
                {sistema.nome}
              </motion.span>
              <span className="block text-[15px] leading-[1.45] text-ink">{sistema.resumo}</span>
              <span className="mt-1 flex flex-wrap gap-1.5">
                {sistema.stack.map((tec) => (
                  <span key={tec} className="rounded-full bg-off px-2.5 py-1.5 text-[12px] font-extrabold text-ink">
                    {tec}
                  </span>
                ))}
              </span>
            </span>
          </motion.span>
        )}
      </span>
    </button>
  )
}
