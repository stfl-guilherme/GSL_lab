import type { ContactLink } from '@/config/contact'
import { cn } from '@/lib/utils'
import { Icon } from './Icon'

// Um canal de contato. Celular: ícone | texto | seta numa linha.
// Desktop: card alto, com ícone e seta em cima e o texto embaixo.
// espacoso: no celular, 20px em cima e embaixo em vez de 16px (páginas internas).
export function ContactCard({ contact, espacoso = false }: { contact: ContactLink; espacoso?: boolean }) {
  // links de site abrem em nova aba; "mailto:" abre o app de e-mail
  const external = contact.href.startsWith('http')

  return (
    <a
      href={contact.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={cn(
        'group flex items-center gap-4 px-1 transition-[background-color] duration-300 hover:bg-off hover:text-brand md:min-h-[190px] md:flex-col md:items-stretch md:gap-7 md:px-6 md:pt-7 md:pb-8',
        espacoso ? 'py-5' : 'py-4',
      )}
    >
      {/* "contents" faz esta linha sumir no celular: ícone e seta viram
          filhos diretos do link e a seta vai para o fim com order-3 */}
      <span className="contents md:flex md:items-center md:justify-between">
        <span className="grid size-11 place-items-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white md:size-12">
          <Icon name={contact.icon} />
        </span>
        <Icon
          name="arrow"
          size={18}
          className="order-3 ml-auto text-mute transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-brand md:order-none md:ml-0"
        />
      </span>
      <span className="order-2 md:order-none">
        <span className="block text-[18px] font-extrabold">{contact.label}</span>
        <span className="mt-1.5 block text-[14px] text-mute">{contact.value}</span>
      </span>
    </a>
  )
}
