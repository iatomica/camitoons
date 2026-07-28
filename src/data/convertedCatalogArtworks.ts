import { Artwork } from '../types';

// Auto-import all converted WebP images from src/assets/images/catalog
const catalogGlob = import.meta.glob<string>('../assets/images/catalog/**/*.webp', {
  eager: true,
  import: 'default'
});

function formatTitleFromPath(filePath: string): string {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1].replace(/\.webp$/i, '');
  const parentFolder = parts.length > 1 ? parts[parts.length - 2] : '';
  
  // Clean folder name
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
  if (lower.includes('instagram') || lower.includes('presentacion')) {
    return 'concept';
  }
  if (lower.includes('colorear') || lower.includes('boceto') || lower.includes('adaptada')) {
    return 'bocetos';
  }
  return 'infantil';
}

function determineCategoryLabel(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.includes('jardin')) return 'Luna en el Jardín';
  if (lower.includes('viaja')) return 'Luna Sueña que Viaja';
  if (lower.includes('colores')) return 'Luna Encuentra Colores';
  if (lower.includes('cambio')) return 'Luna y el Gran Cambio';
  if (lower.includes('selva')) return 'Luna y la Selva';
  if (lower.includes('sonidos')) return 'Luna y los Sonidos';
  if (lower.includes('emociones')) return 'Luna y las Emociones';
  if (lower.includes('animales')) return 'Luna y los Animales';
  if (lower.includes('instagram')) return 'Redes & Instagram';
  if (lower.includes('colorear')) return 'Lámina para Colorear';
  if (lower.includes('presentacion')) return 'Presentación Editorial';
  return 'Colección WebP CamiToons';
}

export const CATALOG_CONVERTED_ARTWORKS: Artwork[] = Object.entries(catalogGlob).map(([filePath, imageUrl], idx) => {
  const title = formatTitleFromPath(filePath);
  const category = determineCategory(filePath);
  const categoryLabel = determineCategoryLabel(filePath);
  const isColorear = filePath.toLowerCase().includes('colorear');

  return {
    id: `converted-webp-${idx + 1}`,
    title: title,
    category: category,
    categoryLabel: categoryLabel,
    description: `Ilustración WebP convertida desde el catálogo original de CamiToons (${categoryLabel}). Archivo WebP de alta eficiencia.`,
    imageUrl: imageUrl,
    aspectRatio: 'square',
    tags: ['WebP', 'CamiToons', categoryLabel, isColorear ? 'Colorear' : 'Ilustración Infantil'],
    year: 2026,
    client: 'CamiToons Catalogo WebP',
    softwareUsed: ['Procreate', 'WebP Optimizer'],
    likesCount: 100 + ((idx * 17) % 850),
    viewsCount: 500 + ((idx * 43) % 3200),
    isFeatured: idx % 20 === 0,
    story: `Página / lámina perteneciente a la colección WebP de CamiToons: ${categoryLabel}.`,
    colorPalette: ['#A239CA', '#4717F6', '#FFB6C1', '#2A9D8F']
  };
});
