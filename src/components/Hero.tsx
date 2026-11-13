import gsl from '@/assets/hero-gsl.png'
import lab from '@/assets/hero-lab.png'
import rabisco from '@/assets/hero-rabisco.png'

// As três imagens têm exatamente o mesmo tamanho (1400 × 884) e foram
// recortadas na mesma posição do logo. Por isso basta empilhá-las uma
// sobre a outra (absolute inset-0) para remontar o logo perfeitamente.
//
// Sequência (os tempos estão no index.css, classes .hero-*):
//   0,1 s  rabisco aparece com fade
//   0,6 s  GSL é revelado da esquerda para a direita + LAB aparece
//   1,5 s  frase de apoio sobe
export function Hero() {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="relative flex min-h-[620px] flex-col items-center justify-center md:min-h-[760px]"
    >
      <h1 id="hero-titulo" className="sr-only">
        GSL Lab — Guilherme, desenvolvedor, designer e editor de vídeo
      </h1>

      {/* alt vazio: as imagens são decorativas, o título acima já diz o que é */}
      <div className="relative -mt-5 aspect-[1400/884] w-full max-w-[880px] md:-mt-10">
        <img src={rabisco} alt="" className="hero-rabisco absolute inset-0 size-full" />
        <img src={lab} alt="" className="hero-lab absolute inset-0 size-full" />
        <img src={gsl} alt="" className="hero-gsl absolute inset-0 size-full" />
      </div>

      <p className="hero-frase mt-2 px-5 text-center text-tagline">Sites, design e edição de vídeo.</p>
    </section>
  )
}
