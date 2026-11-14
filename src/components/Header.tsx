import type { MouseEvent } from 'react'
import { Link } from 'react-router'
import logo from '@/assets/gsl.png'
import { scrollToSection } from '@/lib/scroll'

const links = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'trabalhos', label: 'O que eu faço' },
  { id: 'contato', label: 'Contato' },
]

// Continuam sendo <a> (Tab, Enter e leitor de tela tratam como link), mas o
// clique é interceptado: preventDefault impede o navegador de trocar o "#"
// da URL, o que o HashRouter leria como mudança de rota.
function go(id: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToSection(id)
  }
}

interface HeaderProps {
  // 'home'   → logo rola ao topo + links das seções (padrão)
  // 'pagina' → só o logo, que leva de volta à home (páginas internas)
  variant?: 'home' | 'pagina'
}

const logoClass = 'inline-flex min-h-11 items-center'
const logoImgClass = 'h-7 w-auto md:h-[38px]'

export function Header({ variant = 'home' }: HeaderProps) {
  return (
    <header className="wrap relative z-10 flex h-[72px] items-center justify-between md:h-[88px]">
      {variant === 'home' ? (
        <a href="#topo" onClick={go('topo')} className={logoClass}>
          <img src={logo} alt="GSL Lab — voltar ao início" className={logoImgClass} />
        </a>
      ) : (
        // <Link> é o <a> do react-router: troca a rota sem recarregar a página
        <Link to="/" className={logoClass}>
          <img src={logo} alt="GSL Lab — ir para a página inicial" className={logoImgClass} />
        </Link>
      )}

      {variant === 'home' && (
        <nav aria-label="Seções" className="flex gap-[18px] text-[13px] font-medium md:gap-9 md:text-[14px]">
          {links.map((link) => (
            // "group" deixa o filho (o sublinhado) reagir ao hover do link
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={go(link.id)}
              className="group relative inline-flex min-h-11 items-center hover:text-brand"
            >
              {link.label}
              <span className="absolute inset-x-0 bottom-2 h-[1.5px] origin-left scale-x-0 bg-brand transition-transform duration-[350ms] group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
