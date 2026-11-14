import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App'

// Ponto de entrada: o React assume a <div id="root"> do index.html.
// HashRouter: a rota fica depois do "#" (/#/edicao-de-video). O GitHub Pages
// só serve arquivos que existem; com o "#", o servidor sempre entrega o
// index.html e quem lê a rota é o React, então o F5 não dá 404.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
