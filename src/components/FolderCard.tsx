import type { CSSProperties } from 'react'
import type { PortfolioItem } from '@/data/portfolio'
import { CardThumb } from './CardThumb'

interface FolderCardProps {
  item: PortfolioItem
  style: CSSProperties // posição no leque, calculada pela pasta
  onOpen: () => void
}

// Um arquivo dentro da pasta. É um <button> de verdade: funciona com
// Tab + Enter e é anunciado por leitores de tela.
export function FolderCard({ item, style, onOpen }: FolderCardProps) {
  return (
    <button type="button" className="file-card" style={style} onClick={onOpen}>
      <CardThumb item={item} />
      <span className="block px-2.5 pt-2 pb-2.5">
        <span className="block truncate text-[11.5px] leading-tight font-extrabold">{item.name}</span>
        <span className="mt-0.5 block truncate text-[11px] text-mute">{item.detail}</span>
      </span>
    </button>
  )
}
