// Seus canais de contato. Troque os valores entre colchetes pelos reais.
//   label → nome do canal
//   value → texto que aparece embaixo do nome
//   href  → para onde o clique leva
import type { IconName } from '@/components/Icon'

export interface ContactLink {
  label: string
  value: string
  href: string
  icon: IconName
}

export const contacts: ContactLink[] = [
  // TODO: trocar [seu-perfil]
  { label: 'LinkedIn', value: '/in/[seu-perfil]', href: 'https://www.linkedin.com/in/[seu-perfil]', icon: 'linkedin' },
  // TODO: trocar [seu-email]
  { label: 'Gmail', value: '[seu-email]@gmail.com', href: 'mailto:[seu-email]@gmail.com', icon: 'mail' },
  // TODO: trocar pelo número. No href vão só dígitos: 55 + DDD + número
  { label: 'WhatsApp', value: '(55) [seu número]', href: 'https://wa.me/55[DDD-e-número]', icon: 'whatsapp' },
  { label: 'Instagram', value: '@gsl_lab', href: 'https://www.instagram.com/gsl_lab/', icon: 'instagram' },
]
