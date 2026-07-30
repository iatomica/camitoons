import React, { useState, useEffect } from 'react';
import { Sun, Moon, Search, Menu, X, Sparkles, Palette, MessageSquare, Heart, Instagram, BookOpen, Users, Gamepad2, Lock } from 'lucide-react';
import { getMediaUrl } from '../utils/media';
const camitoonsLogo = getMediaUrl('images/CamiToonsLogo.webp');

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenAdmin: () => void;
  isAdminLogged: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  favoritesCount: [any], // this is standard, let's keep exact destructuring
  favoritesCount,
  onOpenFavorites,
  onOpenAdmin,
  isAdminLogged
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    
    // Smooth scroll to section if on home
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Sparkles },
    { id: 'cuentos', label: 'Colección Cuentos', icon: BookOpen },
    { id: 'personajes', label: 'Árbol de Personajes', icon: Users },
    { id: 'juegos', label: 'Juegos Infantiles', icon: Gamepad2 },
    { id: 'sobre-mi', label: 'Sobre la Autora', icon: Heart }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? darkMode
            ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
            : 'bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-md'
          : darkMode
          ? 'bg-slate-950/60 backdrop-blur-sm'
          : 'bg-white/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo with CamitoonsLogo Image (Black in light mode, White in dark mode) */}
          <button
            onClick={() => handleNavClick('inicio')}
            id="btn-logo-home"
            className="flex items-center space-x-2.5 group text-left focus:outline-none py-1"
          >
            <img
              src={camitoonsLogo}
              alt="CamiToons Logo"
              className={`h-10 sm:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                darkMode ? 'brightness-100' : 'brightness-0'
              }`}
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md font-bold'
                      : darkMode
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-purple-50'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Utility Actions: Dark Mode Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Admin Console Entry Lock Button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 border ${
                isAdminLogged
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35 shadow-md animate-pulse-slow'
                  : darkMode
                  ? 'bg-slate-800 border-slate-700 text-purple-300 hover:bg-slate-700 hover:text-purple-200'
                  : 'bg-[#fff5f9] border-pink-200 text-pink-700 hover:bg-pink-100'
              }`}
              title={isAdminLogged ? "Consola de Administración (Activa)" : "Iniciar Sesión como Admin"}
              aria-label="Panel administrativo"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">
                {isAdminLogged ? 'Admin' : 'Acceder'}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-navbar-theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                darkMode
                  ? 'bg-slate-800 text-amber-300 hover:bg-slate-700 hover:text-amber-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Alternar tema de color"
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Contact CTA Pill (Desktop) */}
            <button
              id="btn-navbar-contact-cta"
              onClick={() => handleNavClick('contacto')}
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contacto & Lecturas</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl md:hidden transition-colors ${
                darkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b transition-all duration-300 ${
            darkMode
              ? 'bg-slate-900/98 border-slate-800 text-white'
              : 'bg-white/98 border-slate-200 text-slate-800'
          }`}
        >
          <div className="px-4 pt-3 pb-6 space-y-2">
            <div className="p-3 mb-3 rounded-2xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-purple-300">
                  Colección "Luna está creciendo"
                </span>
              </div>
            </div>

            {navLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === link.id
                      ? darkMode
                        ? 'bg-purple-600/30 text-purple-300 font-semibold'
                        : 'bg-purple-100 text-purple-800 font-semibold'
                      : darkMode
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComp className="w-4 h-4 text-purple-400" />
                    <span>{link.label}</span>
                  </div>
                  <span className="text-xs opacity-60">→</span>
                </button>
              );
            })}

            {/* Mobile Admin Login Option */}
            <div className="pt-1 border-t border-dashed border-slate-700/20 my-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isAdminLogged
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : darkMode
                    ? 'text-slate-355 hover:bg-slate-800'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Lock className={`w-4 h-4 ${isAdminLogged ? 'text-emerald-400' : 'text-purple-500'}`} />
                  <span>{isAdminLogged ? 'Panel Admin Activo' : 'Iniciar Sesión (Admin)'}</span>
                </div>
                <span className="text-xs opacity-60">🔑</span>
              </button>
            </div>

            <div className="pt-1">
              <button
                id="btn-mobile-contact-cta"
                onClick={() => handleNavClick('contacto')}
                className="w-full py-3 px-4 rounded-xl text-center text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Contacto / Visitas Escolares</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
