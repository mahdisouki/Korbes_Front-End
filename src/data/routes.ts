export const routes = {
  home: '/',
  about: '/la-station',
  treatments: '/soins',
  gallery: '/galerie',
  practical: '/informations',
  contact: '/contact',
  vouchers: '/bons',
  account: '/compte',
  login: '/compte/connexion',
  register: '/compte/inscription',
  forgot: '/compte/mot-de-passe',
  guestAccess: '/commande/acces',
} as const

export function voucherPath(slug: string) {
  return `${routes.vouchers}/${slug}`
}

export function orderPath(id: string) {
  return `/commande/${id}`
}

export function treatmentPath(slug: string) {
  return `${routes.treatments}/${slug}`
}
