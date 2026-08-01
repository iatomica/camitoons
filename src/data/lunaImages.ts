import { getMediaUrl } from '../utils/media';

export const MEMOTEST_IMAGES = [
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_9l46tk9l46tk9l46s.webp'),
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_bugsgubugsgubugss.webp'),
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_dyn7gqdyn7gqdyn7s.webp'),
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_e7erqfe7erqfe7ers.webp'),
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_fsmgzqfsmgzqfsmgs.webp'),
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_kploabkploabkplos.webp'),
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_qajnlkqajnlkqajns.webp'),
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_vfm0ayvfm0ayvfm0s.webp'),
  getMediaUrl('Imagenes/memotest/Gemini_Generated_Image_xej6k2xej6k2xej6s.webp'),
  getMediaUrl('Imagenes/memotest/baldes.webp'),
  getMediaUrl('Imagenes/memotest/guitarra.webp'),
  getMediaUrl('Imagenes/memotest/torta.webp')
];

export const ESCONDIDAS_IMAGES = [
  getMediaUrl('Imagenes/escondidas/los panaderos.webp'),
  getMediaUrl('Imagenes/escondidas/Los cinco patitos.webp'),
  getMediaUrl('Imagenes/escondidas/La odontologa.webp'),
  getMediaUrl('Imagenes/escondidas/la escuela.webp'),
  getMediaUrl('Imagenes/escondidas/la amiga de luna.webp'),
  getMediaUrl('Imagenes/escondidas/el abuelo.webp')
];

export const DIFERENCIAS_PAIRS = [
  { id: 'level-1', title: 'El arbolito', original: getMediaUrl('Imagenes/diferencias/arbolito original.webp'), modified: getMediaUrl('Imagenes/diferencias/arbolito diferencias.webp') },
  { id: 'level-2', title: 'El charco y las botas', original: getMediaUrl('Imagenes/diferencias/botas original.webp'), modified: getMediaUrl('Imagenes/diferencias/botas diferencias.webp') },
  { id: 'level-3', title: 'Los exploradores', original: getMediaUrl('Imagenes/diferencias/exploradores original.webp'), modified: getMediaUrl('Imagenes/diferencias/exploradores diferencias.webp') },
  { id: 'level-4', title: 'El jardín', original: getMediaUrl('Imagenes/diferencias/jardin original.webp'), modified: getMediaUrl('Imagenes/diferencias/jardin Diferencias.webp') },
  { id: 'level-5', title: 'El campo y los caballos', original: getMediaUrl('Imagenes/diferencias/Caballos original.webp'), modified: getMediaUrl('Imagenes/diferencias/Caballos diferencias.webp') },
  { id: 'level-6', title: 'Luna y su papá', original: getMediaUrl('Imagenes/diferencias/lunaysupapa original.webp'), modified: getMediaUrl('Imagenes/diferencias/lunaysupapa Diferencias.webp') },
  { id: 'level-7', title: 'Luna y la playa', original: getMediaUrl('Imagenes/diferencias/playa original.webp'), modified: getMediaUrl('Imagenes/diferencias/playa Diferencias.webp') },
  { id: 'level-8', title: 'El juego favorito', original: getMediaUrl('Imagenes/diferencias/bloques original.webp'), modified: getMediaUrl('Imagenes/diferencias/bloques diferencias.webp') }
];

export const LUNA_IMAGES = {
  banner: getMediaUrl('Imagenes/CamiToonsLogo.webp'),
  main: getMediaUrl('Imagenes/rompecabezas/10.jpeg'),
  portadaWeb: getMediaUrl('Imagenes/personajes/luna-portada-web.jpeg'),
  abuelaElsa: getMediaUrl('Imagenes/personajes/arbol de vinculos/abuela-elsa-tree.webp'),
  abueloAngel: getMediaUrl('Imagenes/personajes/arbol de vinculos/abuelo-angel-tree.webp'),
  hermana: getMediaUrl('Imagenes/personajes/arbol de vinculos/hermana-tree.webp'),
  hermano: getMediaUrl('Imagenes/personajes/arbol de vinculos/hermano-tree.webp'),
  mama: getMediaUrl('Imagenes/personajes/arbol de vinculos/mama-tree.webp'),
  papa: getMediaUrl('Imagenes/personajes/arbol de vinculos/papa-tree.webp'),
  jazmin: getMediaUrl('Imagenes/personajes/arbol de vinculos/jazmin-tree.webp'),
  amigosPares: getMediaUrl('Imagenes/personajes/arbol de vinculos/amigos-pares-tree.webp'),
  lunaCentral: getMediaUrl('Imagenes/personajes/arbol de vinculos/luna-tree.webp'),
  anana: getMediaUrl('Imagenes/personajes/arbol de vinculos/anana-tree.webp'),
  marcos: getMediaUrl('Imagenes/personajes/arbol de vinculos/marcos-tree.webp'),
  prima: getMediaUrl('Imagenes/personajes/arbol de vinculos/prima-tree.webp'),
  diseno1: getMediaUrl('Imagenes/rompecabezas/1.jpeg'),
  diseno2: getMediaUrl('Imagenes/rompecabezas/2.jpeg'),
  diseno3: getMediaUrl('Imagenes/rompecabezas/4.jpeg'),
  diseno4: getMediaUrl('Imagenes/rompecabezas/5.jpeg'),
  diseno5: getMediaUrl('Imagenes/rompecabezas/6.jpeg'),
  diseno6: getMediaUrl('Imagenes/rompecabezas/8.jpeg'),
  diseno7: getMediaUrl('Imagenes/rompecabezas/9.jpeg'),
  camiPhoto: getMediaUrl('Imagenes/cami autora.webp'),
  camiAuthor: getMediaUrl('Imagenes/cami autora.webp'),
  memotest: MEMOTEST_IMAGES,
  escondidas: ESCONDIDAS_IMAGES,
  diferencias: DIFERENCIAS_PAIRS,
  escB: getMediaUrl('Imagenes/escondidas/ananá.webp'),
  escC: getMediaUrl('Imagenes/escondidas/el sapo.webp'),
  escE: getMediaUrl('Imagenes/escondidas/el hermanito .webp'),
  escF: getMediaUrl('Imagenes/escondidas/Luna y el tren.webp'),
  escG: getMediaUrl('Imagenes/escondidas/el gato marcos.webp'),
  escH: getMediaUrl('Imagenes/escondidas/el elefante oculto.webp'),
  escV: getMediaUrl('Imagenes/escondidas/el parque y los perros .webp'),
  escGM: getMediaUrl('Imagenes/escondidas/la hermana de luna .jpeg'),
  tarjetas: {
    luna: getMediaUrl('Imagenes/personajes/arbol de vinculos/luna-tp.webp'),
    abuelaElsa: getMediaUrl('Imagenes/personajes/arbol de vinculos/abuela-elsa-tp.webp'),
    abueloAngel: getMediaUrl('Imagenes/personajes/arbol de vinculos/abuelo-angel-tp.webp'),
    hermana: getMediaUrl('Imagenes/personajes/arbol de vinculos/hermana-tp.webp'),
    hermano: getMediaUrl('Imagenes/personajes/arbol de vinculos/hermano-tp.webp'),
    mama: getMediaUrl('Imagenes/personajes/arbol de vinculos/mama-tp.webp'),
    papa: getMediaUrl('Imagenes/personajes/arbol de vinculos/papa-tp.webp'),
    jazmin: getMediaUrl('Imagenes/personajes/arbol de vinculos/jazmin-tp.webp'),
    amigosPares: getMediaUrl('Imagenes/personajes/arbol de vinculos/amigos-pares-tp.webp'),
    anana: getMediaUrl('Imagenes/personajes/arbol de vinculos/anana-tp.webp'),
    marcos: getMediaUrl('Imagenes/personajes/arbol de vinculos/marcos-tp.webp'),
    prima: getMediaUrl('Imagenes/personajes/arbol de vinculos/prima-tp.webp')
  }
};
