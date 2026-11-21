import type { PhotoCredit } from '../types/index.ts'

export const photoCredits: PhotoCredit[] = [
  {
    file: '/images/sunset.jpg',
    author: 'Smailtn',
    license: 'CC0',
    source: 'https://commons.wikimedia.org/wiki/File:Sunset_from_Korbous_Tunisia.jpg',
  },
  {
    file: '/images/cotes.jpg',
    author: 'Smailtn',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Les_c%C3%B4tes_de_Korbous_Takelsa.jpg',
  },
  {
    file: '/images/crique.jpg',
    author: 'Smailtn',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Crique_Millefeuille.jpg',
  },
  {
    file: '/images/rocheuse.jpg',
    author: 'Smailtn',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Plage_Rocheuse_Korbous.jpg',
  },
  {
    file: '/images/coucher.jpg',
    author: 'Smailtn',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Plage_de_Korbous_au_coucher.jpg',
  },
  {
    file: '/images/lune.jpg',
    author: 'Smailtn',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Lever_lune_sur_Korbous.jpg',
  },
  {
    file: '/images/kanassira.jpg',
    author: 'Smailtn',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:%D8%B9%D9%8A%D9%86_%D9%83%D9%86%D8%A7%D8%B3%D9%8A%D8%B1%D8%A9_-_%D9%82%D8%B1%D8%A8%D8%B5.jpg',
  },
  {
    file: '/images/falaise.jpg',
    author: 'Selma Jmii',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Baie_Falaise.JPG',
  },
  {
    file: '/images/ville.jpg',
    author: 'DrFO.Jr.Tn',
    license: 'CC BY 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Korbous.jpg',
  },
  {
    file: '/images/station.jpg',
    author: 'Chris68',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:KORBOUS.jpg',
  },
  {
    file: '/images/rue-01.jpg',
    author: 'GIRAUD Patrick',
    license: 'CC BY 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:TUNISIE_KORBOUS_01.JPG',
  },
  {
    file: '/images/rue-02.jpg',
    author: 'GIRAUD Patrick',
    license: 'CC BY 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:TUNISIE_KORBOUS_02.JPG',
  },
  {
    file: '/images/colline.jpg',
    author: 'Aichatti',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Korbous_2.JPG',
  },
  {
    file: '/images/source.jpg',
    author: 'Asram',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Korbous_ain.jpg',
  },
]

export function creditFor(src: string) {
  return photoCredits.find((credit) => credit.file === src)
}
