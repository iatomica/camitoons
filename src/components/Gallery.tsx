import React, { useState, useMemo } from 'react';
import { Palette, Filter, Search, Heart, Eye, Sparkles, LayoutGrid, Layers, Tag, Check, Star } from 'lucide-react';
import { Artwork } from '../types';
import { ARTWORKS_DATA } from '../data/artworks';

interface GalleryProps {
  darkMode: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  favorites: string[];
  onToggleFavorite: (artworkId: string) => void;
  onSelectArtwork: (artwork: Artwork) => void;
  showOnlyFavorites?: boolean;
  setShowOnlyFavorites?: (val: boolean) => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  darkMode,
  searchQuery,
  setSearchQuery,
  favorites,
  onToggleFavorite,
  onSelectArtwork,
  showOnlyFavorites = false,
  setShowOnlyFavorites
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [sortBy, setSortBy] = useState<'reciente' | 'popular'>('reciente');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');

  const categories = [
    { id: 'todas', label: 'Todas las Obras' },
    { id: 'personajes', label: 'Personajes' },
    { id: 'fantasia', label: 'Fantasía' },
    { id: 'infantil', label: 'Infantil' },
    { id: 'fanart', label: 'Fan Art' },
    { id: 'concept', label: 'Concept Art' },
    { id: 'bocetos', label: 'Bocetos' }
  ];

  // Filter and Sort Logic
  const filteredArtworks = useMemo(() => {
    return ARTWORKS_DATA.filter((art) => {
      // Category filter
      if (selectedCategory !== 'todas' && art.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(art.id)) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(query);
        const matchesDesc = art.description.toLowerCase().includes(query);
        const matchesTags = art.tags.some((t) => t.toLowerCase().includes(query));
        const matchesCategory = art.categoryLabel.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesTags || matchesCategory;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likesCount - a.likesCount;
      }
      return b.year - a.year;
    });
  }, [selectedCategory, showOnlyFavorites, favorites, searchQuery, sortBy]);

  return (
    <section id="galeria" className="py-12 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
            <Palette className="w-3.5 h-3.5" />
            <span>Galería de Libros & Ilustraciones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Explora mis Cuentos e Ilustraciones Infantiles
          </h2>
          <p className={`text-sm sm:text-base font-normal ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Descubre páginas ilustradas, conceptos de libros y aventuras del universo de Luna diseñados para el público infantil, familias y educadores.
          </p>
        </div>

        {/* Controls Bar: Category Pills, Filters & View Mode */}
        <div className="space-y-4 mb-8">
          
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id && !showOnlyFavorites;
              return (
                <button
                  key={cat.id}
                  id={`btn-category-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (setShowOnlyFavorites) setShowOnlyFavorites(false);
                  }}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                      : darkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            {/* Favorite Filter Badge */}
            {setShowOnlyFavorites && (
              <button
                id="btn-filter-only-favorites"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 ${
                  showOnlyFavorites
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : darkMode
                    ? 'bg-slate-800 text-rose-400 hover:bg-slate-700 border border-slate-700'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white' : 'fill-rose-400'}`} />
                <span>Mis Favoritos ({favorites.length})</span>
              </button>
            )}
          </div>

          {/* Secondary Controls: Sorting, View Mode & Active Search status */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
            
            {/* Results Count & Search Active Clear */}
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <span>
                Mostrando <strong className="text-slate-800 dark:text-white">{filteredArtworks.length}</strong> obras
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-purple-500 hover:underline font-medium text-xs ml-2"
                >
                  Limpiar búsqueda "{searchQuery}" ×
                </button>
              )}
            </div>

            {/* Sort & Layout Buttons */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 font-medium">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'reciente' | 'popular')}
                  id="select-sort-artworks"
                  className={`py-1.5 px-3 rounded-xl border text-xs font-semibold focus:outline-none ${
                    darkMode
                      ? 'bg-slate-800 text-white border-slate-700'
                      : 'bg-white text-slate-800 border-slate-200'
                  }`}
                >
                  <option value="reciente">Más Reciente</option>
                  <option value="popular">Más Popular (Likes)</option>
                </select>
              </div>

              <div className="hidden sm:flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'masonry' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Vista Dinámica"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Vista Cuadrícula"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Gallery Grid Output */}
        {filteredArtworks.length === 0 ? (
          <div className={`text-center py-16 px-4 rounded-3xl border ${
            darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Palette className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold mb-1">No se encontraron ilustraciones</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
              Prueba cambiando la categoría de filtro o limpiando los términos de búsqueda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSearchQuery('');
                if (setShowOnlyFavorites) setShowOnlyFavorites(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredArtworks.map((art) => {
              const isFav = favorites.includes(art.id);
              return (
                <div
                  key={art.id}
                  id={`artwork-card-${art.id}`}
                  className={`group relative rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    darkMode
                      ? 'bg-slate-900 border-slate-800 hover:shadow-purple-950/40'
                      : 'bg-white border-slate-200 hover:shadow-purple-500/10'
                  }`}
                >
                  {/* Artwork Image Container */}
                  <div
                    onClick={() => onSelectArtwork(art)}
                    className="relative cursor-pointer overflow-hidden bg-slate-950 aspect-[4/5]"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Gradient Hover Mask */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                      
                      {/* Top Overlay Badge & Favorite */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-600/90 backdrop-blur-md">
                          {art.categoryLabel}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(art.id);
                          }}
                          className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-125 ${
                            isFav ? 'bg-rose-500 text-white' : 'bg-slate-900/60 text-slate-200 hover:text-white'
                          }`}
                          title={isFav ? 'Quitar favorito' : 'Guardar favorito'}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Overlay Title & Action */}
                      <div className="space-y-1">
                        <h3 className="text-base font-bold leading-snug">{art.title}</h3>
                        <p className="text-xs text-slate-300 line-clamp-2 font-light">
                          {art.description}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-xs text-purple-300 font-semibold">
                          <span>Ver detalle & Proceso</span>
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Bottom Permanent Details */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm truncate max-w-[200px]">{art.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {art.softwareUsed.slice(0, 2).join(' • ')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                      <span>{art.likesCount}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
