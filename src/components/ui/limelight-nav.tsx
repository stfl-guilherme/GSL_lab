import { cloneElement, useEffect, useLayoutEffect, useRef, useState, type ReactElement } from 'react'
import { cn } from '@/lib/utils'

// Exportado: quem monta a lista de itens em outro arquivo precisa deste tipo.
export type NavItem = {
  id: string | number
  // "ReactElement<{ className?: string }>" = um elemento que aceita className.
  // Sem isso o TypeScript não deixa ler icon.props.className no cloneElement.
  icon: ReactElement<{ className?: string }>
  label: string // vira o aria-label do botão (o item é só um ícone)
  onClick?: () => void
}

type LimelightNavProps = {
  items: NavItem[]
  // CONTROLADO: se activeIndex vier, quem manda é o pai (aqui, o scroll).
  // NÃO CONTROLADO: sem activeIndex, o componente guarda o próprio estado,
  // começando em defaultActiveIndex.
  activeIndex?: number
  defaultActiveIndex?: number
  onTabChange?: (index: number) => void
  className?: string
  limelightClassName?: string
  iconContainerClassName?: string
  iconClassName?: string
}

// Barra de navegação com uma "luz" que desliza até o item ativo.
export function LimelightNav({
  items,
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) {
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex)
  // "??" = usa o da esquerda, a não ser que seja undefined/null
  const activeIndex = controlledIndex ?? internalIndex

  // Liga a transição só depois do primeiro posicionamento: assim a luz já
  // nasce no lugar certo, em vez de deslizar da borda ao carregar.
  const [isReady, setIsReady] = useState(false)

  // Refs = "ponteiros" para os elementos reais da página, para medi-los.
  const navRef = useRef<HTMLElement>(null)
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const limelightRef = useRef<HTMLDivElement>(null)

  // useLayoutEffect roda DEPOIS do React montar os elementos e ANTES do
  // navegador pintar a tela: dá para medir e posicionar sem a luz "piscar".
  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const position = () => {
      const limelight = limelightRef.current
      const activeItem = navItemRefs.current[activeIndex]
      if (!limelight || !activeItem) return
      // centro do item ativo − metade da largura da luz
      const left = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2
      limelight.style.left = `${left}px`
    }

    position()
    // Recalcula também quando a barra muda de tamanho (girar o celular,
    // redimensionar a janela, a barra deixar de estar escondida).
    const observer = new ResizeObserver(position)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [activeIndex, items.length])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (items.length === 0) return null

  function handleItemClick(index: number, onClick?: () => void) {
    // No modo controlado não mexemos no estado interno: o pai decide.
    if (controlledIndex === undefined) setInternalIndex(index)
    onTabChange?.(index)
    onClick?.()
  }

  return (
    <nav
      ref={navRef}
      className={cn('relative inline-flex h-16 items-center rounded-lg border bg-card px-2 text-foreground', className)}
    >
      {items.map(({ id, icon, label, onClick }, index) => {
        const isActive = activeIndex === index
        return (
          // <button> de verdade: recebe foco com Tab e responde a Enter/Espaço
          <button
            key={id}
            type="button"
            // Ref callback COM chaves: a função não pode devolver nada.
            // Sem chaves ela devolveria o valor da atribuição, e o React 19
            // trata o retorno de um ref callback como função de limpeza.
            ref={(el) => {
              navItemRefs.current[index] = el
            }}
            aria-label={label}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => handleItemClick(index, onClick)}
            className={cn(
              'relative z-20 flex h-full cursor-pointer items-center justify-center p-5',
              iconContainerClassName,
            )}
          >
            {/* cloneElement = copia o ícone recebido, trocando só o className */}
            {cloneElement(icon, {
              className: cn(
                'size-6 transition-opacity duration-100 ease-in-out',
                isActive ? 'opacity-100' : 'opacity-40',
                icon.props.className,
                iconClassName,
              ),
            })}
          </button>
        )
      })}

      {/* a luz: uma barrinha no topo + um "cone" em degradê embaixo dela.
          bg-primary é o vermelho da marca (--primary = --color-brand no index.css) */}
      <div
        ref={limelightRef}
        aria-hidden="true"
        className={cn(
          'absolute top-0 left-0 z-10 h-[5px] w-11 rounded-full bg-primary shadow-[0_50px_15px_var(--primary)]',
          isReady && 'transition-[left] duration-400 ease-in-out',
          limelightClassName,
        )}
      >
        <div className="pointer-events-none absolute top-[5px] left-[-30%] h-14 w-[160%] bg-linear-to-b from-primary/30 to-transparent [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)]" />
      </div>
    </nav>
  )
}
