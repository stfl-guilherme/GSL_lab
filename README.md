# GSL Lab — site-portfólio

One-page em **Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui**.

## Rodar

```bash
npm install      # instala as dependências (uma vez)
npm run dev      # abre em http://localhost:5173 e recarrega ao salvar
npm run lint     # confere o código
npm run build    # gera a versão final em dist/
```

## Onde fica cada coisa

```
src/
├── main.tsx              liga o React na <div id="root"> do index.html
├── App.tsx               a página: só a lista de seções, em ordem
├── index.css             Tailwind + cores da marca + fontes + animações
├── data/portfolio.ts     conteúdo das pastas (sistemas, artes, vídeos)
├── config/contact.ts     links de contato
├── hooks/
│   ├── useInView.ts      avisa quando um elemento aparece na tela (1ª vez)
│   └── useMediaQuery.ts  lê uma media query do CSS (ex.: "tem mouse?")
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx          rabisco em fade → GSL + LAB → frase
│   ├── About.tsx         + AboutPhoto.tsx (lugar da foto)
│   ├── Work.tsx          seção das pastas; guarda qual pasta está aberta
│   ├── Folder.tsx        uma pasta de vidro (hover, abrir, leque)
│   ├── FolderBack.tsx    arte do fundo de cada pasta
│   ├── FolderCard.tsx    um arquivo dentro da pasta (+ CardThumb.tsx, a capa)
│   ├── SiteMockup.tsx    "print" do site (capa do arquivo da pasta Sistemas)
│   ├── Lightbox.tsx      visualizador (+ LightboxMedia.tsx, o conteúdo)
│   ├── Contact.tsx       + ContactCard.tsx
│   ├── Footer.tsx
│   ├── Reveal.tsx        faz um bloco surgir ao rolar
│   ├── Eyebrow.tsx       rótulo vermelho acima dos títulos
│   ├── Icon.tsx          todos os ícones, escolhidos pela prop "name"
│   └── ui/dialog.tsx     componente do shadcn/ui usado pelo Lightbox
└── assets/               imagens (o Vite otimiza e dá nome único no build)
public/
├── favicon.png
└── fonts/                Garet Book e Heavy (.woff2)
docs/design/              arquivos do design (fonte da verdade)
```

## A lógica, em 4 ideias

1. **Conteúdo separado da aparência.** Os componentes não sabem quais artes existem: recebem a lista de `data/portfolio.ts` e desenham. Trocar nome, visualizações ou link = mexer só nesse arquivo (contatos: `config/contact.ts`).
2. **Componentes recebem dados por props.** `Folder` recebe `folder`, `isOpen`, `onToggle`… e só avisa "fui clicada". Quem decide qual pasta está aberta é o `Work`, com `useState`. Como o estado mora no pai, abrir uma pasta fecha a outra.
3. **Animações em CSS.** As entradas são `@keyframes` no `index.css`. O React só liga ou desliga classes (`is-visible`, `is-open`, `is-assembled`). Uma única regra no fim do CSS respeita "reduzir animações".
4. **Mobile first.** Classes sem prefixo valem para o celular; `md:` vale a partir de 761 px (o ponto de troca do design). Ex.: `grid md:grid-cols-3`.

## Pendências (procure por `TODO` no código)

- **video-4.jpg:** falta a capa do 4º vídeo (`src/assets/`); até lá aparece uma capa provisória.
- **Links dos vídeos:** preencha `url` em cada vídeo (`data/portfolio.ts`). Com link, o play do visualizador abre o vídeo.
- **Visualizações × capas:** confirme qual número vai com qual vídeo.
- **Contato:** troque os `[...]` em `config/contact.ts` pelos dados reais.
- **Foto do Sobre:** instruções em `AboutPhoto.tsx`.
- **Deploy:** GitHub Pages com GitHub Actions (ainda não configurado).

Lista completa, com as revisões de responsividade, acessibilidade e reduced-motion: [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md).
