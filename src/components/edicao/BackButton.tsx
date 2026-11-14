import { ArrowLeft } from 'lucide-react'
import { useVoltarAoInicio } from '@/hooks/useVoltarAoInicio'

// Botão flutuante de voltar, só no desktop (no celular quem faz isso é a
// barra de baixo). "hidden md:grid" = escondido até 761px, depois aparece.
export function BackButton() {
  const voltar = useVoltarAoInicio()

  return (
    <button
      type="button"
      onClick={voltar}
      aria-label="Voltar ao início"
      className="fixed top-1/2 left-6 z-30 hidden size-16 -translate-y-1/2 cursor-pointer place-items-center rounded-xl border border-line bg-white shadow-[0_8px_24px_rgb(43_43_46/.10)] transition-colors duration-300 hover:text-brand md:grid"
    >
      <ArrowLeft className="size-6" />
    </button>
  )
}
