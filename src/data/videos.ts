// Fonte ÚNICA dos vídeos. A pasta "Edição de vídeo" (portfolio.ts) e a
// página /edicao-de-video leem daqui. Mudou um número? Mude só aqui.

import { contacts } from '@/config/contact'
import video1 from '@/assets/video-1.jpg'
import video2 from '@/assets/video-2.jpg'
import video3 from '@/assets/video-3.jpg'

export type Video = {
  id: string
  titulo: string
  descricao: string // placeholder "[Descrição do vídeo]"
  visualizacoes: number // número cru, ex.: 16000
  instagramUrl: string // placeholder "[link do Instagram]"
  src?: string // opcional: por enquanto não há mp4, só a capa
  poster?: string // capa; sem ela aparece uma capa provisória
  duracao?: string // ex.: "0:42". Vazio = não aparece na ficha
  feito?: string // o que foi feito, ex.: "corte, legendas, trilha". Vazio = não aparece
}

// TODO: confirmar qual capa corresponde a qual número de visualizações.
export const videos: Video[] = [
  { id: 'v1', titulo: 'Corte – Byte Papo', descricao: '[Descrição do vídeo]', visualizacoes: 16000, instagramUrl: '[link do Instagram]', poster: video1 },
  { id: 'v2', titulo: 'Corte – Byte Papo', descricao: '[Descrição do vídeo]', visualizacoes: 9900, instagramUrl: '[link do Instagram]', poster: video2 },
  { id: 'v3', titulo: 'Corte – Saber Sabor', descricao: '[Descrição do vídeo]', visualizacoes: 7900, instagramUrl: '[link do Instagram]', poster: video3 },
  // TODO: falta a capa. Coloque src/assets/video-4.jpg, importe lá em cima
  // (import video4 from '@/assets/video-4.jpg') e adicione poster: video4.
  { id: 'v4', titulo: '[Nome do vídeo 4]', descricao: '[Descrição do vídeo]', visualizacoes: 5200, instagramUrl: '[link do Instagram]' },
]

// Criado uma vez só (fora da função): montar um Intl.NumberFormat é caro.
const compacto = new Intl.NumberFormat('pt-BR', { notation: 'compact' })

// 16000 → "16 mil", 9900 → "9,9 mil"
export const formatarVisualizacoes = (n: number) => compacto.format(n)

// Link "de verdade"? Os placeholders começam com "[" e não contam.
export const temLink = (url: string) => url !== '' && !url.startsWith('[')

// Enquanto um vídeo não tem link próprio, os botões levam ao perfil da GSL Lab
// (o mesmo endereço da seção Contato), para nunca existir link quebrado.
const perfilInstagram = contacts.find((c) => c.icon === 'instagram')?.href ?? 'https://www.instagram.com/'
export const linkDoVideo = (video: Video) => (temLink(video.instagramUrl) ? video.instagramUrl : perfilInstagram)

// id da seção de cada vídeo na página /edicao-de-video: 0 → "video-1"
export const idDoVideo = (indice: number) => `video-${indice + 1}`

// id da seção que agrupa todos os vídeos (a EdicaoNav usa para saber que
// estamos "nos vídeos", e não no hero nem no contato)
export const ID_VIDEOS = 'videos'
