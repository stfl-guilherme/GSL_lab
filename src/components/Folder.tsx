import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type Ref } from 'react'
import { countLabel, type Folder as FolderData, type PortfolioItem } from '@/data/portfolio'
import { cn } from '@/lib/utils'
import { FolderBack } from './FolderBack'
import { FolderCard } from './FolderCard'

interface FolderProps {
  ref?: Ref<HTMLDivElement> // o Work usa para saber se um clique caiu dentro da pasta
  folder: FolderData
  index: number // posição na lista: usada para escalonar a montagem
  isOpen: boolean
  assembled: boolean // true depois que a seção apareceu na tela
  canHover: boolean // false no celular: sem inclinação seguindo o cursor
  onActivate: () => void // clique no botão da pasta; o Work decide o que fazer
  onOpenItem: (item: PortfolioItem) => void
}

// Camadas de uma pasta, de trás para frente:
//   1. painel traseiro com arte (.folder-back)
//   2. arquivos (.file-card), que ficam "dentro" da pasta
//   3. botão invisível que cobre a pasta inteira (abre/fecha/navega)
//   4. painel frontal de vidro (.folder-front), que inclina
// Quando a pasta abre, os arquivos sobem para cima do vidro (z-index 5 > 4)
// e se espalham em leque. Só os ARQUIVOS recebem clique (pointer-events no
// CSS): o espaço entre eles continua indo para o botão da pasta.
export function Folder({ ref, folder, index, isOpen, assembled, canHover, onActivate, onOpenItem }: FolderProps) {
  // posição do cursor dentro da pasta, de -0,5 a 0,5 (null = cursor fora)
  const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null)
  // useRef guarda valores que NÃO redesenham a tela quando mudam
  const frame = useRef<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const hovering = canHover && !isOpen && tilt !== null
  const n = folder.items.length
  // pasta de vídeo aberta: o próximo clique leva à página de Edição
  const leadsToPage = folder.id === 'video' && isOpen

  // Ao FECHAR (por Esc, clique fora ou clique na pasta): se o foco estava
  // num arquivo, ele vai sumir (inert), e quem usa teclado ficaria "perdido".
  // Então o foco volta para o botão da pasta.
  // useLayoutEffect roda logo após o React mexer no DOM, antes do navegador
  // tirar o foco do arquivo que acabou de virar inert. Com useEffect (que
  // roda depois da pintura) o foco já teria ido para o <body>.
  useLayoutEffect(() => {
    if (!isOpen && rootRef.current?.contains(document.activeElement)) {
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!canHover || isOpen) return
    const r = e.currentTarget.getBoundingClientRect()
    const next = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }
    // requestAnimationFrame limita a no máximo 1 atualização por quadro da tela
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      setTilt(next)
    })
  }

  function handleMouseLeave() {
    // cancela a atualização pendente, senão ela inclinaria a pasta de novo
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current)
      frame.current = null
    }
    setTilt(null)
  }

  // Um elemento, dois refs: o nosso (rootRef) e o que veio do Work.
  function setRoot(el: HTMLDivElement | null) {
    rootRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  // inclinação do vidro: parado, seguindo o cursor ou aberto
  let frontTransform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
  if (isOpen) frontTransform = 'perspective(1100px) rotateX(-24deg) rotateY(0deg)'
  else if (hovering && tilt) {
    frontTransform = `perspective(1100px) rotateX(${-6 - tilt.y * 6}deg) rotateY(${tilt.x * 10}deg)`
  }

  // posição de cada arquivo. k vai de negativo a positivo em volta do centro:
  // com 4 arquivos, k = -1.5, -0.5, 0.5, 1.5 → leque simétrico
  function cardTransform(i: number) {
    const k = i - (n - 1) / 2
    if (isOpen) {
      return n === 1
        ? 'translate(-50%, -16%) scale(1.3)'
        : `translate(calc(-50% + ${k * 86}%), ${-30 + Math.abs(k) * 7}%) rotate(${k * 8}deg) scale(1.1)`
    }
    if (hovering) return `translate(calc(-50% + ${k * 16}px), -9%) rotate(${k * 3}deg)`
    return `translate(calc(-50% + ${k * 12}px), 0%) rotate(${k * 2}deg)`
  }

  // o que o leitor de tela anuncia no botão
  const label = leadsToPage
    ? 'Abrir página de Edição de vídeo'
    : `${isOpen ? 'Fechar' : 'Abrir'} pasta ${folder.name}, ${countLabel(n)}`

  return (
    <div
      ref={setRoot}
      data-id={folder.id}
      className={cn('folder', isOpen && 'is-open', assembled && 'is-assembled')}
      // variáveis CSS próprias precisam do "as CSSProperties" para o TypeScript aceitar
      style={{ '--delay': `${index * 0.15}s` } as CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="folder-shadow" />

      <div className="folder-backwrap">
        <FolderBack id={folder.id} />
      </div>

      <button
        ref={toggleRef}
        type="button"
        onClick={onActivate}
        // aria-expanded diz "este botão abre/fecha algo". Quando o botão
        // passa a levar para outra página, ele deixa de ser abre/fecha, e
        // undefined faz o React não escrever o atributo.
        aria-expanded={leadsToPage ? undefined : isOpen}
        aria-label={label}
        className="folder-toggle"
      />

      {/* inert: com a pasta fechada, os arquivos saem do Tab e do leitor de tela */}
      <div className="folder-files" inert={!isOpen}>
        {folder.items.map((item, i) => (
          <FolderCard
            key={item.id}
            item={item}
            style={
              {
                transform: cardTransform(i),
                transitionDelay: `${isOpen ? i * 45 : (n - 1 - i) * 30}ms`,
                '--i': i,
              } as CSSProperties
            }
            onOpen={() => onOpenItem(item)}
          />
        ))}
      </div>

      <div
        className="folder-front"
        // seguindo o cursor a resposta é mais rápida que ao abrir/fechar
        style={{ transform: frontTransform, transitionDuration: hovering ? '.25s' : undefined }}
        aria-hidden="true"
      >
        <span className="absolute inset-x-[7%] bottom-[10%]">
          <span className="folder-name">{folder.name}</span>
          {/* Os dois textos ficam no mesmo lugar (o segundo é absolute por
              cima do primeiro) e trocam só a opacidade: um cross-fade. */}
          <span className="relative mt-1.5 block text-[13px]">
            <span className={cn('block text-mute transition-opacity duration-300', leadsToPage && 'opacity-0')}>
              {countLabel(n)}
            </span>
            {folder.id === 'video' && (
              <span
                className={cn(
                  'absolute inset-0 font-medium whitespace-nowrap text-[#C1290A] transition-opacity duration-300',
                  !leadsToPage && 'opacity-0',
                )}
              >
                Ver todos os vídeos →
              </span>
            )}
          </span>
        </span>
      </div>
    </div>
  )
}
