import { useEffect, useState } from 'react'
import { Eyebrow } from '@/components/Eyebrow'
import { prefersReducedMotion } from '@/lib/scroll'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------
// Hero da página Sistemas: um "editor" digita um componente React e a
// "Prévia" ao lado mostra o título aparecendo junto.
// Referência: docs/design/referencia-sistemas-hero.md
// ---------------------------------------------------------------

const FRASE = 'Sistemas web do banco de dados à interface, pensados para funcionar bem no celular.'

// O código é uma lista de LINHAS; cada linha, uma lista de TRECHOS
// [tipo, texto]. O tipo decide a cor (ver COR logo abaixo).
type Tipo = 'kw' | 'fn' | 'pun' | 'txt' | 'dest'
type Trecho = [Tipo, string] // "tupla": array de tamanho fixo, cada posição com seu tipo

const LINHAS: Trecho[][] = [
  [['kw', 'export'], ['txt', ' '], ['kw', 'function'], ['txt', ' '], ['fn', 'Hero'], ['pun', '() {']],
  [['txt', '  '], ['kw', 'return'], ['txt', ' '], ['pun', '(']],
  [['txt', '    '], ['pun', '<h1>']],
  [['txt', '      Desenvolvimento de'], ['pun', '{" "}']],
  [['txt', '      '], ['pun', '<em>'], ['dest', 'sistemas.'], ['pun', '</em>']],
  [['txt', '    '], ['pun', '</h1>']],
  [['txt', '  '], ['pun', ');']],
  [['pun', '}']],
]

// Record<Tipo, string>: um objeto com UMA chave para cada Tipo. Se faltar
// alguma, o TypeScript reclama.
const COR: Record<Tipo, string> = {
  kw: 'font-medium text-brand',
  fn: 'font-medium text-ink',
  pun: 'text-mute',
  txt: 'text-ink',
  dest: 'text-brand',
}

// ---------- Contas feitas uma vez só (fora do componente) ----------
// O código inteiro numa string só; cada quebra de linha conta 1 caractere.
const CODIGO = LINHAS.map((linha) => linha.map(([, texto]) => texto).join('')).join('\n')
const TOTAL = CODIGO.length

// Em que posição de CODIGO começa cada linha (soma das anteriores + o "\n").
const INICIO_LINHA: number[] = []
let soma = 0
for (const linha of LINHAS) {
  INICIO_LINHA.push(soma)
  soma += linha.reduce((n, [, texto]) => n + texto.length, 0) + 1
}

// Onde estão, dentro do código, os pedaços que viram o título da prévia.
const P1 = 'Desenvolvimento de'
const P2 = 'sistemas.'
const ESPACO = '{" "}'
const INICIO_P1 = CODIGO.indexOf(P1)
const INICIO_P2 = CODIGO.indexOf(P2)
const FIM_ESPACO = CODIGO.indexOf(ESPACO) + ESPACO.length

// ---------- Relógio (ms desde a montagem) ----------
const COMECA = 350 // até aqui, nada digitado
const DIGITA = 2200 // 350 → 2550: todos os caracteres em ritmo constante
const SOME_CURSOR = 2650
const FIM = 3100

const limitar = (n: number, max: number) => Math.max(0, Math.min(max, n))

// Devolve o tempo t (0 → 3100). Mesmo padrão do useTimecode da Edição:
// requestAnimationFrame + cleanup. Com "reduzir animações", já nasce em FIM.
function useRelogio() {
  const [t, setT] = useState(() => (prefersReducedMotion() ? FIM : 0))

  useEffect(() => {
    if (prefersReducedMotion()) return

    const inicio = performance.now()
    let raf = 0
    const tick = (agora: number) => {
      const ms = Math.min(FIM, agora - inicio)
      setT(ms)
      if (ms < FIM) raf = requestAnimationFrame(tick) // em 3100 o laço para sozinho
    }
    raf = requestAnimationFrame(tick)

    // Cleanup: saiu da página no meio? cancela o próximo quadro.
    return () => cancelAnimationFrame(raf)
  }, [])

  return t
}

export function HeroEditor() {
  const t = useRelogio()

  // Tudo abaixo é DERIVADO de t: nenhum outro estado.
  const digitados = Math.floor(limitar((t - COMECA) / DIGITA, 1) * TOTAL)
  const cursores = t < SOME_CURSOR
  // linha onde está o cursor = a última que já começou
  const linhaAtual = INICIO_LINHA.findLastIndex((inicio) => inicio <= digitados)

  const previa1 = P1.slice(0, limitar(digitados - INICIO_P1, P1.length))
  const previa2 = P2.slice(0, limitar(digitados - INICIO_P2, P2.length))
  const espaco = digitados >= FIM_ESPACO ? ' ' : ''

  return (
    <section
      id="sistemas-hero"
      aria-labelledby="sistemas-titulo"
      className="wrap flex min-h-[648px] flex-col justify-center pt-2 pb-[72px] md:min-h-[812px] md:pt-4"
    >
      <Eyebrow className="sh-eyebrow">GSL Lab · Sistemas</Eyebrow>
      {/* O título de verdade, só para leitores de tela. O editor e a
          prévia são enfeite (aria-hidden) e seriam lidos letra por letra. */}
      <h1 id="sistemas-titulo" className="sr-only">
        Desenvolvimento de sistemas.
      </h1>

      <div className="mt-3 grid items-center gap-7 md:grid-cols-[minmax(0,440px)_minmax(0,1fr)] md:gap-[72px]">
        {/* ---------- Editor ---------- */}
        <div
          aria-hidden="true"
          className="sh-editor overflow-hidden rounded-[14px] border border-line bg-white font-mono text-[12px] leading-[22px] md:text-[14px] md:leading-[26px]"
        >
          <div className="flex h-9 items-center gap-4 border-b border-line bg-off px-4 md:h-10">
            <span className="flex gap-1.5">
              <span className="size-2 rounded-full bg-rabisco" />
              <span className="size-2 rounded-full bg-rabisco" />
              <span className="size-2 rounded-full bg-rabisco" />
            </span>
            <span className="text-[12px] text-mute">Hero.tsx</span>
          </div>

          <div className="pt-2.5 pb-3.5 md:pt-3.5 md:pb-[18px]">
            {LINHAS.map((linha, i) => {
              const digitando = cursores && i === linhaAtual
              // posição (no CODIGO) do trecho que está sendo desenhado
              let pos = INICIO_LINHA[i]
              return (
                <div
                  key={i}
                  // linhas que o cursor ainda não alcançou ocupam espaço
                  // (invisible), assim a caixa não cresce durante a digitação
                  className={cn('flex', digitando && 'bg-off', i > linhaAtual && 'invisible')}
                >
                  <span
                    className={cn(
                      'w-[34px] shrink-0 pr-3 text-right text-mute md:w-12 md:pr-[18px]',
                      !digitando && 'opacity-55',
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="whitespace-pre">
                    {linha.map(([tipo, texto], j) => {
                      const visivel = texto.slice(0, limitar(digitados - pos, texto.length))
                      pos += texto.length
                      return (
                        <span key={j} className={COR[tipo]}>
                          {visivel}
                        </span>
                      )
                    })}
                    {digitando && (
                      <span className="inline-block h-[1.2em] w-0.5 bg-brand align-middle" />
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ---------- Prévia ----------
            @container: o título usa a largura DESTA coluna (cqi), não a da
            página; assim ele cabe na coluna em qualquer largura de desktop. */}
        <div className="@container">
          <div aria-hidden="true">
            <p className="sh-rotulo mb-5 flex items-center gap-3 text-[11px] tracking-[.2em] text-mute uppercase">
              Prévia
              <span className="h-px flex-1 bg-line" />
            </p>
            <p className="min-h-[1.96em] text-[clamp(30px,9.4cqi,72px)] leading-[.98] font-extrabold tracking-[-.035em]">
              {previa1}
              {espaco}
              <span className="text-brand">{previa2}</span>
              {cursores && (
                <span className="ml-[.04em] inline-block h-[.82em] w-[max(3px,.06em)] bg-brand" />
              )}
            </p>
          </div>

          <p className="sh-frase mt-5 max-w-[520px] text-[16px] leading-[1.55] md:mt-7 md:text-[18px]">{FRASE}</p>
        </div>
      </div>
    </section>
  )
}
