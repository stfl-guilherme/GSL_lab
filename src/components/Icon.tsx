import type { ReactNode, SVGProps } from 'react'
import { cn } from '@/lib/utils'

// Ícones de linha do design, sem biblioteca. "currentColor" faz o ícone
// usar a cor do texto em volta, então dá para mudar a cor com text-*.
const paths = {
  arrow: <path d="M7 17L17 7M9 7h8v8" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  play: <path d="M8 5.5v13l10-6.5z" />,
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  hand: (
    <>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 10.5V9a1.5 1.5 0 0 1 3 0v2" />
      <path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.5a6 6 0 0 1-5-2.7L4 15a1.5 1.5 0 0 1 2.5-1.7L9 16" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10.5V17" />
      <circle cx="8" cy="7.4" r="1.1" fill="currentColor" stroke="none" />
      <path d="M12 17v-6.5M12 13.5a2.6 2.6 0 0 1 5 0V17" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.6a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.3-4.4a8.5 8.5 0 1 1 15.7-4.5z" />
      <path d="M9 8.6c.2 2.9 2.6 5.5 5.6 6.1l1.2-1.4-1.9-1-1 .8a4.4 4.4 0 0 1-2.2-2.3l.8-1-.9-2z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
} satisfies Record<string, ReactNode>

// "keyof typeof paths" = a lista dos nomes acima: 'arrow' | 'close' | …
// Um nome que não existe vira erro no editor.
export type IconName = keyof typeof paths

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 22, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}
