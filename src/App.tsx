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

export default function App() {
  // Books Catalog State (with static fallback)
  const [books, setBooks] = useState<BookStory[]>(BOOKS_DATA);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
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

  // Current view page: 'home' | 'cuentos' | 'juegos' | 'alternativo'
  const [currentView, setCurrentView] = useState<'home' | 'cuentos' | 'juegos' | 'alternativo'>('home');

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
        setIsAdminOpen(true);
        window.location.hash = '';
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
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('camitoons_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (artworkId: string) => {
    if (favorites.includes(artworkId)) {
      setFavorites(favorites.filter((id) => id !== artworkId));
    } else {
      setFavorites([...favorites, artworkId]);
    }
  };

  const handleGoToAllGames = () => {
    window.location.hash = '#/juegos';
    setCurrentView('juegos');
    window.scrollTo(0, 0);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'juegos') {
      handleGoToAllGames();
      return;
    }
    if (currentView !== 'home') {
      setCurrentView('home');
      window.location.hash = '';
    }
    setActiveSection(sectionId);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleRequestSimilar = (art: Artwork) => {
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
        onOpenAdmin={() => setIsAdminOpen(true)}
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
        /* Dedicated Netflix Test Page (/alternativo) */
        <NetflixTestPage
          darkMode={darkMode}
          onGoBackHome={handleGoBackHome}
          books={books}
          onOpenAdmin={() => setIsAdminOpen(true)}
          isAdminLogged={isAdminLogged}
        />
      ) : (
        /* Main Home Page */
        <main>
          {/* Hero Banner */}
          <Hero
            darkMode={darkMode}
            onExploreGallery={() => scrollToSection('cuentos')}
            onContact={() => scrollToSection('contacto')}
          />

          {/* Cuentos Section: 6 Cards on Home with PDF + Coloring */}
          <BooksSection
            darkMode={darkMode}
            isHomePage={true}
            onViewAll={handleGoToAllCuentos}
            books={books}
          />

          {/* Banner Estético de Minijuegos Infantiles en Home */}
          <JuegosBanner
            darkMode={darkMode}
            onExploreGames={handleGoToAllGames}
          />

          {/* Character Network Relationship Graph */}
          <CharacterNetworkSection darkMode={darkMode} />

          {/* Social Feed & Community */}
          <SocialFeed darkMode={darkMode} />

          {/* Author Biography */}
          <AboutSection darkMode={darkMode} />
        </main>
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

      {/* Admin Panel Modal Overlay */}
      {isAdminOpen && (
        <AdminPanel
          darkMode={darkMode}
          onClose={() => setIsAdminOpen(false)}
          onRefreshBooks={refreshBooks}
          books={books}
        />
      )}
    </div>
  );
}
