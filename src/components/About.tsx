import { AboutPhoto } from './AboutPhoto'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

const facts = [
  { label: 'Base', value: 'Júlio de Castilhos/RS' },
  { label: 'Estudo', value: 'Sistemas de Informação' },
  { label: 'Faço', value: 'Sistemas, design e vídeo' },
]

export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="py-24 md:py-40">
      {/* mobile first: uma coluna; a partir de md, duas (5 partes + 7 partes) */}
      <div className="wrap grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-24">
        <Reveal>
          <AboutPhoto />
        </Reveal>

        <Reveal delay={1}>
          <Eyebrow>Sobre</Eyebrow>
          <h2 id="sobre-titulo" className="text-title">
            Oi, eu sou o Guilherme.
          </h2>
          <p className="mt-7 max-w-[580px] text-[17px] leading-[1.6] md:text-[20px]">
            Estudo Sistemas de Informação e trabalho em três frentes que se completam:
            desenvolvimento, design e edição de vídeo.
          </p>
          <p className="mt-4 max-w-[580px] text-[17px] leading-[1.6] md:text-[20px]">
            Nasci em Pinhal Grande e cresci em Júlio de Castilhos, no interior do Rio Grande do Sul.
            A GSL Lab é onde eu junto tudo isso.
          </p>

          <dl className="mt-9 grid md:mt-13 md:grid-cols-3 md:gap-6">
            {facts.map((fact) => (
              <div key={fact.label} className="border-t border-line py-3.5 md:pt-4 md:pb-0">
                <dt className="text-[11px] tracking-[.2em] text-mute uppercase">{fact.label}</dt>
                <dd className="mt-2 text-[15px] leading-[1.45] font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
