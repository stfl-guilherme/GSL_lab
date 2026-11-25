// Todo o CONTEÚDO da página Sistemas fica aqui. Os componentes só desenham
// o que recebem: para trocar um texto, um link ou um print, você mexe
// neste arquivo. A ordem do array é a ordem dos cartões na grade.

// ---------- Caminhos dos arquivos ----------
// Os prints ficam em public/sistemas/. Tudo que está em public/ é servido
// a partir da raiz do site, MAS no GitHub Pages o site mora numa subpasta
// (ex.: /GSL_lab/). import.meta.env.BASE_URL é essa subpasta: o Vite troca
// pelo valor certo no build ("/" no dev). Sempre termina com "/".
const arquivo = (nome: string) => `${import.meta.env.BASE_URL}sistemas/${nome}`

// ---------- Tipos ----------
export interface Tela {
  rotulo: string // texto da miniatura (ex.: "Relatórios")
  src: string
  // De que tela é o print. No modal, um print de celular dentro do quadro
  // largo (16:9) aparece inteiro, sem corte; o mesmo vale ao contrário.
  formato?: 'desktop' | 'celular' // sem ele: 'desktop'
}

// Nome escrito como o logo do próprio sistema: uma fonte e um pedaço de
// texto para cada cor. A fonte precisa ser carregada no index.html.
export interface Logo {
  fonte: string // ex.: "'Baloo 2', sans-serif"
  peso: number
  partes: { texto: string; cor: string }[] // juntas formam o nome
}

export interface Sistema {
  slug: string          // identificador único, sem espaço nem acento (ex.: "ja-na-caixa")
  nome: string
  logo?: Logo           // sem ele, o nome usa a fonte e as cores do site
  resumo: string        // 1 linha: aparece no cartão e no subtítulo do modal
  stack: string[]
  problema: string
  oQueFaz: string[]     // 3 itens
  meuPapel: string
  demoUrl?: string      // "?" = opcional; sem ele, o botão "Abrir demo" não aparece
  demoNota?: string     // só aparece se houver demo
  codigoUrl: string
  printDesktop: string  // 16:9 (capa do cartão e 1ª mídia do modal no desktop)
  rotuloCapa?: string   // nome da 1ª miniatura do modal; sem ele: "Tela inicial" (desktop) e "Celular"
  printCelular: string  // 4:5 (capa do cartão e 1ª mídia do modal no celular)
  video?: string        // mp4 curto em loop (sem som); o printDesktop vira a capa
  telasExtras?: Tela[]
  // Telas extras do CELULAR (prints de celular). Sem elas, o celular
  // mostra as mesmas telasExtras do desktop.
  telasCelular?: Tela[]
}

// ---------- Sistemas ----------
// TODO: os textos entre [colchetes] e os prints .svg são provisórios
// (o JáNaCaixa já tem os prints reais).
export const sistemas: Sistema[] = [
  {
    slug: 'ja-na-caixa',
    nome: 'JáNaCaixa',
    logo: {
      fonte: "'Baloo 2', sans-serif",
      peso: 800,
      partes: [
        { texto: 'Já', cor: '#157A2E' },
        { texto: 'NaCaixa', cor: '#142028' },
      ],
    },
    resumo: 'Controle financeiro pessoal sem planilha.',
    stack: ['React', 'TypeScript', 'Django', 'PostgreSQL'],
    problema:
      'Anotar gastos em planilha dá trabalho e quase ninguém mantém o hábito. [Revise: o problema com as suas palavras.]',
    oQueFaz: [
      'Login real, com botão para entrar como usuário de demonstração.',
      '[Função 2]',
      '[Função 3]',
    ],
    meuPapel: 'Projeto individual: banco de dados, API em Django e interface em React.',
    demoUrl: 'https://[demo-ja-na-caixa]', // TODO: link da demo publicada
    demoNota: 'A demo tem login de demonstração: não precisa criar conta.',
    codigoUrl: 'https://github.com/stfl-guilherme/ja-na-caixa',
    // o login é a capa: tem as cores mais fortes da grade
    printDesktop: arquivo('ja-na-caixa-login-desktop.png'),
    printCelular: arquivo('ja-na-caixa-login-celular.jpg'),
    rotuloCapa: 'Login',
    telasExtras: [
      { rotulo: 'Tela principal', src: arquivo('ja-na-caixa-painel.png') },
      { rotulo: 'Categorias', src: arquivo('ja-na-caixa-categorias.png') },
    ],
    telasCelular: [
      { rotulo: 'Tela principal', src: arquivo('ja-na-caixa-painel-celular.jpg'), formato: 'celular' },
      { rotulo: 'Gráfico do mês', src: arquivo('ja-na-caixa-grafico-celular.jpg'), formato: 'celular' },
    ],
  },
  {
    // Este próprio site. Sem demoUrl: quem vê o modal já está na "demo".
    // Os textos são um ponto de partida: revise com as suas palavras.
    slug: 'gsl-lab',
    nome: 'GSL Lab',
    resumo: 'Este portfólio: sistemas, design e edição de vídeo.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    problema:
      'Mostrar trabalhos de três áreas diferentes num lugar só, sem virar uma vitrine genérica e funcionando bem no celular.',
    oQueFaz: [
      'Pastas de vidro que abrem em leque com os trabalhos de cada área.',
      'Páginas próprias para Edição de vídeo e Sistemas, com animações que respeitam o "reduzir animações".',
      'Navegação completa pelo teclado e por leitor de tela.',
    ],
    meuPapel: 'Projeto individual: do layout ao código, em React com TypeScript.',
    codigoUrl: 'https://github.com/stfl-guilherme/GSL_lab',
    printDesktop: arquivo('gsl-lab-inicio.png'),
    printCelular: arquivo('gsl-lab-inicio-celular.jpg'),
    rotuloCapa: 'Início',
    telasExtras: [
      { rotulo: 'Sistemas', src: arquivo('gsl-lab-sistemas.png') },
      { rotulo: 'Edição de vídeo', src: arquivo('gsl-lab-edicao.png') },
    ],
    telasCelular: [
      { rotulo: 'Sistemas', src: arquivo('gsl-lab-sistemas-celular.jpg'), formato: 'celular' },
      { rotulo: 'Edição de vídeo', src: arquivo('gsl-lab-edicao-celular.jpg'), formato: 'celular' },
    ],
  },
  {
    slug: 'sistema-3',
    nome: '[Sistema 3]',
    resumo: '[Resumo do sistema em uma linha.]',
    stack: ['[Tecnologia 1]', '[Tecnologia 2]', '[Tecnologia 3]'],
    problema: '[Qual problema este sistema resolve.]',
    oQueFaz: ['[Função 1]', '[Função 2]', '[Função 3]'],
    meuPapel: '[O que você fez neste projeto.]',
    demoUrl: 'https://[demo-sistema-3]',
    codigoUrl: 'https://github.com/stfl-guilherme/[sistema-3]',
    printDesktop: arquivo('sistema-3-desktop.svg'),
    printCelular: arquivo('sistema-3-celular.svg'),
    telasExtras: [{ rotulo: '[Outra tela]', src: arquivo('sistema-3-extra.svg') }],
  },
]

// Acha um sistema pelo slug (undefined se não existir). O modal guarda o
// SLUG do sistema aberto, não a posição no array: assim um link direto
// (/#/sistemas/ja-na-caixa) só precisa ler o slug da URL.
export const buscarSistema = (slug: string) => sistemas.find((s) => s.slug === slug)
