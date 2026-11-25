import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion } from 'motion/react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from 'react'
import { buscarSistema, sistemas, type Sistema, type Tela } from '@/data/sistemas'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { ABRIR, CURVA, morphIds } from './morph'
import { NomeSistema } from './NomeSistema'

interface ModalSistemaProps {
  atual: string // slug do sistema mostrado agora
  origem: string // slug do cartão que abriu o modal (é para ele que o morph volta)
  reduzido: boolean // "reduzir animações" ligado: só um fade de 0,2 s
  onTrocar: (slug: string) => void
  onFechar: () => void
  devolverFoco: () => void
}

// Uma mídia do modal (miniatura + imagem grande).
type Midia = Required<Tela>

// 1ª mídia = a capa do cartão daquela tela: o print desktop no desktop,
// o de celular no celular. Depois, as extras (no celular, as de celular).
function listarMidias(s: Sistema, desktop: boolean): Midia[] {
  const capa: Midia = desktop
    ? { rotulo: s.rotuloCapa ?? 'Tela inicial', src: s.printDesktop, formato: 'desktop' }
    : { rotulo: s.rotuloCapa ?? 'Celular', src: s.printCelular, formato: 'celular' }
  const lista = desktop ? s.telasExtras : (s.telasCelular ?? s.telasExtras)
  const extras = (lista ?? []).map((t) => ({ formato: 'desktop' as const, ...t }))
  return [capa, ...extras]
}

// O quadro é 16:9 no desktop e 4:5 no celular. Print do mesmo formato
// do quadro preenche (cover, alinhado no topo); do outro formato aparece
// inteiro (contain), em vez de cortado.
const encaixe = (m: Midia, desktop: boolean) =>
  m.formato === (desktop ? 'desktop' : 'celular') ? 'object-cover object-left-top' : 'object-contain'

export function ModalSistema({ atual, origem, reduzido, onTrocar, onFechar, devolverFoco }: ModalSistemaProps) {
  const desktop = useMediaQuery('(min-width: 47.5625rem)')
  // Morph (crescer a partir do cartão) só no desktop: no celular o painel
  // ocupa a tela toda e animar o tamanho dele travava. Lá ele sobe da base.
  const morph = desktop && !reduzido
  const fechar = useRef<HTMLButtonElement>(null)
  const toqueX = useRef<number | null>(null)

  // Miniatura escolhida. Guarda o slug junto: trocou de sistema, a escolha
  // antiga deixa de valer e volta para a 1ª mídia, sem precisar de efeito.
  const [escolha, setEscolha] = useState({ slug: atual, i: 0 })

  const sistema = buscarSistema(atual)
  if (!sistema) return null

  const n = sistemas.length
  const pos = sistemas.indexOf(sistema)
  // circular: o próximo do último é o primeiro (+ n evita índice negativo)
  const vizinho = (passo: number) => sistemas[(pos + passo + n) % n].slug

  const midias = listarMidias(sistema, desktop)
  const ativa = escolha.slug === atual ? Math.min(escolha.i, midias.length - 1) : 0
  const midia = midias[ativa]
  // vídeo só no lugar da 1ª mídia, com o print como capa (poster)
  const video = ativa === 0 ? sistema.video : undefined

  // Peças que viajam do cartão (sempre o de ORIGEM: trocar de sistema
  // dentro do modal não dispara morph, e ao fechar ele volta para lá).
  const ids = morphIds(origem)
  const viaja = (id: string) => (morph ? { layoutId: id, transition: ABRIR } : {})

  // Conteúdo que não viaja: aparece depois que o painel começou a crescer
  // e some primeiro ao fechar.
  const surge = morph
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {}
  // Sem morph quem anima é o painel inteiro: no celular ele sobe 24 px
  // enquanto aparece; com "reduzir animações", só o fade de 0,2 s.
  const entrada = morph
    ? {}
    : reduzido
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 24 },
          transition: { duration: 0.3, ease: CURVA },
        }

  function aoTeclar(e: KeyboardEvent) {
    if (!desktop || n < 2) return
    if (e.key === 'ArrowLeft') onTrocar(vizinho(-1))
    if (e.key === 'ArrowRight') onTrocar(vizinho(1))
  }

  const mostrar = (i: number) => setEscolha({ slug: atual, i })

  // Swipe no celular: arrastou mais de 40 px na horizontal, vai para a
  // imagem seguinte (ou anterior) do MESMO sistema. Para nas pontas.
  function aoSoltar(e: PointerEvent) {
    if (toqueX.current === null) return
    const dx = e.clientX - toqueX.current
    toqueX.current = null
    if (Math.abs(dx) <= 40) return
    const destino = ativa + (dx < 0 ? 1 : -1)
    if (destino >= 0 && destino < midias.length) mostrar(destino)
  }

  const acoes = (
    <>
      {sistema.demoUrl && (
        <BotaoLink href={sistema.demoUrl} principal>
          Abrir demo
        </BotaoLink>
      )}
      <BotaoLink href={sistema.codigoUrl}>Ver código</BotaoLink>
    </>
  )

  const cabecalho = (
    <div className={cn('flex justify-between gap-6', desktop ? 'px-8 pt-7 pb-5' : 'px-5 pt-1 pb-3')}>
      <div className="min-w-0">
        <DialogPrimitive.Title asChild>
          <motion.h2
            {...viaja(ids.nome)}
            className={cn(
              'w-fit leading-[1.15] font-extrabold tracking-[-.01em]',
              desktop ? 'text-[28px]' : 'text-[24px]',
            )}
          >
            <NomeSistema sistema={sistema} />
          </motion.h2>
        </DialogPrimitive.Title>
        <motion.div {...surge}>
          <DialogPrimitive.Description className="mt-1.5 text-[15px] text-mute">
            {sistema.resumo}
          </DialogPrimitive.Description>
        </motion.div>
      </div>

      {desktop && (
        <motion.div {...surge} className="flex shrink-0 items-center gap-2">
          <span className="mr-2 text-[13px] font-extrabold text-mute tabular-nums">
            {pos + 1} de {n}
          </span>
          {n > 1 && (
            <>
              <BotaoIcone label="Sistema anterior" onClick={() => onTrocar(vizinho(-1))}>
                <ChevronLeft />
              </BotaoIcone>
              <BotaoIcone label="Próximo sistema" onClick={() => onTrocar(vizinho(1))}>
                <ChevronRight />
              </BotaoIcone>
            </>
          )}
          <DialogPrimitive.Close asChild>
            <BotaoIcone ref={fechar} label="Fechar">
              <X />
            </BotaoIcone>
          </DialogPrimitive.Close>
        </motion.div>
      )}
    </div>
  )

  return (
    // Radix: prende o foco aqui dentro, fecha com Esc e com clique fora,
    // trava a rolagem da página. Sempre "open": quem tira o modal da tela
    // é a grade (com a animação de saída do AnimatePresence).
    <DialogPrimitive.Root open onOpenChange={(aberto) => !aberto && onFechar()}>
      <DialogPrimitive.Portal>
        {/* layoutRoot: o modal é position: fixed; sem isso o motion erraria
            a conta do morph quando a página está rolada. */}
        <DialogPrimitive.Overlay asChild>
          <motion.div layoutRoot className="fixed inset-0 z-60 grid place-items-center md:p-8">
            {/* fundo: vidro claro, não escurece a página */}
            <motion.div
              aria-hidden="true"
              // no celular o painel é opaco e cobre tudo: desfocar atrás só pesaria
              className="absolute inset-0 bg-white/30 md:backdrop-blur-[8px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: morph ? 0.5 : 0.2 } }}
              transition={{ duration: morph ? 0.6 : reduzido ? 0.2 : 0.3 }}
            />

            <DialogPrimitive.Content
              asChild
              onKeyDown={aoTeclar}
              // ao abrir, o foco vai para o X (no celular o X é o 1º botão)
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                fechar.current?.focus()
              }}
              // ao fechar, volta para o cartão de origem
              onCloseAutoFocus={(e) => {
                e.preventDefault()
                devolverFoco()
              }}
            >
              <motion.div
                {...viaja(ids.painel)}
                {...entrada}
                className={cn(
                  'relative outline-none',
                  desktop
                    ? 'max-h-[90vh] w-[min(1320px,94vw)] overflow-auto overscroll-contain border border-white/70 bg-white/86 shadow-[0_24px_60px_rgb(43_43_46/.08)] backdrop-blur-[24px]'
                    : 'flex h-dvh w-full flex-col bg-white', // h-dvh: a altura da tela visível (sem a barra do navegador)
                )}
                style={{ borderRadius: desktop ? 24 : 0 }}
              >
                {!desktop && (
                  <DialogPrimitive.Close asChild>
                    <BotaoIcone
                      ref={fechar}
                      label="Fechar"
                      className="absolute top-3 right-3 z-10 border-white shadow-[0_4px_14px_rgb(43_43_46/.18)]"
                    >
                      <X />
                    </BotaoIcone>
                  </DialogPrimitive.Close>
                )}

                <div className={cn(!desktop && 'min-h-0 flex-1 overflow-auto overscroll-contain')}>
                  {desktop && cabecalho}

                  <div
                    className={cn(
                      desktop && 'grid grid-cols-[minmax(0,65fr)_minmax(0,35fr)] items-start gap-10 px-8 pb-8',
                    )}
                  >
                    {/* ---------- Coluna da mídia ---------- */}
                    <div>
                      <motion.div
                        {...viaja(ids.midia)}
                        className={cn(
                          'relative overflow-hidden bg-off',
                          desktop ? 'aspect-video' : 'aspect-[4/5] touch-pan-y',
                        )}
                        style={{ borderRadius: desktop ? 16 : 0 }}
                        onPointerDown={desktop ? undefined : (e) => (toqueX.current = e.clientX)}
                        onPointerUp={desktop ? undefined : aoSoltar}
                        onPointerCancel={() => (toqueX.current = null)}
                      >
                        {video ? (
                          <video
                            key={video}
                            src={video}
                            poster={midia.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            aria-label={`${sistema.nome}: vídeo da ${midia.rotulo.toLowerCase()}`}
                            className={cn('size-full', encaixe(midia, desktop))}
                          />
                        ) : (
                          <img
                            src={midia.src}
                            alt={`${sistema.nome}: ${midia.rotulo}`}
                            className={cn('size-full', encaixe(midia, desktop))}
                          />
                        )}
                        {video && (
                          <motion.span
                            {...surge}
                            className="absolute top-3.5 left-3.5 rounded-full bg-ink/90 px-[11px] py-[7px] text-[12px] font-extrabold text-white"
                          >
                            ▶ Vídeo · em loop, sem som
                          </motion.span>
                        )}
                      </motion.div>

                      {/* celular: um ponto por IMAGEM (não por sistema; lá não se
                          troca de sistema dentro do modal) */}
                      {!desktop && midias.length > 1 && (
                        <div className="flex justify-center">
                          {midias.map((m, i) => (
                            <button
                              key={m.src}
                              type="button"
                              aria-label={`Ver imagem ${i + 1}: ${m.rotulo}`}
                              aria-current={i === ativa || undefined}
                              onClick={() => mostrar(i)}
                              className="grid size-11 cursor-pointer place-items-center"
                            >
                              <span
                                className={cn(
                                  'h-2 rounded-full transition-[width,background-color] duration-300',
                                  i === ativa ? 'w-[22px] bg-ink' : 'w-2 bg-rabisco',
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {!desktop && cabecalho}

                      <motion.div
                        {...surge}
                        className={cn('grid grid-cols-3 gap-3', desktop ? 'mt-3.5' : 'mt-1 px-5')}
                      >
                        {midias.map((m, i) => (
                          <button
                            key={m.src}
                            type="button"
                            aria-pressed={i === ativa}
                            onClick={() => mostrar(i)}
                            className={cn(
                              'relative aspect-video cursor-pointer overflow-hidden rounded-[10px] border border-line bg-off',
                              i === ativa && 'outline-2 outline-offset-2 outline-ink',
                            )}
                          >
                            <img src={m.src} alt="" className={cn('size-full', encaixe(m, true))} />
                            <span className="absolute bottom-1.5 left-1.5 rounded-[6px] bg-white px-[7px] py-[3px] text-[11px] font-extrabold">
                              {m.rotulo}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    </div>

                    {/* ---------- Coluna do texto ---------- */}
                    <motion.div
                      {...surge}
                      className={cn('flex flex-col gap-[22px]', !desktop && 'mt-7 px-5 pb-7')}
                    >
                      <Bloco titulo="O problema">
                        <p className="text-[15px] leading-[1.55]">{sistema.problema}</p>
                      </Bloco>
                      <Bloco titulo="O que faz">
                        <ul className="flex flex-col gap-2">
                          {sistema.oQueFaz.map((item) => (
                            <li
                              key={item}
                              className="relative pl-4 text-[15px] leading-[1.45] before:absolute before:top-[.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-rabisco"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Bloco>
                      <Bloco titulo="Stack">
                        <ul className="flex flex-wrap gap-1.5">
                          {sistema.stack.map((tec) => (
                            <li
                              key={tec}
                              className="rounded-full border border-line bg-off px-[11px] py-[7px] text-[12px] font-extrabold"
                            >
                              {tec}
                            </li>
                          ))}
                        </ul>
                      </Bloco>
                      <Bloco titulo="Meu papel">
                        <p className="text-[15px] leading-[1.55]">{sistema.meuPapel}</p>
                      </Bloco>

                      {desktop && (
                        <div className="flex flex-wrap gap-2.5">
                          {acoes}
                          {sistema.demoUrl && sistema.demoNota && (
                            <p className="w-full text-[13px] text-mute">{sistema.demoNota}</p>
                          )}
                        </div>
                      )}
                      {!desktop && sistema.demoUrl && sistema.demoNota && (
                        <p className="text-[13px] text-mute">{sistema.demoNota}</p>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* rodapé fixo do celular: os botões sempre à mão */}
                {!desktop && (
                  <motion.div
                    {...surge}
                    className="flex gap-2.5 border-t border-line px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] *:flex-1"
                  >
                    {acoes}
                  </motion.div>
                )}
              </motion.div>
            </DialogPrimitive.Content>
          </motion.div>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// ---------- Pecinhas do modal ----------

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-extrabold tracking-[.2em] text-brand uppercase">{titulo}</h3>
      {children}
    </div>
  )
}

interface BotaoIconeProps {
  ref?: Ref<HTMLButtonElement>
  label: string
  onClick?: () => void
  className?: string
  children: ReactNode
}

// "...resto": o DialogPrimitive.Close (asChild) passa props próprias
// (o onClick que fecha, data-state…) e elas precisam chegar no <button>.
function BotaoIcone({ ref, label, className, children, ...resto }: BotaoIconeProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(
        'grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink [&_svg]:size-5',
        className,
      )}
      {...resto}
    >
      {children}
    </button>
  )
}

function BotaoLink({ href, principal, children }: { href: string; principal?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border-[1.5px] px-5 text-[15px] font-extrabold',
        principal ? 'border-brand bg-brand text-white' : 'border-ink bg-white text-ink',
      )}
    >
      {children}
      <ArrowUpRight className="size-4" aria-hidden="true" />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  )
}
