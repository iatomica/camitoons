import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BooksSection } from './components/BooksSection';
import { JuegosSection } from './components/JuegosSection';
import { CuentosPage } from './components/CuentosPage';
import { JuegosBanner } from './components/JuegosBanner';
import { JuegosPage } from './components/JuegosPage';
import { CharacterNetworkSection } from './components/CharacterNetworkSection';
import { NetflixTestPage } from './components/NetflixTestPage';
import { Gallery } from './components/Gallery';
import { ArtworkModal } from './components/ArtworkModal';
import { SocialFeed } from './components/SocialFeed';
import { AboutSection } from './components/AboutSection';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { Artwork, CommissionQuote } from './types';
import { BOOKS_DATA, BookStory } from './data/booksCatalog';
import { AdminPanel } from './components/AdminPanel';
import { Heart, Users } from 'lucide-react';

export default function App() {
  // Books Catalog State (with static fallback)
  const [books, setBooks] = useState<BookStory[]>(BOOKS_DATA);
  const [isAdminLogged, setIsAdminLogged] = useState<boolean>(false);

  const refreshBooks = async () => {
    try {
      const token = localStorage.getItem('camitoons_admin_token');
      const headers: HeadersInit = {};
      if (token === 'admin-token') {
        headers['Authorization'] = 'Bearer admin-token';
        setIsAdminLogged(true);
      } else {
        setIsAdminLogged(false);
      }
      
      const res = await fetch('/api/books', { headers });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.warn('Fallo al obtener cuentos dinámicos de la DB, usando fallback estático:', err);
    }
  };

  useEffect(() => {
    refreshBooks();
  }, []);

  // Dark Mode state with system/localStorage preference
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('camitoons_theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Current view page: 'home' | 'cuentos' | 'juegos' | 'alternativo' | 'admin'
  const [currentView, setCurrentView] = useState<'home' | 'cuentos' | 'juegos' | 'alternativo' | 'admin'>('home');

  // Favorites state saved in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('camitoons_favs');
    return saved ? JSON.parse(saved) : ['art-1', 'art-7'];
  });

  // Active section tracker
  const [activeSection, setActiveSection] = useState<string>('inicio');

  // Search Query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Favorites Filter Toggle
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Modal Artwork
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Prefilled Quote for Contact Form
  const [prefilledQuote, setPrefilledQuote] = useState<CommissionQuote | null>(null);

  // Sync hash routing for /cuentos and /juegos pages
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/cuentos' || hash === '#cuentos-todos') {
        setCurrentView('cuentos');
        window.scrollTo(0, 0);
      } else if (hash === '#/juegos' || hash === '#juegos-todos') {
        setCurrentView('juegos');
        window.scrollTo(0, 0);
      } else if (hash === '#/alternativo') {
        setCurrentView('alternativo');
        window.scrollTo(0, 0);
      } else if (hash === '#/admin') {
        setCurrentView('admin');
        window.scrollTo(0, 0);
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update localStorage and root element class when dark mode changes
  useEffect(() => {
    localStorage.setItem('camitoons_theme', darkMode ? 'dark' : 'light');
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter(fId => fId !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('camitoons_favs', JSON.stringify(newFavs));
  };

  const scrollToSection = (sectionId: string) => {
    // When viewing the Netflix style page (which is now 'home')
    if (currentView === 'home') {
      let targetId = sectionId;
      if (sectionId === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('inicio');
        return;
      }
      if (sectionId === 'cuentos') targetId = 'cuentos-test';
      if (sectionId === 'juegos') targetId = 'juegos-test';
      if (sectionId === 'personajes') targetId = 'personajes-test';
      if (sectionId === 'sobre-mi') targetId = 'autora-test';
      if (sectionId === 'donacion') targetId = 'donacion';
      
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
      }
      return;
    }

    // When viewing the original layout page (which is now 'alternativo')
    if (currentView === 'alternativo') {
      let targetId = sectionId;
      if (sectionId === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('inicio');
        return;
      }
      if (sectionId === 'donacion') targetId = 'donacion';

      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(sectionId);
      }
      return;
    }

    // If we are in other pages (cuentos, juegos, admin)
    // Symmetrically, we want to go back to the main home page (which is Netflix layout, empty hash)
    window.location.hash = '';
    setCurrentView('home');
    setTimeout(() => {
      let targetId = sectionId;
      if (sectionId === 'cuentos') targetId = 'cuentos-test';
      if (sectionId === 'juegos') targetId = 'juegos-test';
      if (sectionId === 'personajes') targetId = 'personajes-test';
      if (sectionId === 'sobre-mi') targetId = 'autora-test';
      if (sectionId === 'donacion') targetId = 'donacion';
      
      const elem = document.getElementById(targetId);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleRequestSimilar = (art: Artwork) => {
    setSelectedArtwork(null);
    const quote: CommissionQuote = {
      type: art.categoryLabel,
      style: 'Pintura Renderizada',
      background: 'Fondo Detallado',
      extraCharacters: 0,
      commercialUse: false,
      expressDelivery: false,
      estimatedPrice: 95,
      estimatedDays: 6
    };
    setPrefilledQuote(quote);
    scrollToSection('contacto');
  };

  const handleGoToAllCuentos = () => {
    window.location.hash = '#/cuentos';
    setCurrentView('cuentos');
    window.scrollTo(0, 0);
  };

  const handleGoToAllGames = () => {
    window.location.hash = '#/juegos';
    setCurrentView('juegos');
    window.scrollTo(0, 0);
  };

  const handleGoBackHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        darkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sticky Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        setActiveSection={scrollToSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenFavorites={() => {
          setShowOnlyFavorites(true);
          scrollToSection('galeria');
        }}
        onOpenAdmin={() => { window.location.hash = '#/admin'; }}
        isAdminLogged={isAdminLogged}
      />

      {/* Main View Router */}
      {currentView === 'cuentos' ? (
        /* Dedicated All Cuentos Page (/cuentos) */
        <CuentosPage
          darkMode={darkMode}
          onGoBackHome={handleGoBackHome}
          books={books}
        />
      ) : currentView === 'juegos' ? (
        /* Dedicated All Games Page (/juegos) */
        <JuegosPage
          darkMode={darkMode}
          onGoBackHome={handleGoBackHome}
          books={books}
        />
      ) : currentView === 'alternativo' ? (
        /* Static Home Page Layout (Now Alternative Page) */
        <main>
          {/* Hero Banner */}
          <Hero
            darkMode={darkMode}
            onExploreGallery={() => scrollToSection('cuentos')}
            onContact={() => scrollToSection('contacto')}
            blocks={{}}
            isAdminLogged={false}
            onRefreshBlocks={() => {}}
          />

          {/* Books Section */}
          <BooksSection
            darkMode={darkMode}
            isHomePage={true}
            onViewAll={handleGoToAllCuentos}
            books={books}
          />

          {/* Games Banner */}
          <JuegosBanner
            darkMode={darkMode}
            onExploreGames={handleGoToAllGames}
          />

          {/* Character Network Graph */}
          <CharacterNetworkSection darkMode={darkMode} />

          {/* Social Community Feed */}
          <SocialFeed darkMode={darkMode} />

          {/* About Bio Section */}
          <AboutSection
            darkMode={darkMode}
            blocks={{}}
            isAdminLogged={false}
            onRefreshBlocks={() => {}}
          />

          {/* Comunidad & Apoyo (Donación y Redes Sociales) */}
          <section id="donacion" className={`py-12 border-t max-w-4xl mx-auto space-y-10 border-slate-800/80`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch px-4 sm:px-6">
              
              {/* Donación al Proyecto Card */}
              <div className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-4 border shadow-2xl transition-all ${
                darkMode
                  ? 'bg-[#160d21]/60 border-purple-500/10 text-slate-100 shadow-purple-950/5'
                  : 'bg-[#f8f1fe] border-purple-200/80 text-slate-900 shadow-purple-100/30'
              }`}>
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-2">
                    <span className={`p-1.5 rounded-xl border ${
                      darkMode
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/20'
                        : 'bg-purple-100 text-purple-700 border-purple-200'
                    }`}>
                      <Heart className={`w-5 h-5 ${darkMode ? 'fill-purple-450 text-purple-400' : 'fill-pink-500 text-pink-500'}`} />
                    </span>
                    <h4 className={`text-base font-sans font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-purple-950'}`}>Donación al Proyecto</h4>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed font-semibold ${darkMode ? 'text-slate-355' : 'text-slate-900'}`}>
                    CamiToons es una iniciativa independiente dedicada a crear cuentos infantiles y herramientas lúdicas libres de publicidad. Tu apoyo nos ayuda a seguir expandiendo este universo afectivo y pedagógico para más familias.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="https://cafecito.app/camitoons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#f9f9f9] hover:bg-slate-200 text-black font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-md text-center"
                  >
                    ☕ <span>Invitar un Cafecito</span>
                  </a>
                  <a
                    href="https://paypal.me/camitoons"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 inline-flex items-center justify-center space-x-2 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-md border text-center ${
                      darkMode ? 'bg-purple-600 hover:bg-purple-750 border-purple-500/15' : 'bg-pink-500 hover:bg-pink-650 border-pink-200/50'
                    }`}
                  >
                    💳 <span>Donar por PayPal</span>
                  </a>
                </div>
              </div>

              {/* Redes Sociales / Comunidad Card */}
              <div className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-4 border shadow-2xl transition-all ${
                darkMode
                  ? 'bg-[#10192e]/40 border-blue-950/15 text-slate-100 shadow-blue-950/5'
                  : 'bg-[#f0f9ff] border-sky-200/80 text-slate-900 shadow-sky-100/30'
              }`}>
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-2">
                    <span className={`p-1.5 rounded-xl border ${
                      darkMode
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/20'
                        : 'bg-sky-100 text-sky-700 border-sky-200'
                    }`}>
                      <Users className="w-5 h-5 text-blue-400" />
                    </span>
                    <h4 className={`text-base font-sans font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-sky-955'}`}>Comunidad CamiToons</h4>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed font-semibold ${darkMode ? 'text-slate-355' : 'text-slate-900'}`}>
                    ¡Acompáñanos en nuestras redes sociales! Compartimos novedades, adelantos de los próximos cuentos de Luna, sugerencias didácticas y recursos gratuitos para descargar en el hogar o la escuela.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contacto">
            <ContactForm darkMode={darkMode} prefilledQuote={prefilledQuote} />
          </section>
        </main>
      ) : currentView === 'admin' ? (
        /* Full Page Admin Console (/admin) */
        <AdminPanel
          darkMode={darkMode}
          onClose={handleGoBackHome}
          onRefreshBooks={refreshBooks}
          books={books}
          blocks={{}}
          onRefreshBlocks={() => {}}
        />
      ) : (
        /* Dedicated Netflix Test Page (Now Main Home Page) */
        <NetflixTestPage
          darkMode={darkMode}
          onGoBackHome={handleGoBackHome}
          books={books}
          onOpenAdmin={() => { window.location.hash = '#/admin'; }}
          isAdminLogged={isAdminLogged}
        />
      )}

      {/* Footer */}
      <Footer darkMode={darkMode} onNavigate={scrollToSection} />

      {/* Artwork Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          isFavorite={favorites.includes(selectedArtwork.id)}
          onToggleFavorite={() => toggleFavorite(selectedArtwork.id)}
          darkMode={darkMode}
          onRequestSimilar={() => handleRequestSimilar(selectedArtwork)}
        />
      )}

    </div>
  );
}
