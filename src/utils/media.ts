/**
 * Dynamic Media URL helper for CamiToons Web Application.
 * Resolves media paths against PostgreSQL media API or VITE_MEDIA_BASE_URL.
 */
export function getMediaUrl(relativePath: string): string {
  if (!relativePath) return '';
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('data:')) {
    return relativePath;
  }
  const cleanPath = relativePath.replace(/^\/+/, '');
  const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL || '/api/media';
  return `${baseUrl}/${cleanPath}`;
}
