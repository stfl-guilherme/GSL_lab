import { Route, Routes } from 'react-router'
import { EdicaoVideo } from '@/pages/EdicaoVideo'
import { Home } from '@/pages/Home'

// Cada <Route> liga um caminho (o que vem depois de "#" na URL) a uma página.
//   /#/                 → Home
//   /#/edicao-de-video  → Edição de vídeo
// Caminho desconhecido cai na Home ("*" = qualquer coisa).
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/edicao-de-video" element={<EdicaoVideo />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
