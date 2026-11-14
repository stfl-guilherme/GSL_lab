import rabisco from '@/assets/hero-rabisco-lab.png'
import { contacts } from '@/config/contact'
import { cn } from '@/lib/utils'
import { ContactCard } from './ContactCard'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

interface ContactProps {
  // 'home' (padrão) = como sempre foi. 'pagina' = páginas internas, que no
  // CELULAR têm mais respiro. No desktop as duas são iguais.
  variant?: 'home' | 'pagina'
}

export function Contact({ variant = 'home' }: ContactProps) {
  const pagina = variant === 'pagina'

  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className={cn('relative overflow-hidden md:py-40', pagina ? 'py-32' : 'py-24')}
    >
      <img
        src={rabisco}
        alt=""
        className="pointer-events-none absolute top-6 right-[-38%] w-[440px] max-w-none md:top-15 md:right-[-6%] md:w-[700px]"
      />

      <div className="wrap relative">
        <Reveal>
          <Eyebrow>Contato</Eyebrow>
          <h2 id="contato-titulo" className="text-display">
            Tem uma ideia?
            <br />
            <span className="text-brand">Vamos conversar.</span>
          </h2>
          <p className="mt-6 text-[18px] text-mute">Respondo por qualquer um destes canais.</p>
        </Reveal>

        <Reveal delay={1}>
          <ul className={cn('grid border-t border-line bg-white md:mt-18 md:grid-cols-4', pagina ? 'mt-16' : 'mt-12')}>
            {contacts.map((contact) => (
              <li key={contact.label} className="border-b border-line md:border-r md:border-b-0 md:last:border-r-0">
                <ContactCard contact={contact} espacoso={pagina} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
