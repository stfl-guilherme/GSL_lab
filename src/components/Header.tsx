import logo from '@/assets/gsl.png'

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#trabalhos', label: 'O que eu faço' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  return (
    <header className="wrap relative z-10 flex h-[72px] items-center justify-between md:h-[88px]">
      <a href="#topo" className="inline-flex min-h-11 items-center">
        <img src={logo} alt="GSL Lab — voltar ao início" className="h-7 w-auto md:h-[38px]" />
      </a>

      <nav aria-label="Seções" className="flex gap-[18px] text-[13px] font-medium md:gap-9 md:text-[14px]">
        {links.map((link) => (
          // "group" deixa o filho (o sublinhado) reagir ao hover do link
          <a
            key={link.href}
            href={link.href}
            className="group relative inline-flex min-h-11 items-center hover:text-brand"
          >
            {link.label}
            <span className="absolute inset-x-0 bottom-2 h-[1.5px] origin-left scale-x-0 bg-brand transition-transform duration-[350ms] group-hover:scale-x-100" />
          </a>
        ))}
      </nav>
    </header>
  )
}
