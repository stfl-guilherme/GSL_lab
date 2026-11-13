import logo from '@/assets/logo-completo.png'

export function Footer() {
  const year = new Date().getFullYear() // atualiza sozinho a cada ano

  return (
    <footer className="border-t border-line pt-10 pb-12">
      <div className="wrap flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <img src={logo} alt="GSL Lab — Desenvolvendo ideias" className="h-auto w-[120px]" />
        <p className="text-[13px] text-mute">Júlio de Castilhos/RS</p>
        <p className="text-[13px] text-mute">© {year} GSL Lab</p>
      </div>
    </footer>
  )
}
