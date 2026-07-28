import { Artwork, CommissionOption, SocialPost, Testimonial } from '../types';
import { LUNA_IMAGES } from './lunaImages';

const INITIAL_ARTWORKS: Artwork[] = [
  {
    id: 'art-1',
    title: 'Luna y los Sonidos',
    category: 'personajes',
    categoryLabel: 'Personaje Principal • Luna',
    description: 'Ilustración oficial de Luna, el personaje principal de CamiToons, sumergida en una experiencia musical y atmosférica.',
    imageUrl: LUNA_IMAGES.main,
    aspectRatio: 'landscape',
    tags: ['Luna', 'Personaje Original', 'CamiToons', 'Música', 'Ilustración Digital'],
    year: 2026,
    client: 'Proyecto CamiToons',
    softwareUsed: ['Procreate', 'Photoshop'],
    likesCount: 2450,
    viewsCount: 8900,
    isFeatured: true,
    story: 'Luna es la protagonista absoluta del universo CamiToons. En esta pieza exploro su conexión con la música y los sonidos ambiente, combinando colores vibrantes e iluminación emocional.',
    colorPalette: ['#2A1B3D', '#A239CA', '#4717F6', '#E7DFDD', '#FFB6C1']
  },
  {
    id: 'art-2',
    title: 'Luna: Concepto & Expresiones',
    category: 'personajes',
    categoryLabel: 'Diseño de Personaje',
    description: 'Estudio de pose y expresión de Luna con acabado vectorial y tonos suaves.',
    imageUrl: LUNA_IMAGES.diseno1,
    aspectRatio: 'square',
    tags: ['Luna', 'Character Design', 'Concept Art', 'Expressive', 'Original'],
    year: 2025,
    client: 'Universo CamiToons',
    softwareUsed: ['Clip Studio Paint', 'Photoshop'],
    likesCount: 1890,
    viewsCount: 6200,
    isFeatured: true,
    story: 'Definición de rasgos distintivos y lenguaje corporal para la ropa y expresiones faciales de Luna.',
    colorPalette: ['#0B0C10', '#1F2833', '#C5C6C7', '#66FCF1', '#45A29E']
  },
  {
    id: 'art-3',
    title: 'El Gran Cambio de Luna',
    category: 'fantasia',
    categoryLabel: 'Fantasía & Historia',
    description: 'Ilustración narrativa donde Luna emprende una nueva aventura estética y personal.',
    imageUrl: LUNA_IMAGES.diseno2,
    aspectRatio: 'square',
    tags: ['Luna', 'Cuento', 'Naturaleza', 'Transformación', 'CamiToons'],
    year: 2025,
    client: 'Serie CamiToons',
    softwareUsed: ['Procreate'],
    likesCount: 1750,
    viewsCount: 5400,
    isFeatured: true,
    story: 'Diseñado con un encuadre dinámico para resaltar la evolución temática de Luna a través de su mirada y entorno.',
    colorPalette: ['#7EA04D', '#F4A261', '#E76F51', '#2A9D8F', '#E9C46A']
  },
  {
    id: 'art-4',
    title: 'Luna: Web Design & Arte Interactivo',
    category: 'concept',
    categoryLabel: 'Arte Digital',
    description: 'Composición gráfica de Luna adaptada para entornos digitales y aplicaciones web.',
    imageUrl: LUNA_IMAGES.diseno3,
    aspectRatio: 'square',
    tags: ['Luna', 'Web Art', 'Digital', 'Diseño CamiToons'],
    year: 2026,
    client: 'CamiToons Web',
    softwareUsed: ['Procreate', 'Photoshop'],
    likesCount: 2100,
    viewsCount: 7800,
    isFeatured: false,
    story: 'Versión estilizada creada especialmente para servir como icono de navegación en la plataforma de CamiToons.',
    colorPalette: ['#3A0CA3', '#7209B7', '#F72585', '#4CC9F0', '#4361EE']
  },
  {
    id: 'art-5',
    title: 'Luna: Animation & 3D Style',
    category: 'bocetos',
    categoryLabel: 'Concept Art & Animación',
    description: 'Modelado conceptual de Luna explorando volumen y sombras estilizadas.',
    imageUrl: LUNA_IMAGES.diseno4,
    aspectRatio: 'square',
    tags: ['Luna', 'Animation', '3D Style', 'Estudio'],
    year: 2025,
    client: 'CamiToons Animation',
    softwareUsed: ['Photoshop', 'Wacom Cintiq'],
    likesCount: 1430,
    viewsCount: 4900,
    isFeatured: false,
    story: 'Boceto preliminar para futuros proyectos animados de Luna.',
    colorPalette: ['#1A365D', '#2B6CB0', '#63B3ED', '#BEE3F8', '#FEFCBF']
  },
  {
    id: 'art-6',
    title: 'Luna: Ilustración Digital & Color',
    category: 'infantil',
    categoryLabel: 'Ilustración Digital',
    description: 'Luna rodeada de paletas pasteles y detalles minuciosos.',
    imageUrl: LUNA_IMAGES.diseno5,
    aspectRatio: 'square',
    tags: ['Luna', 'Digital Illustration', 'Pasteles', 'CamiToons'],
    year: 2026,
    client: 'Personal Collection',
    softwareUsed: ['Procreate'],
    likesCount: 1650,
    viewsCount: 5100,
    isFeatured: false,
    story: 'Exploración de la paleta cálida en la vestimenta de Luna.',
    colorPalette: ['#222222', '#D3D3D3', '#FF6B6B', '#4ECDC4']
  },
  {
    id: 'art-7',
    title: 'Luna: Mobile UI & Avatar Art',
    category: 'personajes',
    categoryLabel: 'Diseño de Personajes',
    description: 'Formato optimizado para avatar e interfaz móvil protagonizado por Luna.',
    imageUrl: LUNA_IMAGES.diseno6,
    aspectRatio: 'square',
    tags: ['Luna', 'Avatar', 'Mobile', 'CamiToons'],
    year: 2026,
    client: 'CamiToons App',
    softwareUsed: ['Clip Studio Paint'],
    likesCount: 1980,
    viewsCount: 6700,
    isFeatured: false,
    story: 'Avatar oficial de Luna utilizado para stickers y elementos interactivos en redes.',
    colorPalette: ['#120078', '#9D0191', '#FD3A69', '#FECD1A']
  },
  {
    id: 'art-8',
    title: 'Luna: Desarrollo de Personaje',
    category: 'bocetos',
    categoryLabel: 'Bocetos & Desarrollo',
    description: 'Etapa final de renderizado del personaje de Luna.',
    imageUrl: LUNA_IMAGES.diseno7,
    aspectRatio: 'square',
    tags: ['Luna', 'Boceto', 'Desarrollo', 'CamiToons'],
    year: 2025,
    client: 'CamiToons Studio',
    softwareUsed: ['Procreate'],
    likesCount: 1540,
    viewsCount: 5800,
    isFeatured: false,
    story: 'Una de las versiones más queridas por la comunidad de CamiToons.',
    colorPalette: ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']
  },
  {
    id: 'art-9',
    title: 'CamiToons - Banner Oficial Luna',
    category: 'concept',
    categoryLabel: 'Banner & Branding',
    description: 'Encabezado panorámico oficial de CamiToons con Luna como protagonista.',
    imageUrl: LUNA_IMAGES.banner,
    aspectRatio: 'landscape',
    tags: ['Banner', 'Branding', 'Luna', 'CamiToons'],
    year: 2026,
    client: 'CamiToons Official',
    softwareUsed: ['Photoshop', 'Procreate'],
    likesCount: 3100,
    viewsCount: 12000,
    isFeatured: true,
    story: 'Banner principal diseñado para la cabecera del sitio web y redes sociales de CamiToons.',
    colorPalette: ['#8A2BE2', '#DA70D6', '#FF007F', '#FFFFFF']
  }
];

export const ARTWORKS_DATA: Artwork[] = INITIAL_ARTWORKS;

export const COMMISSION_OPTIONS: CommissionOption[] = [
  {
    id: 'icon-avatar',
    name: 'Icono / Avatar de Personaje (Estilo Luna)',
    category: 'Portrait',
    description: 'Retrato de rostro a hombros al estilo del personaje Luna. Ideal para avatares de Twitch, Discord, Instagram o VTuber.',
    basePrice: 35,
    estimatedDays: 3,
    imageSample: LUNA_IMAGES.diseno6
  },
  {
    id: 'half-body',
    name: 'Personaje Medio Cuerpo (Bust/Waist)',
    category: 'Character',
    description: 'Ilustración de cintura para arriba con pose personalizada, expresiones finas al estilo CamiToons y vestuario detallado.',
    basePrice: 65,
    estimatedDays: 5,
    imageSample: LUNA_IMAGES.diseno1
  },
  {
    id: 'full-body',
    name: 'Personaje Cuerpo Completo (Full Body)',
    category: 'Character',
    description: 'Diseño completo de personaje en pose dinámica, renderizado detallado e iluminación al nivel de Luna.',
    basePrice: 110,
    estimatedDays: 8,
    imageSample: LUNA_IMAGES.diseno2
  },
  {
    id: 'illustration-cover',
    name: 'Ilustración Completa / Escena Escénica',
    category: 'Editorial',
    description: 'Obra como "Luna y los Sonidos" con personaje, fondo complejo, historia y composición de alta resolución.',
    basePrice: 190,
    estimatedDays: 14,
    imageSample: LUNA_IMAGES.main
  }
];

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    platform: 'instagram',
    username: 'CamiToons Art',
    handle: '@camitoons_art',
    avatarUrl: LUNA_IMAGES.diseno6,
    imageUrl: LUNA_IMAGES.main,
    caption: '✨ ¡Novedades de Luna! Les presento "Luna y los sonidos", la ilustración principal de mi universo. ¿Qué les parece su vestuario y energía? 👇🎨 #Luna #CamiToons #DigitalIllustration #OriginalCharacter',
    likes: 2420,
    comments: 184,
    date: 'Hace 2 horas',
    postUrl: 'https://instagram.com'
  },
  {
    id: 'post-2',
    platform: 'tiktok',
    username: 'CamiToons Studio',
    handle: '@camitoons.studio',
    avatarUrl: LUNA_IMAGES.diseno6,
    imageUrl: LUNA_IMAGES.diseno1,
    caption: 'POV: Creando el diseño definitivo de Luna paso a paso en Procreate. 🎬 Speedpaint disponible en mi perfil. #Luna #CamiToons #ArtTok #Speedpaint',
    likes: 4850,
    comments: 312,
    date: 'Ayer',
    postUrl: 'https://tiktok.com',
    videoPreview: true
  },
  {
    id: 'post-3',
    platform: 'artstation',
    username: 'Camila CamiToons',
    handle: 'camitoons',
    avatarUrl: LUNA_IMAGES.diseno6,
    imageUrl: LUNA_IMAGES.banner,
    caption: 'Banner oficial de CamiToons y presentación del personaje original "Luna". Gracias a todos por el apoyo permanente en mi portafolio.',
    likes: 1290,
    comments: 88,
    date: 'Hace 3 días',
    postUrl: 'https://artstation.com'
  },
  {
    id: 'post-4',
    platform: 'instagram',
    username: 'CamiToons Art',
    handle: '@camitoons_art',
    avatarUrl: LUNA_IMAGES.diseno6,
    imageUrl: LUNA_IMAGES.diseno3,
    caption: '🌸 ¡Nuevos stickers de Luna ya disponibles! Envíos a todo el país y digital print. Link en la bio. #Luna #CamiToons #Merch #Stickers',
    likes: 2150,
    comments: 142,
    date: 'Hace 5 días',
    postUrl: 'https://instagram.com'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Profesora Marcela V.',
    role: 'Docente de Educación Básica',
    country: 'Chile',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    text: 'Invitamos a CamiToons a hacer una lectura dramatizada de sus cuentos en nuestro colegio. Los niños quedaron fascinados con las ilustraciones de Luna y la interacción. ¡Un recurso pedagógico hermoso y de gran valor en el aula!',
    rating: 5,
    projectType: 'Visita Escolar & Lectura'
  },
  {
    id: 'test-2',
    author: 'Carolina y Familia',
    role: 'Madre de dos niños (5 y 8 años)',
    country: 'Argentina',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    text: 'Los libros de Luna son los preferidos de mis hijos para la hora de dormir. La calidad de las ilustraciones, los colores y los mensajes sobre las emociones hacen que los leamos una y otra vez.',
    rating: 5,
    projectType: 'Colección de Cuentos Infantiles'
  },
  {
    id: 'test-3',
    author: 'Gonzalo M.',
    role: 'Bibliotecario Infantil & Mediador Lector',
    country: 'México',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    text: 'Los ejemplares independientes de CamiToons son un éxito rotundo en nuestra sección infantil. Recomendamos totalmente sus publicaciones para talleres de fomento lector.',
    rating: 5,
    projectType: 'Fomento Lector & Bibliotecas'
  }
];

export const FAQ_ITEMS = [
  {
    q: '¿Cómo puedo encargar una ilustración personalizada?',
    a: 'Puedes utilizar la calculadora de cotizaciones en esta web para obtener una estimación e ir directamente al formulario de contacto, o enviarme un mensaje detallando tu idea, personaje y referencias.'
  },
  {
    q: '¿Cuáles son los tiempos de entrega promedio?',
    a: 'Para avatares e iconos sencillos suele tomar entre 3 a 5 días laborables. Personajes completos o portadas requieren entre 1 y 2 semanas dependiendo de la complejidad y revisiones.'
  },
  {
    q: '¿Qué métodos de pago aceptas?',
    a: 'Acepto PayPal para clientes internacionales, transferencia bancaria (para Chile/Latam) y Stripe. El proceso se maneja con un 50% de anticipo al aprobar el boceto y 50% previo a la entrega del archivo final en alta resolución.'
  },
  {
    q: '¿Obtengo los derechos de uso comercial?',
    a: 'Por defecto las comisiones personales incluyen derecho de uso privado (redes, impresión personal). Si requieres uso comercial (merchandising, portadas de libros, branding, NFT o videojuegos) se aplica una tarifa de licencia comercial.'
  }
];
