import { Route, Routes } from 'react-router'
import { EdicaoVideo } from '@/pages/EdicaoVideo'
import { Home } from '@/pages/Home'
import { Sistemas } from '@/pages/Sistemas'

// Cada <Route> liga um caminho (o que vem depois de "#" na URL) a uma página.
//   /#/                 → Home
//   /#/edicao-de-video  → Edição de vídeo
//   /#/sistemas         → Sistemas
// Caminho desconhecido cai na Home ("*" = qualquer coisa).
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/edicao-de-video" element={<EdicaoVideo />} />
      <Route path="/sistemas" element={<Sistemas />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
