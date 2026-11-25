# Referência — Página Sistemas: hero "Editor de código"

Extraído do protótipo aprovado no Claude Design (artboard `Sistemas-Grade`). Fica acima da seção Projetos. Fonte: Garet (no protótipo, Montserrat como substituta); código em JetBrains Mono (Google Fonts, pesos 400 e 500).

## Ideia
À esquerda, um editor de código "digita" um componente React que escreve o título. À direita, uma "Prévia" mostra o título aparecendo ao mesmo tempo, letra por letra. Depois surge a frase de apoio.

## Layout
- `section.hero`: `min-height: 812px` (celular 648px), flex em coluna centralizado na vertical, `padding: 16px 0 72px` (celular `8px 0 72px`). Dentro do container padrão.
- Eyebrow "GSL Lab · Sistemas" (vermelho, 12px, caixa alta, `letter-spacing .24em`, `margin-bottom 20px`), entra com subida de 16px em 0.8s, atraso 0.1s.
- `h1` só para leitores de tela (visualmente oculto): "Desenvolvimento de sistemas." O editor e a prévia são `aria-hidden`.
- Grade: `grid-template-columns: minmax(0,440px) minmax(0,1fr); gap: 72px; align-items: center; margin-top: 12px`. Celular: 1 coluna, `gap 28px`, editor em cima.

## Editor (esquerda)
- Caixa: borda 1px `--line`, raio 14px, fundo branco, `overflow hidden`, JetBrains Mono 14px / `line-height 26px` (celular 12px / 22px). Entra com subida de 16px, 0.6s, atraso 0.15s.
- Barra: altura 40px (celular 36px), fundo `--off`, borda inferior `--line`, `padding 0 16px`, `gap 16px`: três bolinhas 8×8 `--rabisco` (gap 6px) + nome do arquivo "Hero.tsx" (12px `--mute`).
- Corpo: `padding 14px 0 18px` (celular `10px 0 14px`). Cada linha: número à esquerda (coluna de 48px, celular 34px, alinhado à direita, `padding-right 18px`/12px, `--mute` 55% de opacidade) + código com `white-space: pre`.
- Linha em digitação: fundo `--off` e número com opacidade 1.
- Cores do código: palavras-chave (`export`, `function`, `return`) em vermelho peso 500; nome da função (`Hero`) em grafite peso 500; tags e pontuação em `--mute`; texto em grafite; a palavra "sistemas." em vermelho.
- Código digitado (indentação em espaços):
  ```
  export function Hero() {
    return (
      <h1>
        Desenvolvimento de{" "}
        <em>sistemas.</em>
      </h1>
    );
  }
  ```
- Cursor: barra vermelha 2px × 1.2em, na posição de digitação.

## Prévia (direita)
- Rótulo "PRÉVIA": 11px, caixa alta, `letter-spacing .2em`, `--mute`, seguido de uma linha 1px `--line` que ocupa o resto da largura (gap 12px), `margin-bottom 20px`. Entra com fade 0.6s, atraso 0.2s.
- Título: Heavy, `font-size: clamp(30px, 9.4cqi, 72px)`, `line-height .98`, `letter-spacing -.035em`, `min-height: 1.96em` (reserva duas linhas e evita pulo do layout). "Desenvolvimento de " em grafite, "sistemas." em vermelho.
- O título da prévia só começa a aparecer quando a tag `<h1>` termina de ser digitada no editor e cresce junto com o texto digitado. Cursor vermelho no fim (largura `.06em`, mínimo 3px, altura `.82em`).
- Frase de apoio: 18px (celular 16px), `line-height 1.55`, `max-width 520px`, `margin-top 28px` (celular 20px): "Sistemas web do banco de dados à interface, pensados para funcionar bem no celular." Entra com subida de 16px, 0.6s, atraso 2.5s.

## Tempo (um relógio só, em ms desde a montagem)

> **Ajustado no site (25/11/2026), a pedido: hero mais rápido.** Valores em uso: nada digitado até 200; digita de 200 a 1500; cursor some em 1600; fim em 1900; frase de apoio com atraso de 1,4 s. Os números abaixo são os do protótipo original.
- 0–350: nada digitado.
- 350–2550: digita todos os caracteres em ritmo constante (cada quebra de linha conta como 1 caractere).
- 2650: os dois cursores somem.
- 3100: fim; para o `requestAnimationFrame`.
- Movimento reduzido: começa direto no estado final (tudo digitado, sem cursor, sem animações de entrada).
