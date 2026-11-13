import gsl from '@/assets/hero-gsl.png'
import rabisco from '@/assets/hero-rabisco-lab.png'

// "Print" do próprio site feito com HTML, para a capa do arquivo da pasta Sites.
// TODO: quando o site estiver no ar, troque por um print de verdade (imagem).
export function SiteMockup() {
  return (
    <span aria-hidden="true" className="relative block aspect-[16/10] w-full overflow-hidden bg-white">
      <span className="flex h-[12%] items-center gap-1 border-b border-line bg-off px-[5%]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-[5px] rounded-full bg-rabisco" />
        ))}
      </span>
      <span className="flex items-center justify-between px-[6%] pt-[4%]">
        <span className="h-1.5 w-[9%] rounded-sm bg-brand" />
        <span className="flex w-[30%] justify-end gap-[6%]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[3px] flex-1 rounded-sm bg-rabisco" />
          ))}
        </span>
      </span>
      <span className="relative mx-auto mt-[4%] block aspect-[1400/884] w-[52%]">
        <img src={rabisco} alt="" className="absolute inset-0 size-full" />
        <img src={gsl} alt="" className="absolute inset-0 size-full" />
      </span>
      <span className="mx-auto mt-[3%] block h-1 w-[30%] rounded-sm bg-ink/60" />
    </span>
  )
}
