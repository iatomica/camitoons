import { Artwork } from '../types';
import { getMediaUrl } from '../utils/media';

const SAMPLE_ARTWORK_PATHS = [
  'images/catalog/TERMINADOS/1 luna y los sonidos-/1.webp',
  'images/catalog/TERMINADOS/2 luna se mueve-/1.webp',
  'images/catalog/TERMINADOS/3 luna y el campo-/1.webp',
  'images/catalog/TERMINADOS/4 luna y su chupete-/1.webp',
  'images/catalog/TERMINADOS/5 luna es asi-/1.webp',
  'images/catalog/TERMINADOS/7 luna y los sabores-/1.webp',
  'images/catalog/TERMINADOS/8 luna y su juguete-/1.webp',
  'images/catalog/TERMINADOS/9 luna encuentra colores-/1.webp',
  'images/catalog/TERMINADOS/10 luna y la familia-/1.webp',
  'images/catalog/TERMINADOS/11 luna planta un arbol-/1.webp',
  'images/catalog/TERMINADOS/12 luna y la selva-/1.webp',
  'images/catalog/TERMINADOS/13 luna se lava los dientes-/1.webp',
  'images/catalog/TERMINADOS/14 luna y el primer dia-/1.webp',
  'images/catalog/TERMINADOS/15 luna y el gran cambio-/1.webp',
  'images/catalog/TERMINADOS/16 luna y el arcoiris-/1.webp',
  'images/catalog/TERMINADOS/17 luna y las estaciones-/1.webp',
  'images/catalog/TERMINADOS/18 luna y las formas-/1.webp',
  'images/catalog/TERMINADOS/19 luna y los oficios-/1.webp'
];

function formatTitleFromPath(filePath: string): string {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1].replace(/\.webp$/i, '');
  const parentFolder = parts.length > 1 ? parts[parts.length - 2] : '';
  
  const cleanFolder = parentFolder
    .replace(/^\d+\s*/, '')
    .replace(/-/g, '')
    .trim();

  if (fileName.match(/^\d+$/)) {
    return `${cleanFolder || 'Ilustración'} - Lámina ${fileName}`;
  }

  const cleanFileName = fileName
    .replace(/_/g, ' ')
    .replace(/\(.*?\)/g, '')
    .trim();

  return cleanFileName || cleanFolder || 'Ilustración CamiToons';
}

function determineCategory(filePath: string): 'personajes' | 'fantasia' | 'infantil' | 'fanart' | 'concept' | 'bocetos' {
  const lower = filePath.toLowerCase();
  if (lower.includes('emociones') || lower.includes('jardin') || lower.includes('animales') || lower.includes('colores')) {
    return 'infantil';
  }
  if (lower.includes('selva') || lower.includes('cambio') || lower.includes('viaja')) {
    return 'fantasia';
  }
  if (lower.includes('sonidos') || lower.includes('personaje')) {
    return 'personajes';
  }
  return 'infantil';
}

export const catalogArtworks: Artwork[] = SAMPLE_ARTWORK_PATHS.map((relPath, index) => {
  return {
    id: `catalog-art-${index + 1}`,
    title: formatTitleFromPath(relPath),
    category: determineCategory(relPath),
    imageUrl: getMediaUrl(relPath),
    description: `Ilustración infantil original del cuento CamiToons.`,
    year: '2025',
    featured: index < 6,
    tags: ['CamiToons', 'Cuentos Infantiles', 'Ilustración']
  };
});
