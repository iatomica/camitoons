import React, { useState, useEffect } from 'react';
import { BookStory } from '../data/booksCatalog';
import { 
  X, Lock, User, Key, Database, FileText, Image as ImageIcon, 
  Trash2, Plus, Edit2, Save, UploadCloud, Eye, EyeOff, Sparkles, Check, AlertCircle, FilePlus 
} from 'lucide-react';

interface AdminPanelProps {
  darkMode: boolean;
  onClose: () => void;
  onRefreshBooks: () => void;
  books: BookStory[];
}

interface MediaAsset {
  id: number;
  assetPath: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ darkMode, onClose, onRefreshBooks, books }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Tab state: 'books' | 'edit-book' | 'media'
  const [activeTab, setActiveTab] = useState<'books' | 'edit-book' | 'media'>('books');

  // Media files state
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);

  // Book editor state
  const [selectedBook, setSelectedBook] = useState<Partial<BookStory> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [editorMessage, setEditorMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [savingBook, setSavingBook] = useState<boolean>(false);

  // File uploading states
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);
  const [uploadingSvg, setUploadingSvg] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('camitoons_admin_token');
    if (token === 'admin-token') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'media') {
      fetchMediaList();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        localStorage.setItem('camitoons_admin_token', 'admin-token');
        setIsAuthenticated(true);
        onRefreshBooks(); // refresh list with admin rights (includes hidden books)
      } else {
        const errData = await res.json();
        setLoginError(errData.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setLoginError('Error de red al intentar iniciar sesión');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('camitoons_admin_token');
    setIsAuthenticated(false);
    onClose();
    window.location.reload(); // force reload to drop admin privileges from memory
  };

  const fetchMediaList = async () => {
    setLoadingMedia(true);
    try {
      const token = localStorage.getItem('camitoons_admin_token');
      const res = await fetch('/api/admin/media', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (err) {
      console.error('Error fetching media list:', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este recurso multimedia permanentemente de la base de datos? Esto podría romper cuentos que lo usen.')) return;
    try {
      const token = localStorage.getItem('camitoons_admin_token');
      const res = await fetch(`/api/admin/media/${mediaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMediaList(prev => prev.filter(m => m.id !== mediaId));
      }
    } catch (err) {
      console.error('Error deleting media:', err);
    }
  };

  const handleEditBookClick = (book: BookStory) => {
    setSelectedBook({ ...book });
    setIsCreatingNew(false);
    setEditorMessage(null);
    setActiveTab('edit-book');
  };

  const handleCreateBookClick = () => {
    const timestampId = `book-${Date.now()}`;
    setSelectedBook({
      id: timestampId,
      folderName: '',
      title: '',
      displayTitle: '',
      recommendedAge: '2 años',
      coverImage: '',
      pdfUrl: '',
      pdfFileName: '',
      intro: '',
      objective: '',
      summary: '',
      fullFundamentacion: '',
      coloringSvgs: [],
      status: 'published'
    });
    setIsCreatingNew(true);
    setEditorMessage(null);
    setActiveTab('edit-book');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf' | 'svg') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('camitoons_admin_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    if (type === 'cover') setUploadingCover(true);
    if (type === 'pdf') setUploadingPdf(true);
    if (type === 'svg') setUploadingSvg(true);

    try {
      const res = await fetch('/api/admin/upload-file', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        // Update temporary state fields with uploaded URLs
        setSelectedBook(prev => {
          if (!prev) return prev;
          if (type === 'cover') {
            return { ...prev, coverImage: data.url };
          }
          if (type === 'pdf') {
            return { ...prev, pdfUrl: data.url, pdfFileName: data.fileName };
          }
          if (type === 'svg') {
            return { ...prev, coloringSvgs: [...(prev.coloringSvgs || []), data.url] };
          }
          return prev;
        });
      } else {
        const err = await res.json();
        alert(`Error al subir archivo: ${err.error}`);
      }
    } catch (err) {
      alert('Fallo de conexión al subir el archivo');
    } finally {
      setUploadingCover(false);
      setUploadingPdf(false);
      setUploadingSvg(false);
    }
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    if (!selectedBook.id || !selectedBook.title || !selectedBook.displayTitle) {
      setEditorMessage({ type: 'error', text: 'El ID, Título y Título de Pantalla son obligatorios' });
      return;
    }

    setSavingBook(true);
    setEditorMessage(null);
    try {
      const token = localStorage.getItem('camitoons_admin_token');
      const url = isCreatingNew ? '/api/books' : `/api/books/${selectedBook.id}`;
      const method = isCreatingNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedBook)
      });

      if (res.ok) {
        setEditorMessage({ type: 'success', text: isCreatingNew ? 'Cuento creado con éxito en la base de datos!' : 'Cuento guardado con éxito en la base de datos!' });
        onRefreshBooks(); // refresh list
        if (isCreatingNew) {
          setIsCreatingNew(false);
        }
      } else {
        const err = await res.json();
        setEditorMessage({ type: 'error', text: err.error || 'Error al guardar cuento' });
      }
    } catch (err) {
      setEditorMessage({ type: 'error', text: 'Error de red al guardar el cuento' });
    } finally {
      setSavingBook(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este cuento permanentemente de la base de datos?')) return;
    try {
      const token = localStorage.getItem('camitoons_admin_token');
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        onRefreshBooks();
      } else {
        alert('Error al eliminar cuento');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Login Modal Panel View (Acceso Privado)
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#12091c] border border-purple-500/20 max-w-md w-full rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-[#f9f9f9] relative">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-sans font-black uppercase tracking-wider text-white">Acceso Administrativo</h3>
            <p className="text-xs text-slate-400 font-medium">Ingresa las credenciales autorizadas del proyecto para administrar la base de datos.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Usuario</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><User className="w-4 h-4" /></span>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1c1229] border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><Key className="w-4 h-4" /></span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1c1229] border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-950/40 active:scale-98"
            >
              Acceder como Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main Panel View (Acceso Concedido)
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-[#12091c] border border-purple-500/25 w-full max-w-5xl h-[85vh] min-h-[500px] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#f9f9f9]">
        
        {/* Panel Header */}
        <header className="px-6 py-4 border-b border-white/5 bg-[#160d21]/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/35">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-sans font-black uppercase text-white tracking-wider flex items-center space-x-2">
                <span>CamiToons Console</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/30 tracking-widest animate-pulse">DB-CONNECTED</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">Gestión Dinámica de Cuentos y Control de Archivos Multimedia</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="text-[10px] font-black uppercase tracking-wider bg-red-600/10 hover:bg-red-600/20 border border-red-500/35 text-red-300 px-3.5 py-2 rounded-xl transition-colors active:scale-95"
            >
              Cerrar Sesión
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Selection Row */}
        <nav className="flex bg-[#160d21]/45 border-b border-white/5 px-6 py-1 gap-2">
          <button
            onClick={() => setActiveTab('books')}
            className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'books' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Lista de Cuentos ({books.length})
          </button>
          {selectedBook && (
            <button
              onClick={() => setActiveTab('edit-book')}
              className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'edit-book' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isCreatingNew ? 'Nuevo Cuento' : 'Editor de Cuento'}</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'media' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📂 Biblioteca Multimedia
          </button>
        </nav>

        {/* Tab Body Viewports */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
          
          {/* TAB 1: Books Catalog Management */}
          {activeTab === 'books' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-sans font-black uppercase tracking-wider text-slate-300">Cuentos Registrados en PostgreSQL</h4>
                <button
                  onClick={handleCreateBookClick}
                  className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black px-4.5 py-2.5 rounded-xl text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Cuento</span>
                </button>
              </div>

              {books.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-[#160d21]/30 border border-purple-500/10 rounded-2xl">
                  <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-400">No se encontraron cuentos en la base de datos.</p>
                  <button onClick={handleCreateBookClick} className="text-xs font-extrabold text-purple-400 hover:underline">
                    Crear el primero ahora
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {books.map(book => (
                    <div 
                      key={book.id}
                      className="p-4 rounded-2xl bg-[#160d21]/50 border border-purple-500/10 hover:border-purple-500/20 transition-all flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img 
                          src={book.coverImage || '/api/media/Imagenes/rompecabezas/10.jpeg'} 
                          alt={book.displayTitle}
                          className="w-12 h-12 rounded-xl object-cover border border-purple-500/20 shrink-0 bg-slate-900"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold text-white truncate max-w-xs">{book.displayTitle}</span>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                              book.status === 'published' 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                : book.status === 'coming_soon'
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                              {book.status === 'published' ? 'Publicado' : book.status === 'coming_soon' ? 'Próximamente' : 'Oculto'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold">{book.id} • {book.recommendedAge}</p>
                          {book.pdfFileName && (
                            <p className="text-[9px] text-purple-400 font-bold flex items-center gap-1 mt-0.5">
                              <FileText className="w-3 h-3" />
                              <span>{book.pdfFileName}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleEditBookClick(book)}
                          className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors"
                          title="Editar cuento"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors"
                          title="Eliminar cuento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Book Creation & Modification Form */}
          {activeTab === 'edit-book' && selectedBook && (
            <form onSubmit={handleSaveBook} className="space-y-6">
              
              {/* Form Title */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h4 className="text-sm font-sans font-black uppercase tracking-wider text-purple-300">
                  {isCreatingNew ? 'Registrar Nuevo Cuento' : `Editar Cuento: ${selectedBook.displayTitle}`}
                </h4>
                <button
                  type="button"
                  onClick={() => { setSelectedBook(null); setActiveTab('books'); }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Volver a la lista
                </button>
              </div>

              {/* Form Body Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Left Side: General Info & Metadata */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">ID / Slug Cuento</label>
                      <input
                        type="text"
                        required
                        disabled={!isCreatingNew}
                        value={selectedBook.id || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, id: e.target.value }))}
                        placeholder="book-xx"
                        className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-white focus:outline-none transition-colors disabled:opacity-40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Edad Recomendada</label>
                      <select
                        value={selectedBook.recommendedAge || '2 años'}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, recommendedAge: e.target.value }))}
                        className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2.5 px-3 text-xs font-semibold text-white focus:outline-none transition-colors"
                      >
                        <option value="2 años">2 Años (Juegos & Formas)</option>
                        <option value="3 años">3 Años (Emociones & Selva)</option>
                        <option value="4 años">4 Años (Autonomía & Hábitos)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Título de Carpeta Interna</label>
                    <input
                      type="text"
                      placeholder="Folder en local (ej: 2 Luna suena que viaja -)"
                      value={selectedBook.folderName || ''}
                      onChange={(e) => setSelectedBook(prev => ({ ...prev, folderName: e.target.value }))}
                      className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Título Oficial (Mayúsculas)</label>
                      <input
                        type="text"
                        required
                        placeholder="LUNA SUEÑA QUE VIAJA"
                        value={selectedBook.title || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, title: e.target.value.toUpperCase() }))}
                        className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Título de Pantalla</label>
                      <input
                        type="text"
                        required
                        placeholder="Luna sueña que viaja"
                        value={selectedBook.displayTitle || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, displayTitle: e.target.value }))}
                        className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Estado de Publicación en Web</label>
                    <div className="flex gap-2">
                      {['published', 'coming_soon', 'hidden'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setSelectedBook(prev => ({ ...prev, status: st }))}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors ${
                            selectedBook.status === st
                              ? 'bg-purple-600 text-white border-purple-500'
                              : 'bg-black/20 text-slate-400 border-white/5 hover:bg-black/40'
                          }`}
                        >
                          {st === 'published' ? '🟢 Publicado' : st === 'coming_soon' ? '🟡 Próximamente' : '🔴 Oculto'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multimedia files attachments fields */}
                  <div className="p-4 rounded-2xl bg-black/20 border border-purple-500/10 space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-purple-400 block">Archivos del Cuento (Auto-Optimización WebP)</span>
                    
                    {/* Cover Art Upload */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold block">1. Ilustración de Portada:</span>
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedBook.coverImage || '/api/media/Imagenes/rompecabezas/10.jpeg'} 
                          alt="Cover preview"
                          className="w-14 h-14 rounded-xl object-cover bg-slate-900 border border-purple-500/20 shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <input 
                            type="text"
                            placeholder="URL de Portada"
                            value={selectedBook.coverImage || ''}
                            onChange={(e) => setSelectedBook(prev => ({ ...prev, coverImage: e.target.value }))}
                            className="w-full bg-[#160d21]/60 border border-purple-500/10 rounded-lg py-1.5 px-3 text-[11px] text-slate-300 focus:outline-none"
                          />
                          <label className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-colors">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{uploadingCover ? 'Optimizando...' : 'Subir Portada (WebP)'}</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              disabled={uploadingCover}
                              onChange={(e) => handleFileUpload(e, 'cover')}
                              className="hidden" 
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* PDF Ebook Upload */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-400 font-bold block">2. Cuento Completo en PDF:</span>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="URL del PDF"
                            value={selectedBook.pdfUrl || ''}
                            onChange={(e) => setSelectedBook(prev => ({ ...prev, pdfUrl: e.target.value }))}
                            className="flex-1 bg-[#160d21]/60 border border-purple-500/10 rounded-lg py-1.5 px-3 text-[11px] text-slate-355 focus:outline-none"
                          />
                          <input 
                            type="text"
                            placeholder="Nombre del PDF"
                            value={selectedBook.pdfFileName || ''}
                            onChange={(e) => setSelectedBook(prev => ({ ...prev, pdfFileName: e.target.value }))}
                            className="w-1/3 bg-[#160d21]/60 border border-purple-500/10 rounded-lg py-1.5 px-3 text-[11px] text-slate-355 focus:outline-none"
                          />
                        </div>
                        <label className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-colors">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{uploadingPdf ? 'Subiendo...' : 'Subir Libro PDF'}</span>
                          <input 
                            type="file" 
                            accept="application/pdf"
                            disabled={uploadingPdf}
                            onChange={(e) => handleFileUpload(e, 'pdf')}
                            className="hidden" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Synopsis & Educational orientation inputs */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Introducción del cuento (Síntesis corta)</label>
                    <textarea
                      placeholder="Breve introducción introductoria..."
                      value={selectedBook.intro || ''}
                      onChange={(e) => setSelectedBook(prev => ({ ...prev, intro: e.target.value }))}
                      rows={2}
                      className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Objetivo Pedagógico</label>
                    <textarea
                      placeholder="Favorecer el desarrollo de las emociones..."
                      value={selectedBook.objective || ''}
                      onChange={(e) => setSelectedBook(prev => ({ ...prev, objective: e.target.value }))}
                      rows={2}
                      className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Resumen del Cuento</label>
                    <textarea
                      placeholder="Luna viaja y sueña..."
                      value={selectedBook.summary || ''}
                      onChange={(e) => setSelectedBook(prev => ({ ...prev, summary: e.target.value }))}
                      rows={2}
                      className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Fundamentación Pedagógica Completa</label>
                    <textarea
                      placeholder="Guía para familias y educadores..."
                      value={selectedBook.fullFundamentacion || ''}
                      onChange={(e) => setSelectedBook(prev => ({ ...prev, fullFundamentacion: e.target.value }))}
                      rows={6}
                      className="w-full bg-[#160d21]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Coloring Vector SVG Sheets Manager */}
              <div className="p-4 rounded-2xl bg-black/20 border border-purple-500/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 block">3. Láminas para Pintar (Dibujos SVGs):</span>
                  <label className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] uppercase tracking-wider cursor-pointer transition-colors shadow">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadingSvg ? 'Subiendo...' : 'Añadir Lámina (SVG)'}</span>
                    <input 
                      type="file" 
                      accept="image/svg+xml"
                      disabled={uploadingSvg}
                      onChange={(e) => handleFileUpload(e, 'svg')}
                      className="hidden" 
                    />
                  </label>
                </div>

                {(selectedBook.coloringSvgs || []).length === 0 ? (
                  <p className="text-[11px] text-slate-500 font-medium italic">No se han cargado láminas SVGs de colorear para este cuento aún.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {(selectedBook.coloringSvgs || []).map((svgUrl, idx) => (
                      <div key={idx} className="relative group/svgcard p-2 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between items-center text-center">
                        <img 
                          src={svgUrl} 
                          alt={`Sheet ${idx + 1}`}
                          className="w-full aspect-square object-contain bg-white/90 p-1.5 rounded-lg mb-2"
                        />
                        <span className="text-[8px] text-slate-400 font-mono truncate w-full">{svgUrl.split('/').pop()}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedBook(prev => ({
                            ...prev,
                            coloringSvgs: (prev.coloringSvgs || []).filter((_, i) => i !== idx)
                          }))}
                          className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover/svgcard:opacity-100 transition-opacity shadow-md"
                          title="Quitar lámina"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message block */}
              {editorMessage && (
                <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 font-medium border ${
                  editorMessage.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/15 border-red-500/30 text-red-300'
                }`}>
                  {editorMessage.type === 'success' ? <Check className="w-4.5 h-4.5 shrink-0" /> : <AlertCircle className="w-4.5 h-4.5 shrink-0" />}
                  <span>{editorMessage.text}</span>
                </div>
              )}

              {/* Form Footer Action Row */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <button
                  type="submit"
                  disabled={savingBook}
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-xl text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-md shadow-emerald-950/40"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingBook ? 'Guardando...' : 'Guardar Cuento en DB'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedBook(null); setActiveTab('books'); }}
                  className="text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Media Database Assets Manager */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-sans font-black uppercase tracking-wider text-slate-350">Repositorio Multimedia en PostgreSQL</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Listado completo de binarios almacenados en base64 en la base de datos de producción.</p>
                </div>
                <button
                  onClick={fetchMediaList}
                  className="text-[10px] font-black uppercase tracking-wider text-purple-300 hover:text-white px-3 py-2 bg-purple-500/15 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-all"
                >
                  Recargar Biblioteca
                </button>
              </div>

              {loadingMedia ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">Leyendo base de datos multimedia...</p>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="text-center py-20 bg-[#160d21]/30 border border-purple-500/10 rounded-2xl">
                  <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No se encontraron archivos en la base de datos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediaList.map(asset => {
                    const isImage = asset.contentType.startsWith('image/') || asset.assetPath.endsWith('.svg');
                    const isPdf = asset.contentType === 'application/pdf';

                    return (
                      <div 
                        key={asset.id}
                        className="p-4 bg-[#160d21]/45 border border-purple-500/10 hover:border-purple-500/20 rounded-2xl flex gap-4 items-center justify-between"
                      >
                        <div className="flex gap-3 items-center min-w-0">
                          <div className="w-16 h-16 rounded-xl bg-slate-950 border border-purple-500/15 overflow-hidden flex items-center justify-center shrink-0">
                            {isImage ? (
                              <img 
                                src={`/api/media/${asset.assetPath}`} 
                                alt={asset.assetPath} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Fallback indicator
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : isPdf ? (
                              <FileText className="w-8 h-8 text-red-400" />
                            ) : (
                              <FileText className="w-8 h-8 text-slate-500" />
                            )}
                          </div>
                          
                          <div className="min-w-0">
                            <p 
                              className="text-xs font-black truncate text-white" 
                              title={`/api/media/${asset.assetPath}`}
                            >
                              {asset.assetPath.split('/').pop()}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold truncate">{asset.assetPath}</p>
                            <div className="flex gap-2 text-[9px] text-purple-300 font-bold mt-1 uppercase">
                              <span>{asset.contentType.split('/').pop()}</span>
                              <span>•</span>
                              <span>{formatSize(asset.sizeBytes)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <a 
                            href={`/api/media/${asset.assetPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors"
                            title="Ver en pestaña nueva"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteMedia(asset.id)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors"
                            title="Eliminar de base de datos"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
