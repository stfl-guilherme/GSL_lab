import rabisco from '@/assets/hero-rabisco-lab.png'
import { Icon } from './Icon'

// Lugar da foto, na proporção 4:5.
// TODO: quando tiver a foto, coloque em src/assets, importe aqui e troque o
// conteúdo da <div> por:
//   <img src={foto} alt="Guilherme, da GSL Lab" className="absolute inset-0 size-full object-cover" />
export function AboutPhoto() {
  return (
    <div className="relative flex aspect-[4/5] items-end overflow-hidden rounded-[20px] bg-off p-5">
      <img
        src={rabisco}
        alt=""
        className="absolute top-[42%] left-1/2 w-[155%] max-w-none -translate-x-1/2 -translate-y-1/2"
      />
      <span className="relative inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-[9px] text-[12px] text-mute">
        <Icon name="camera" size={16} />
        Sua foto aqui · 4:5
      </span>
    </div>
  )
}
