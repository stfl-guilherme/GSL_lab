// Todo o CONTEÚDO das pastas fica aqui. Os componentes só desenham o que
// recebem. Para trocar um nome ou um link, você mexe neste arquivo.
// Exceção: os vídeos ficam em videos.ts (a página de Edição usa os mesmos).

import design1 from '@/assets/design-1.jpg'
import design2 from '@/assets/design-2.jpg'
import design3 from '@/assets/design-3.jpg'
import design4 from '@/assets/design-4.jpg'
import { formatarVisualizacoes, temLink, videos } from './videos'

// ---------- Tipos ----------
// Cada item tem um campo "kind" que diz o que ele é. O TypeScript usa esse
// campo para saber quais outros campos existem: só o vídeo tem "url", só a
// imagem tem "fit". Isso se chama união discriminada.
interface ItemBase {
  id: string
  name: string
  detail: string
}

export interface SiteItem extends ItemBase {
  kind: 'site'
}

export interface ImageItem extends ItemBase {
  kind: 'image'
  image: string
  alt?: string              // "?" = opcional; sem ele, usa o nome
  fit?: 'cover' | 'contain' // contain = mostra a imagem inteira (bom para banner)
}

export interface VideoItem extends ItemBase {
  kind: 'video'
  thumbnail?: string // capa; sem ela aparece uma capa provisória
  url?: string       // link do vídeo publicado; vazio = play sem link
}

export type PortfolioItem = SiteItem | ImageItem | VideoItem

export type FolderId = 'sistemas' | 'design' | 'video'

export interface Folder {
  id: FolderId
  name: string
  items: PortfolioItem[] // o leque foi desenhado para até 4 itens
}

// "1 item", "4 itens"
export const countLabel = (n: number) => `${n} ${n === 1 ? 'item' : 'itens'}`

// ---------- Pastas ----------
// A ordem aqui é a ordem na página (no celular, Sistemas vem primeiro).
export const folders: Folder[] = [
  {
    id: 'sistemas',
    name: 'Sistemas',
    items: [
      { id: 'portfolio', kind: 'site', name: 'Este portfólio', detail: 'Site pessoal · React + Tailwind' },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    items: [
      { id: 'd1', kind: 'image', name: 'Minissérie – Byte Papo', detail: 'Capa de episódio', image: design1 },
      { id: 'd2', kind: 'image', name: 'Canal de cortes – Byte Papo', detail: 'Arte de lançamento', image: design2 },
      { id: 'd3', kind: 'image', name: 'Canal de cortes – Saber Sabor', detail: 'Arte de lançamento', image: design3 },
      { id: 'd4', kind: 'image', name: 'Canal de cortes – Podcast', detail: 'Banner do canal', image: design4, fit: 'contain' },
    ],
  },
  {
    id: 'video',
    name: 'Edição de vídeo',
    // Os vídeos vêm de videos.ts. Aqui só "traduzimos" cada Video para o
    // formato de item da pasta. .map() devolve um array novo, item a item.
    items: videos.map((v) => ({
      id: v.id,
      kind: 'video' as const, // "as const": o tipo é o literal 'video', não string
      name: v.titulo,
      detail: `${formatarVisualizacoes(v.visualizacoes)} visualizações`,
      thumbnail: v.poster,
      url: temLink(v.instagramUrl) ? v.instagramUrl : '',
    })),
  },
]
