// Todo o CONTEÚDO das pastas fica aqui. Os componentes só desenham o que
// recebem. Para trocar um nome, um número de visualizações ou um link,
// você mexe neste arquivo e em nenhum outro.

import design1 from '@/assets/design-1.jpg'
import design2 from '@/assets/design-2.jpg'
import design3 from '@/assets/design-3.jpg'
import design4 from '@/assets/design-4.jpg'
import video1 from '@/assets/video-1.jpg'
import video2 from '@/assets/video-2.jpg'
import video3 from '@/assets/video-3.jpg'

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
    // TODO: confirmar qual capa corresponde a qual número de visualizações
    // e preencher "url" com o link de cada vídeo publicado.
    items: [
      { id: 'v1', kind: 'video', name: 'Corte – Byte Papo', detail: '16 mil visualizações', thumbnail: video1, url: '' },
      { id: 'v2', kind: 'video', name: 'Corte – Byte Papo', detail: '9,9 mil visualizações', thumbnail: video2, url: '' },
      { id: 'v3', kind: 'video', name: 'Corte – Saber Sabor', detail: '7,9 mil visualizações', thumbnail: video3, url: '' },
      // TODO: falta a capa. Coloque src/assets/video-4.jpg, importe lá em cima
      // (import video4 from '@/assets/video-4.jpg') e adicione thumbnail: video4.
      { id: 'v4', kind: 'video', name: '[Nome do vídeo 4]', detail: '5,2 mil visualizações', url: '' },
    ],
  },
]
