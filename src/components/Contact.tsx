import rabisco from '@/assets/hero-rabisco-lab.png'
import { contacts } from '@/config/contact'
import { ContactCard } from './ContactCard'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="relative overflow-hidden py-24 md:py-40">
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
          <ul className="mt-12 grid border-t border-line bg-white md:mt-18 md:grid-cols-4">
            {contacts.map((contact) => (
              <li key={contact.label} className="border-b border-line md:border-r md:border-b-0 md:last:border-r-0">
                <ContactCard contact={contact} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
