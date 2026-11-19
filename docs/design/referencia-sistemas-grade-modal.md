# Referência — Página Sistemas: grade de cartões + modal

Especificação extraída do protótipo aprovado no Claude Design (artboards `Sistemas-Grade`, `Sistemas-Grade-Mobile`, `Sistemas-Modal`, `Sistemas-Modal-Mobile`). Os valores abaixo são os do protótipo: reproduza-os exatamente.

> Fonte: o protótipo usa **Montserrat** só como substituta. No site real a fonte é a **Garet** (Book e Heavy). Mapeamento: peso 400 → Garet Book; pesos 700 e 800 → Garet Heavy. A Garet não tem peso 700: NÃO use `font-weight: 700` com ela (o navegador cria um negrito falso).

---

## 1. Tokens

| Token | Valor |
|---|---|
| `--red` | `#C1290A` |
| `--gray` (rabisco) | `#DCDBD8` |
| `--ink` (grafite) | `#2B2B2E` |
| `--mute` | `#66655F` |
| `--off` | `#F6F5F3` |
| `--line` | `#E9E8E5` |
| Curva padrão | `cubic-bezier(.22,1,.36,1)` |
| Container | `max-width: 1280px; padding: 0 48px` (celular: `0 20px`) |
| Quebra celular | `max-width: 760px` |

---

## 2. Seção "Projetos" (grade)

Estrutura: `section#projetos` → eyebrow "Projetos" (vermelho, 12px, caixa alta, `letter-spacing .24em`) → h2 "Do banco à tela." (Heavy, `clamp(36px, 4.8cqi, 68px)`, `line-height 1.02`, `letter-spacing -.025em`) → margem 56px (celular 32px) → grade.

Padding vertical da seção: 160px (celular 96px). Cabeçalho e Contato entram com "revelar ao rolar": opacidade 0 + `translateY(28px)` → 1 e 0, `1s` na curva `cubic-bezier(.2,.7,.2,1)`.

### Grade
- Desktop: `grid-template-columns: repeat(2, minmax(0,1fr)); gap: 32px`.
- Celular: 1 coluna, `gap: 20px`.
- Com 1 sistema só: 1 coluna também no desktop.

### Cartão (`<button type="button" aria-haspopup="dialog">`)
- `aspect-ratio: 16/10` (celular `4/5`), `border-radius: 24px`, `overflow: hidden`, fundo `--off`, `box-shadow: 0 8px 24px rgba(43,43,46,.08)`.
- Foco: `outline: 3px solid var(--red); outline-offset: 4px`.
- **Imagem**: absoluta, `object-fit: cover; object-position: left top`. Desktop usa o print 16:9; celular usa o print 4:5 (troca por CSS).
  - Desktop: `filter: blur(3px); scale: 1.05; transform-origin: left top`. No hover/foco: `filter: none; scale: 1`. Transição `.5s ease`.
  - Celular: sem blur, sem escala, sem transição.
- **Botão "+"** (decorativo, dentro do cartão): `top/right 16px`, 44×44, círculo, fundo `rgba(255,255,255,.94)`, ícone + 20px traço 2. Hover/foco: `rotate(45deg)` em `.4s cubic-bezier(.2,.8,.2,1)`.
- **Faixa de vidro** (base do cartão): `position:absolute; left:0; right:0; bottom:0`, `padding: 18px 24px 20px` (celular `16px 18px 18px`), coluna com `gap: 6px`, `background: rgba(255,255,255,.72)`, `backdrop-filter: blur(16px)`, `border-top: 1px solid rgba(255,255,255,.6)`.
  - Nome: Heavy, 22px, `line-height 1.15`, `letter-spacing -.01em`, cor `--ink`.
  - Descrição: Book, 15px, `line-height 1.45`, cor `--ink`.
  - Tags: `margin-top 4px`, `gap 6px`, pílulas 12px Heavy, `padding 6px 10px`, raio 999px, fundo `--off`, texto `--ink`.
- **Inclinação 3D** (só desktop com mouse — `(hover: hover)` — e sem movimento reduzido):
  - Base: `transform: perspective(900px) rotateX(0) rotateY(0)`, transição `.5s` na curva padrão.
  - No `mousemove`: posição normalizada `mx, my ∈ [-0.5, 0.5]`; `rotateX = clamp(-my*12, -6, 6)`, `rotateY = clamp(mx*12, -6, 6)`; enquanto move, transição `.12s linear`; atualização dentro de `requestAnimationFrame`.
  - `mouseleave`: volta a 0.
  - Sem reflexo, sem brilho, sem padrões, sem formas girando.

---

## 3. Modal

### Comportamento
- Abre ao clicar no cartão; fecha com X, `Esc` e clique no fundo.
- Foco vai para o X ao abrir; foco fica preso no modal (Tab/Shift+Tab); ao fechar, o foco volta ao cartão de origem.
- Rolagem da página travada com o modal aberto.
- Desktop: `←`/`→` trocam de sistema.
- Celular: swipe horizontal (> 40px) na imagem troca de sistema.
- Navegação circular: o próximo do último é o primeiro.
- `role="dialog" aria-modal="true" aria-labelledby` → título.

### Animação (morph cartão → modal)
- **Abrir: 0.6s**, curva padrão. A imagem do cartão vira a área de mídia do modal; o nome do cartão vira o título do modal (o tamanho da fonte anima de 22px para 28px); o painel cresce a partir do retângulo do cartão; a faixa de vidro do cartão some (opacidade → 0) durante o trajeto.
- O cartão de origem fica `visibility: hidden` enquanto o modal está aberto.
- **Conteúdo** (subtítulo, controles, miniaturas, coluna direita, selo "Vídeo"): `opacity 0 → 1` + `translateY(8px → 0)`, **0.35s**, começando **0.3s** depois do início do morph.
- **Fechar: 0.5s**. Primeiro o conteúdo some (`opacity 0` em 0.15s), depois as peças voltam do modal para o cartão.
- Fundo (`mdl-bg`): opacidade 0 → 1 em 0.6s (0.5s ao fechar).
- Raios durante o morph: painel 24 → 24 (celular → 0); mídia 24 → 16 (celular → 0).
- **Movimento reduzido**: sem morph e sem inclinação; o modal só aparece/some com fade de 0.2s.

### Fundo atrás do modal
`position: fixed; inset: 0; background: rgba(255,255,255,.3); backdrop-filter: blur(8px)`. Não escurece a página.

### Painel (desktop)
- `width: min(1320px, 94vw); max-height: 90vh; overflow: auto; overscroll-behavior: contain; border-radius: 24px`.
- Vidro: `background: rgba(255,255,255,.86); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,.7); box-shadow: 0 24px 60px rgba(43,43,46,.08)`.
  - 86% e não 78%: foi o mínimo para o texto `--mute` e os rótulos vermelhos passarem de 4.5:1 sobre áreas escuras atrás.
- Container do modal: `position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 32px`.

**Cabeçalho** (`padding: 28px 32px 20px`, flex, `justify-content: space-between`, `gap 24px`):
- Esquerda: título Heavy 28px (`line-height 1.15`, `letter-spacing -.01em`) + subtítulo Book 15px `--mute`, `margin-top 6px`.
- Direita (`gap 8px`): posição "1 de 3" (13px Heavy `--mute`, `tabular-nums`, `margin-right 8px`), botões "anterior", "próximo", "fechar".
- Botões de ícone: 44×44, círculo, `border: 1px solid var(--line)`, fundo branco; hover: borda `--ink`; ícone 20px.

**Corpo** (`display: grid; grid-template-columns: minmax(0,65fr) minmax(0,35fr); gap: 40px; padding: 0 32px 32px; align-items: start`):

Coluna esquerda:
- Mídia `aspect-ratio: 16/9`, raio 16px, fundo `--off`, imagem `cover` alinhada ao topo-esquerda (ou `contain` centralizada quando for a tela de celular dentro do quadro 16:9).
- Selo no canto (`left/top 14px`): "▶ Vídeo · em loop, sem som", fundo `rgba(43,43,46,.9)`, texto branco 12px Heavy, `padding 7px 11px`, raio 999px. No site real a mídia é um `<video autoplay muted loop playsinline>` com o print como `poster`; o selo some quando houver vídeo.
- Miniaturas: grade de 3 colunas, `gap 12px`, `margin-top 14px`. Cada uma é `<button aria-pressed>` 16:9, raio 10px, borda `--line`; a ativa ganha `outline: 2px solid var(--ink); outline-offset: 2px`. Rótulo no canto inferior esquerdo: 11px Heavy, fundo branco, `padding 3px 7px`, raio 6px. Clicar troca a mídia principal. Ordem no desktop: "Tela inicial" (print desktop), "Celular" (print 4:5 com `contain`), outra tela.

Coluna direita (coluna com `gap 22px`), quatro blocos:
- Rótulo: 11px, caixa alta, `letter-spacing .2em`, vermelho, Heavy, `margin-bottom 8px` — "O problema", "O que faz", "Stack", "Meu papel".
- Parágrafo: Book 15px, `line-height 1.55`.
- Lista "O que faz": sem marcador nativo, `gap 8px`, 15px, `line-height 1.45`, `padding-left 16px` e bolinha de 6px `--gray` em `top: .6em`.
- Stack: pílulas 12px Heavy, `padding 7px 11px`, raio 999px, fundo `--off`, borda `--line`.
- Ações (`gap 10px`, quebra linha):
  - "Abrir demo ↗" — fundo vermelho, texto branco, borda 1.5px vermelha. **Só aparece se o sistema tiver demo.**
  - "Ver código ↗" — fundo branco, borda 1.5px `--ink`, texto `--ink`.
  - Ambos: `min-height 48px; padding 0 20px`, raio 999px, 15px Heavy, ícone seta 16px, `target="_blank" rel="noreferrer"` e texto oculto "(abre em nova aba)".
  - Nota abaixo (só com demo, se preenchida): 13px `--mute`, largura 100%. Ex.: "A demo tem login de demonstração: não precisa criar conta."

### Painel (celular)
- Container sem padding; painel em tela cheia (`width/height 100%`, raio 0, sem borda nem sombra), em coluna: área rolável + rodapé fixo.
- X absoluto `top/right 12px`, sombra `0 4px 14px rgba(43,43,46,.18)`, borda branca.
- Mídia `aspect-ratio 4/5`, raio 0, `touch-action: pan-y` (swipe horizontal troca de sistema).
- Pontos indicadores abaixo: botões 44×44 com ponto 8×8 `--gray`; o ativo vira 22×8 `--ink` (transição .3s). Substituem as setas.
- Cabeçalho `padding 4px 20px 12px`, título 24px. Corpo em bloco `padding 0 20px 28px`; coluna de texto com `margin-top 28px`.
- Miniaturas: "Celular" (print 4:5), "Computador" (print desktop com `contain`), outra tela.
- Rodapé: botões "Abrir demo" e "Ver código" lado a lado (`flex: 1` cada), `gap 10px`, `padding 12px 20px calc(12px + env(safe-area-inset-bottom))`, `border-top 1px solid var(--line)`.

---

## 4. Barra inferior do celular
Mesma barra das outras páginas (Home · meio · Contato). O botão do meio deixa de ser "Próximo sistema" e vira **"Projetos"**: rola suavemente até a grade (com 120px de folga no topo). A luz vermelha da barra fica no meio enquanto a seção Contato não está na tela e vai para Contato quando ela entra.

---

## 5. Dados (um array; trocar conteúdo = editar só ele)

```ts
type Sistema = {
  slug: string;            // ex.: "ja-na-caixa" (para a rota/hash do modal)
  nome: string;
  resumo: string;          // 1 linha, aparece no cartão e no subtítulo do modal
  stack: string[];
  problema: string;
  oQueFaz: string[];       // 3 itens
  meuPapel: string;
  demoUrl?: string;        // ausente → botão "Abrir demo" não aparece
  demoNota?: string;
  codigoUrl: string;
  printDesktop: string;    // 16:9
  printCelular: string;    // 4:5
  video?: string;          // mp4 curto em loop
  telasExtras?: { rotulo: string; src: string }[];
};
```

Conteúdo de exemplo:
1. **JáNaCaixa** — "Controle financeiro pessoal sem planilha." Stack: React, TypeScript, Django, PostgreSQL. Problema: "Anotar gastos em planilha dá trabalho e quase ninguém mantém o hábito. [Revise: o problema com as suas palavras.]" O que faz: "Login real, com botão para entrar como usuário de demonstração.", "[Função 2]", "[Função 3]". Meu papel: "Projeto individual: banco de dados, API em Django e interface em React." Com demo + nota. Código: `https://github.com/[seu-usuario]/ja-na-caixa`.
2. **[Sistema 2]** — placeholders, SEM demo.
3. **[Sistema 3]** — placeholders, com demo.

---

## 6. Acessibilidade (obrigatório)
- Cartão é `<button>` real; Enter/Espaço abre.
- Contraste ≥ 4.5:1 em todo texto, inclusive sobre vidro.
- Alvos de toque ≥ 44px.
- `prefers-reduced-motion`: sem inclinação, sem morph, sem blur no cartão; modal com fade de 0.2s.
