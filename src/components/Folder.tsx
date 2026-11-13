import { useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { countLabel, type Folder as FolderData, type PortfolioItem } from '@/data/portfolio'
import { cn } from '@/lib/utils'
import { FolderBack } from './FolderBack'
import { FolderCard } from './FolderCard'

interface FolderProps {
  folder: FolderData
  index: number // posição na lista: usada para escalonar a montagem
  isOpen: boolean
  assembled: boolean // true depois que a seção apareceu na tela
  canHover: boolean // false no celular: sem inclinação seguindo o cursor
  onToggle: () => void
  onOpenItem: (item: PortfolioItem) => void
}

// Camadas de uma pasta, de trás para frente:
//   1. painel traseiro com arte (.folder-back)
//   2. arquivos (.file-card), que ficam "dentro" da pasta
//   3. botão invisível que cobre a pasta inteira (abre/fecha)
//   4. painel frontal de vidro (.folder-front), que inclina
// Quando a pasta abre, os arquivos sobem para cima do vidro e se espalham em leque.
export function Folder({ folder, index, isOpen, assembled, canHover, onToggle, onOpenItem }: FolderProps) {
  // posição do cursor dentro da pasta, de -0,5 a 0,5 (null = cursor fora)
  const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null)
  // useRef guarda valores que NÃO redesenham a tela quando mudam
  const frame = useRef<number | null>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const hovering = canHover && !isOpen && tilt !== null
  const n = folder.items.length

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

  // Esc fecha a pasta e devolve o foco ao botão dela
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Escape' || !isOpen) return
    onToggle()
    toggleRef.current?.focus()
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

  return (
    <div
      data-id={folder.id}
      className={cn('folder', isOpen && 'is-open', assembled && 'is-assembled')}
      // variáveis CSS próprias precisam do "as CSSProperties" para o TypeScript aceitar
      style={{ '--delay': `${index * 0.15}s` } as CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      <div className="folder-shadow" />

      <div className="folder-backwrap">
        <FolderBack id={folder.id} />
      </div>

      <button
        ref={toggleRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? 'Fechar' : 'Abrir'} pasta ${folder.name}, ${countLabel(n)}`}
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
          <span className="mt-1.5 block text-[13px] text-mute">{countLabel(n)}</span>
        </span>
      </div>
    </div>
  )
}
