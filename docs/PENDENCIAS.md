# O que falta — GSL Lab

Lista do que ainda precisa ser feito no site. Marque `[x]` quando concluir.
No código, as pendências de conteúdo também estão marcadas com `TODO`.

## 1. Conteúdo (você precisa me passar)

- [ ] **Capa do 4º vídeo:** salvar como `src/assets/video-4.jpg` e ligar em `src/data/portfolio.ts`. Hoje aparece uma capa escura provisória.
- [ ] **Nome do 4º vídeo:** está como `[Nome do vídeo 4]` em `src/data/portfolio.ts`.
- [ ] **Links dos vídeos:** preencher `url` de cada vídeo em `src/data/portfolio.ts`. Com link, o play do visualizador abre o vídeo em nova aba.
- [ ] **Visualizações × capas:** confirmar qual número (16 mil, 9,9 mil, 7,9 mil, 5,2 mil) vai com qual vídeo.
- [ ] **Contatos reais:** trocar os `[...]` de LinkedIn, Gmail e WhatsApp em `src/config/contact.ts`. O Instagram já está como `@gsl_lab`.
- [ ] **Foto do Sobre:** proporção 4:5; instruções em `src/components/AboutPhoto.tsx`.
- [ ] **Print do site (opcional):** quando o site estiver no ar, trocar o desenho em `src/components/SiteMockup.tsx` por uma imagem real.

- [ ] **Sistemas 2 e 3:** textos (`[...]`), links e prints em `src/data/sistemas.ts` (hoje são `.svg` provisórios). O JáNaCaixa ainda tem `[Função 2]`, `[Função 3]`, a revisão do "problema" e o link da demo.

## 2. Revisão de responsividade

Conferir em 390 px (celular) e 1440 px (desktop), e também nas larguras do meio.

- [x] Sem rolagem horizontal em 390 px e 1440 px.
- [x] Pastas: lado a lado e do mesmo tamanho no desktop; empilhadas no celular, com Sistemas primeiro.
- [ ] **Leque no celular:** com a pasta aberta em 390 px, os arquivos das pontas encostam na borda da tela e o primeiro fica levemente cortado. Ajustar o leque para caber.
- [ ] Larguras intermediárias: 320 px (celular pequeno), 761 px (ponto onde o layout muda para desktop), 1024 px (tablet deitado).
- [ ] Celular deitado (ex.: 844 × 390): o visualizador (lightbox) cabe na altura?
- [ ] Comparar lado a lado com `docs/design/desktop.dc.html` e `docs/design/celular.dc.html` (espaçamentos, tamanhos de texto).
- [ ] Testar num celular de verdade (toque para abrir as pastas, rolagem, texto "Toque numa pasta para abrir").

## 3. Revisão de acessibilidade

- [x] Botões e links de verdade (`<button>` e `<a>`), nada de `<div>` clicável.
- [x] Foco visível (contorno vermelho) em tudo que recebe Tab.
- [x] Pastas pelo teclado: Tab chega na pasta, Enter abre, Tab passa pelos arquivos, Esc fecha e devolve o foco à pasta.
- [x] Arquivos de pasta fechada ficam fora do Tab (`inert`).
- [x] Visualizador: Esc fecha, o foco fica preso dentro dele e volta para o arquivo ao fechar.
- [x] Link "Pular para o conteúdo" no começo da página.
- [x] Imagens decorativas com `alt=""`; imagens de conteúdo com texto alternativo.
- [ ] **Contraste:** medir o cinza dos textos secundários (`--color-mute`) e o vermelho em textos pequenos sobre branco (mínimo 4,5:1).
- [ ] **Leitor de tela:** passar a página com o Orca (Linux) ou TalkBack (Android) e conferir a ordem e os nomes lidos.
- [ ] **Zoom 200%:** o texto continua legível e nada se sobrepõe.
- [ ] Alvos de toque com pelo menos 44 × 44 px no celular (links do topo, cards de contato).
- [ ] Links que abrem em nova aba avisam isso para o leitor de tela (hoje só o play do vídeo avisa).

## 4. Revisão de reduced-motion

Quando o sistema está com "reduzir animações" ligado, o site deve aparecer pronto, sem movimento.

- [x] Regra no fim de `src/index.css` desliga todas as animações e transições.
- [x] Blocos que surgem ao rolar (`Reveal`) e pastas aparecem direto, sem ficar invisíveis.
- [ ] **Testar de verdade:** ligar a opção no sistema (ou simular no DevTools do Chrome: Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`) e conferir hero, pastas, leque e visualizador.
- [ ] Decidir se a inclinação da pasta seguindo o mouse também deve ser desligada (ela é feita por JavaScript, então a regra do CSS só tira a suavidade, não o movimento).
- [ ] Rolagem suave dos links do topo: conferir que vira rolagem instantânea.
- [ ] **Modal da página Sistemas:** com a opção ligada, conferir que o modal só aparece/some com fade (sem crescer do cartão) e que os cartões não inclinam nem ficam borrados. (Testado só com a opção desligada.)

## 5. Deploy (GitHub Pages + GitHub Actions)

- [ ] **Decidir sobre o repositório:** `stfl-guilherme/GSL_lab` está **privado**. No plano gratuito, o GitHub Pages só funciona com repositório público. Opções: deixar público, ou usar outro serviço.
- [ ] Confirmar o nome do repositório (define o `base` do Vite; hoje seria `/GSL_lab/`).
- [ ] Configurar `base` no `vite.config.ts` e conferir que fontes e imagens carregam nesse caminho.
- [ ] **Caminhos das fontes:** `src/index.css` usa `url("/fonts/...")`, que quebra quando o site mora numa subpasta (`/GSL_lab/`). Trocar por um caminho que respeite o `base`. (Os prints de `public/sistemas/` já usam `import.meta.env.BASE_URL` em `src/data/sistemas.ts`.)
- [ ] Criar o workflow `.github/workflows/deploy.yml`.
- [ ] No GitHub: Settings → Pages → Source: GitHub Actions.
- [ ] Abrir o site publicado e repetir o teste rápido no celular.

## 6. Página Sistemas

- [ ] **Pasta Sistemas na home (decidido, falta fazer):** os arquivos do leque passam a vir de `src/data/sistemas.ts`, um por sistema (até 4), com o `printDesktop` de capa. Clicar num arquivo leva para `/#/sistemas` em vez de abrir o visualizador; quando o link direto existir, vai para `/#/sistemas/<slug>` com o modal aberto. O "Este portfólio" e o `SiteMockup.tsx` saem. Motivo: hoje a pasta mostra 1 item que não está na página Sistemas, e cada sistema ficaria cadastrado em dois lugares.
- [ ] **Link direto do modal** (`/#/sistemas/ja-na-caixa`): o estado já é guardado pelo slug em `ProjetosGrade.tsx`; falta a rota ler o slug e abrir o modal.
- [ ] **Selo "Vídeo · em loop, sem som":** a referência diz que ele "some quando houver vídeo". Como isso pareceu invertido, hoje ele aparece SÓ quando o sistema tem `video`. Confirmar.
- [ ] **Tamanho do JavaScript:** com o `motion`, o arquivo principal passou de 365 kB para 523 kB (173 kB comprimido) e o Vite avisa no build. Dá para carregar a página Sistemas só quando alguém entra nela (`React.lazy`) ou usar o `LazyMotion` do motion.

## Fora do escopo agora

- Hero de edição de vídeo ("C", em `docs/design/hero-edicao-futuro.dc.html`): fica para uma página futura.
