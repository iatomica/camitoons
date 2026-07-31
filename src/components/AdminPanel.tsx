import React, { useState, useEffect } from 'react';
import { BookStory } from '../data/booksCatalog';
import { 
  X, Lock, User, Key, Database, FileText, Image as ImageIcon, 
  Trash2, Plus, Edit2, Save, UploadCloud, Eye, EyeOff, Sparkles, 
  Check, AlertCircle, FilePlus, Copy, Search, Sliders 
} from 'lucide-react';

interface AdminPanelProps {
  darkMode: boolean;
  onClose: () => void;
  onRefreshBooks: () => void;
  books: BookStory[];
  blocks?: any;
  onRefreshBlocks?: () => void;
}

interface MediaAsset {
  id: number;
  assetPath: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  darkMode, 
  onClose, 
  onRefreshBooks, 
  books
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Tab state: 'books' | 'edit-book' | 'media'
  const [activeTab, setActiveTab] = useState<'books' | 'edit-book' | 'media'>('books');

  // Media files state
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);

  // WordPress-style media selection
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [mediaSearch, setMediaSearch] = useState<string>('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'pdf'>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Media Chooser target inside book form: 'cover' | 'pdf' | null
  const [mediaChooserTarget, setMediaChooserTarget] = useState<'cover' | 'pdf' | null>(null);

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
    if (isAuthenticated && (activeTab === 'media' || mediaChooserTarget)) {
      fetchMediaList();
    }
  }, [isAuthenticated, activeTab, mediaChooserTarget]);

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
        if (selectedAsset?.id === mediaId) {
          setSelectedAsset(null);
        }
      }
    } catch (err) {
      console.error('Error deleting media:', err);
    }
  };

  const handleCopyLink = (assetPath: string) => {
    const fullUrl = `${window.location.origin}/api/media/${assetPath}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedPath(assetPath);
      setTimeout(() => setCopiedPath(null), 2000);
    });
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

  // Filter media list by search query and type
  const filteredMedia = mediaList.filter(asset => {
    const filename = asset.assetPath.split('/').pop() || '';
    const matchesSearch = filename.toLowerCase().includes(mediaSearch.toLowerCase()) || 
                          asset.assetPath.toLowerCase().includes(mediaSearch.toLowerCase());
    
    if (mediaFilter === 'image') {
      return matchesSearch && (asset.contentType.startsWith('image/') || asset.assetPath.endsWith('.svg'));
    } else if (mediaFilter === 'pdf') {
      return matchesSearch && asset.contentType === 'application/pdf';
    }
    return matchesSearch;
  });

  // Login Portal View (Full Page View)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
          <div className="inline-flex p-4 rounded-3xl bg-purple-500/10 text-purple-400 border border-purple-500/25 shadow-lg shadow-purple-950/20">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-wider text-white">Consola de Control</h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">Ingresa las credenciales autorizadas del proyecto para administrar la base de datos de CamiToons.</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#12091c] border border-purple-500/20 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
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
                    className="w-full bg-[#1c1229] border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none transition-colors"
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
                    className="w-full bg-[#1c1229] border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3.5 pl-10 pr-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3.5 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-950/40 active:scale-95"
              >
                Acceder como Admin
              </button>
            </form>

            <div className="pt-2 border-t border-white/5 text-center">
              <button 
                onClick={onClose}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                ← Volver al Sitio Web
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main Panel View (Full Page View)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Full-width Layout Header */}
        <div className="bg-[#12091c] border border-purple-500/20 w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#f9f9f9]">
          
          {/* Header Bar */}
          <header className="px-6 py-5 border-b border-white/5 bg-[#160d21]/90 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/35">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-sans font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <span>Consola CamiToons</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/30 tracking-widest animate-pulse">LOCAL-DB-CONNECTED</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold">Gestor del Catálogo de Cuentos y Biblioteca Multimedia</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="text-[10px] font-black uppercase tracking-wider bg-red-600/10 hover:bg-red-600/20 border border-red-500/35 text-red-300 px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-red-950/20"
              >
                Cerrar Sesión
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors"
                title="Volver al Sitio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Tab Navigation Menu */}
          <nav className="flex flex-wrap bg-[#160d21]/45 border-b border-white/5 px-6 gap-2">
            <button
              onClick={() => setActiveTab('books')}
              className={`py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'books' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              📋 Catálogo Cuentos ({books.length})
            </button>
            {selectedBook && (
              <button
                onClick={() => setActiveTab('edit-book')}
                className={`py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTab === 'edit-book' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isCreatingNew ? 'Nuevo Cuento' : 'Editor de Cuento'}</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('media')}
              className={`py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                activeTab === 'media' ? 'border-purple-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              📂 Biblioteca Multimedia
            </button>
          </nav>

          {/* Tab Content Display Area */}
          <div className="flex-1 min-h-[550px] p-6">
            
            {/* TAB 1: Books List */}
            {activeTab === 'books' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-sans font-black uppercase tracking-wider text-slate-300">Cuentos en Base de Datos</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Listado completo de cuentos disponibles para la web.</p>
                  </div>
                  <button
                    onClick={handleCreateBookClick}
                    className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black px-5 py-3 rounded-xl text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-md shadow-purple-950/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Cuento</span>
                  </button>
                </div>

                {books.length === 0 ? (
                  <div className="text-center py-20 space-y-4 bg-[#160d21]/30 border border-purple-500/10 rounded-2xl">
                    <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
                    <p className="text-sm font-bold text-slate-400">No se encontraron cuentos en la base de datos.</p>
                    <button onClick={handleCreateBookClick} className="text-xs font-extrabold text-purple-400 hover:underline">
                      Crear el primer cuento ahora
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {books.map(book => (
                      <div 
                        key={book.id}
                        className="p-4 rounded-2xl bg-[#160d21]/45 border border-purple-500/10 hover:border-purple-500/20 transition-all flex items-start justify-between gap-4 shadow-sm"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img 
                            src={book.coverImage || '/api/media/Imagenes/rompecabezas/10.jpeg'} 
                            alt={book.displayTitle}
                            className="w-16 h-16 rounded-2xl object-cover border border-purple-500/15 shrink-0 bg-slate-900 shadow-inner"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-black text-white truncate max-w-[200px]" title={book.displayTitle}>{book.displayTitle}</span>
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
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{book.id} • {book.recommendedAge}</p>
                            {book.pdfFileName && (
                              <p className="text-[9px] text-purple-400 font-bold flex items-center gap-1 mt-1 truncate max-w-[220px]" title={book.pdfFileName}>
                                <FileText className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{book.pdfFileName}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleEditBookClick(book)}
                            className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-colors"
                            title="Editar cuento"
                          >
                            <Edit2 className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-350 border border-red-500/20 transition-colors"
                            title="Eliminar cuento"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Book Creator / Editor Form */}
            {activeTab === 'edit-book' && selectedBook && (
              <form onSubmit={handleSaveBook} className="space-y-6">
                
                {/* Form Title */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h4 className="text-sm font-sans font-black uppercase tracking-wider text-purple-300">
                    {isCreatingNew ? 'Registrar Nuevo Cuento' : `Editar Cuento: ${selectedBook.displayTitle}`}
                  </h4>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">ID del Cuento (Clave Única - Ej: `luna-sonidos`)</label>
                      <input 
                        type="text"
                        required
                        disabled={!isCreatingNew}
                        value={selectedBook.id || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, id: e.target.value }))}
                        className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Título del Cuento (Búsqueda/SEO)</label>
                      <input 
                        type="text"
                        required
                        value={selectedBook.title || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Título de Pantalla (Visual)</label>
                      <input 
                        type="text"
                        required
                        value={selectedBook.displayTitle || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, displayTitle: e.target.value }))}
                        className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Edad Recomendada</label>
                        <select
                          value={selectedBook.recommendedAge || '2 años'}
                          onChange={(e) => setSelectedBook(prev => ({ ...prev, recommendedAge: e.target.value }))}
                          className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                        >
                          <option value="2 años" className="bg-[#12091c]">2 años</option>
                          <option value="3 años" className="bg-[#12091c]">3 años</option>
                          <option value="4 años" className="bg-[#12091c]">4 años</option>
                          <option value="Todas las edades" className="bg-[#12091c]">Todas las edades</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Estado de Publicación</label>
                        <select
                          value={selectedBook.status || 'published'}
                          onChange={(e) => setSelectedBook(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                        >
                          <option value="published" className="bg-[#12091c]">Publicado (Visible)</option>
                          <option value="coming_soon" className="bg-[#12091c]">Próximamente (Bloqueado)</option>
                          <option value="hidden" className="bg-[#12091c]">Oculto (Borrador)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Carpeta de Archivos (Opcional - Ej: `1 cuentos_luna`)</label>
                      <input 
                        type="text"
                        value={selectedBook.folderName || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, folderName: e.target.value }))}
                        className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Right Column Fields */}
                  <div className="space-y-4">
                    
                    {/* Media Options (Subir o Biblioteca) */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Cover Image URL & Upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Imagen de Portada</label>
                        <div className="w-full h-28 rounded-2xl bg-[#1c1229]/50 border border-dashed border-purple-500/20 overflow-hidden flex flex-col items-center justify-center p-2 relative group/cover">
                          {selectedBook.coverImage ? (
                            <>
                              <img src={selectedBook.coverImage} alt="Cover Preview" className="w-full h-full object-contain" />
                              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col gap-1 items-center justify-center p-1.5">
                                <label className="cursor-pointer text-[8px] font-black uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-750 px-2.5 py-1.5 rounded-lg w-full text-center">
                                  {uploadingCover ? 'Subiendo...' : 'Subir Portada'}
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'cover')} disabled={uploadingCover} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setMediaChooserTarget('cover')}
                                  className="text-[8px] font-black uppercase tracking-wider text-purple-300 bg-[#160d21] hover:bg-purple-500/10 border border-purple-500/30 px-2.5 py-1.5 rounded-lg w-full"
                                >
                                  Elegir Biblioteca
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{uploadingCover ? 'Subiendo...' : 'Portada Cuento'}</span>
                              <div className="flex flex-col gap-1 w-full max-w-[120px]">
                                <label className="cursor-pointer text-[8px] font-black uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 px-2.5 py-1 rounded-lg block text-center">
                                  Subir
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'cover')} disabled={uploadingCover} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setMediaChooserTarget('cover')}
                                  className="text-[8px] font-black uppercase tracking-wider text-purple-300 bg-[#160d21] hover:bg-purple-500/10 border border-purple-500/30 px-2.5 py-1.5 rounded-lg"
                                >
                                  Biblioteca
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PDF URL & Upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Archivo PDF del Libro</label>
                        <div className="w-full h-28 rounded-2xl bg-[#1c1229]/50 border border-dashed border-purple-500/20 overflow-hidden flex flex-col items-center justify-center p-2 relative group/pdf">
                          {selectedBook.pdfUrl ? (
                            <div className="text-center p-1 w-full">
                              <FileText className="w-5 h-5 text-red-400 mx-auto" />
                              <span className="text-[8px] font-bold text-slate-350 block truncate max-w-[100px] mx-auto mt-0.5">{selectedBook.pdfFileName || 'libro.pdf'}</span>
                              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/pdf:opacity-100 transition-opacity flex flex-col gap-1 items-center justify-center p-1.5">
                                <label className="cursor-pointer text-[8px] font-black uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-750 px-2.5 py-1.5 rounded-lg w-full text-center">
                                  {uploadingPdf ? 'Subiendo...' : 'Subir PDF'}
                                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} disabled={uploadingPdf} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setMediaChooserTarget('pdf')}
                                  className="text-[8px] font-black uppercase tracking-wider text-purple-300 bg-[#160d21] hover:bg-purple-500/10 border border-purple-500/30 px-2.5 py-1.5 rounded-lg w-full"
                                >
                                  Elegir Biblioteca
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{uploadingPdf ? 'Subiendo...' : 'PDF Cuento'}</span>
                              <div className="flex flex-col gap-1 w-full max-w-[120px]">
                                <label className="cursor-pointer text-[8px] font-black uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 px-2.5 py-1 rounded-lg block text-center">
                                  Subir
                                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} disabled={uploadingPdf} />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setMediaChooserTarget('pdf')}
                                  className="text-[8px] font-black uppercase tracking-wider text-purple-300 bg-[#160d21] hover:bg-purple-500/10 border border-purple-500/30 px-2.5 py-1.5 rounded-lg"
                                >
                                  Biblioteca
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Introducción Breve (Resumen rápido)</label>
                      <textarea 
                        rows={2}
                        value={selectedBook.intro || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, intro: e.target.value }))}
                        className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2.5 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Objetivo Pedagógico</label>
                      <input 
                        type="text"
                        value={selectedBook.objective || ''}
                        onChange={(e) => setSelectedBook(prev => ({ ...prev, objective: e.target.value }))}
                        className="w-full bg-[#1c1229]/65 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                </div>

                {/* Extended Text Fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Resumen Didáctico (Aparece en la página de detalles)</label>
                    <textarea 
                      rows={3}
                      value={selectedBook.summary || ''}
                      onChange={(e) => setSelectedBook(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Fundamentación Pedagógica Completa</label>
                    <textarea 
                      rows={5}
                      value={selectedBook.fullFundamentacion || ''}
                      onChange={(e) => setSelectedBook(prev => ({ ...prev, fullFundamentacion: e.target.value }))}
                      className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-3 px-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* SVGs Coloring Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Láminas de Colorear (SVGs cargados)</h5>
                      <p className="text-[9px] text-slate-500 font-bold">Añade archivos SVG para que los niños puedan colorear este cuento de forma interactiva.</p>
                    </div>
                    <label className={`cursor-pointer inline-flex items-center space-x-1.5 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-wider ${uploadingSvg ? 'opacity-50 pointer-events-none' : ''}`}>
                      <FilePlus className="w-3.5 h-3.5" />
                      <span>{uploadingSvg ? 'Subiendo...' : 'Añadir SVG'}</span>
                      <input type="file" accept=".svg" className="hidden" onChange={(e) => handleFileUpload(e, 'svg')} disabled={uploadingSvg} />
                    </label>
                  </div>

                  {(selectedBook.coloringSvgs || []).length === 0 ? (
                    <div className="p-4 rounded-2xl bg-[#1c1229]/30 border border-purple-500/5 text-center text-slate-500 text-xs font-medium">
                      No hay láminas asociadas a este cuento.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {(selectedBook.coloringSvgs || []).map((svgUrl, idx) => (
                        <div key={idx} className="group/svgcard p-2 rounded-xl bg-slate-950 border border-purple-500/10 relative overflow-hidden flex items-center justify-center h-20 shadow-inner">
                          <img src={svgUrl} alt={`Lámina ${idx+1}`} className="max-h-full max-w-full object-contain" />
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

                {/* Editor messages feedback */}
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

                {/* Form Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={savingBook}
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all active:scale-95 shadow-md shadow-emerald-950/40"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingBook ? 'Guardando...' : 'Guardar Cuento en DB'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedBook(null); setActiveTab('books'); }}
                    className="text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: Media Manager (WordPress-Style detail panel) */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                
                {/* Search & Filter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h4 className="text-sm font-sans font-black uppercase tracking-wider text-slate-300">Biblioteca Multimedia PostgreSQL</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Explora y gestiona los recursos subidos. Haz clic en un recurso para ver detalles y previsualizarlo.</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={fetchMediaList}
                      className="text-[10px] font-black uppercase tracking-wider text-purple-300 hover:text-white px-3 py-2 bg-purple-500/15 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl transition-all"
                    >
                      Recargar
                    </button>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Left Column: Grid list (70%) */}
                  <div className="w-full lg:w-8/12 space-y-4">
                    
                    {/* Search and Filters bar */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Search Input */}
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Buscar por nombre o ruta..."
                          value={mediaSearch}
                          onChange={(e) => setMediaSearch(e.target.value)}
                          className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Filters tabs */}
                      <div className="flex border border-purple-500/15 rounded-xl overflow-hidden bg-[#1c1229]/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <button
                          onClick={() => setMediaFilter('all')}
                          className={`px-3.5 py-2 hover:bg-white/5 transition-colors ${mediaFilter === 'all' ? 'bg-purple-600/25 text-white border-r border-purple-500/15' : 'border-r border-purple-500/15'}`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setMediaFilter('image')}
                          className={`px-3.5 py-2 hover:bg-white/5 transition-colors ${mediaFilter === 'image' ? 'bg-purple-600/25 text-white border-r border-purple-500/15' : 'border-r border-purple-500/15'}`}
                        >
                          Imágenes/SVG
                        </button>
                        <button
                          onClick={() => setMediaFilter('pdf')}
                          className={`px-3.5 py-2 hover:bg-white/5 transition-colors ${mediaFilter === 'pdf' ? 'bg-purple-600/25 text-white' : ''}`}
                        >
                          PDFs
                        </button>
                      </div>

                    </div>

                    {loadingMedia ? (
                      <div className="text-center py-20">
                        <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-medium">Leyendo base de datos multimedia...</p>
                      </div>
                    ) : filteredMedia.length === 0 ? (
                      <div className="text-center py-20 bg-[#160d21]/20 border border-purple-500/5 rounded-2xl">
                        <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-medium">No se encontraron archivos en la base de datos que coincidan con la búsqueda.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                        {filteredMedia.map(asset => {
                          const isSelected = selectedAsset?.id === asset.id;
                          const isImage = asset.contentType.startsWith('image/') || asset.assetPath.endsWith('.svg');
                          const isPdf = asset.contentType === 'application/pdf';

                          return (
                            <button
                              type="button"
                              key={asset.id}
                              onClick={() => setSelectedAsset(asset)}
                              className={`w-full aspect-square p-2 rounded-2xl bg-[#160d21]/30 border transition-all flex flex-col items-center justify-center relative overflow-hidden group/card ${
                                isSelected 
                                  ? 'border-purple-500 shadow-md shadow-purple-950/40 bg-purple-950/20' 
                                  : 'border-purple-500/10 hover:border-purple-500/30'
                              }`}
                            >
                              {/* Lightweight Icon Placeholder */}
                              <div className="flex-1 flex items-center justify-center">
                                {isImage ? (
                                  <ImageIcon className={`w-8 h-8 ${isSelected ? 'text-purple-300' : 'text-purple-500/70 group-hover/card:text-purple-400'}`} />
                                ) : isPdf ? (
                                  <FileText className={`w-8 h-8 ${isSelected ? 'text-red-300' : 'text-red-500/70 group-hover/card:text-red-400'}`} />
                                ) : (
                                  <FileText className="w-8 h-8 text-slate-500" />
                                )}
                              </div>

                              {/* Small label at the bottom */}
                              <p className="w-full text-[9px] font-bold truncate text-slate-300 text-center mt-1">
                                {asset.assetPath.split('/').pop()}
                              </p>
                              
                              {/* Badge count index or status check */}
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 p-0.5 bg-purple-50 text-white rounded-full">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Column: WordPress-Style Detail Sidebar Preview (33%) */}
                  <div className="w-full lg:w-4/12 bg-[#1c1229]/35 border border-purple-500/10 rounded-2xl p-5 space-y-5">
                    {selectedAsset ? (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h5 className="text-xs font-black uppercase tracking-wider text-purple-300">Detalle del Archivo</h5>
                          <button 
                            onClick={() => setSelectedAsset(null)}
                            className="text-[9px] font-black uppercase text-slate-400 hover:text-white"
                          >
                            Cerrar
                          </button>
                        </div>

                        {/* Heavy Preview Loaded strictly on-demand */}
                        <div className="w-full aspect-video rounded-xl bg-slate-950 border border-purple-500/15 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                          {selectedAsset.contentType.startsWith('image/') || selectedAsset.assetPath.endsWith('.svg') ? (
                            <img 
                              src={`/api/media/${selectedAsset.assetPath}`} 
                              alt={selectedAsset.assetPath} 
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : selectedAsset.contentType === 'application/pdf' ? (
                            <div className="text-center">
                              <FileText className="w-12 h-12 text-red-400 mx-auto mb-1" />
                              <a 
                                href={`/api/media/${selectedAsset.assetPath}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[10px] font-black text-purple-400 hover:underline"
                              >
                                Ver Documento PDF
                              </a>
                            </div>
                          ) : (
                            <FileText className="w-12 h-12 text-slate-500" />
                          )}
                        </div>

                        {/* Details Fields */}
                        <div className="space-y-3.5 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Nombre de Archivo</span>
                            <p className="font-semibold text-white break-all">{selectedAsset.assetPath.split('/').pop()}</p>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Ruta de Base de Datos</span>
                            <p className="font-semibold text-slate-350 font-mono break-all">{selectedAsset.assetPath}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Tipo de Contenido</span>
                              <p className="font-semibold text-purple-300 font-mono uppercase">{selectedAsset.contentType.split('/').pop()}</p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Tamaño</span>
                              <p className="font-semibold text-purple-300">{formatSize(selectedAsset.sizeBytes)}</p>
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Fecha de Carga</span>
                            <p className="font-semibold text-slate-400">{new Date(selectedAsset.createdAt).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(selectedAsset.assetPath)}
                            className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-purple-950/30"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedPath === selectedAsset.assetPath ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteMedia(selectedAsset.id)}
                            className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar de la DB</span>
                          </button>
                        </div>

                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500">
                        <Sliders className="w-12 h-12 text-slate-600 mb-2" />
                        <p className="text-xs font-semibold">Selecciona un elemento de la biblioteca para ver su preview y detalles de conexión.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Media Chooser Modal Overlay for coverImage/pdfUrl */}
      {mediaChooserTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12091c] border border-purple-500/25 w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#f9f9f9] p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-sans font-black uppercase tracking-wider text-purple-300">Seleccionar de Biblioteca Multimedia</h4>
                <p className="text-[9px] text-slate-400 font-bold">Destino: {mediaChooserTarget === 'cover' ? 'Imagen de Portada' : 'Archivo PDF del Libro'}</p>
              </div>
              <button
                type="button"
                onClick={() => setMediaChooserTarget(null)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media list grid inside chooser */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-1 scrollbar-thin">
              
              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    className="w-full bg-[#1c1229]/60 border border-purple-500/15 focus:border-purple-500/50 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white focus:outline-none"
                  />
                </div>

                <div className="flex border border-purple-500/15 rounded-xl overflow-hidden bg-[#1c1229]/40 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <button
                    type="button"
                    onClick={() => setMediaFilter('all')}
                    className={`px-3 py-1.5 hover:bg-white/5 transition-colors ${mediaFilter === 'all' ? 'bg-purple-600/25 text-white border-r border-purple-500/15' : 'border-r border-purple-500/15'}`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaFilter('image')}
                    className={`px-3 py-1.5 hover:bg-white/5 transition-colors ${mediaFilter === 'image' ? 'bg-purple-600/25 text-white border-r border-purple-500/15' : 'border-r border-purple-500/15'}`}
                  >
                    Imágenes
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaFilter('pdf')}
                    className={`px-3 py-1.5 hover:bg-white/5 transition-colors ${mediaFilter === 'pdf' ? 'bg-purple-600/25 text-white' : ''}`}
                  >
                    PDFs
                  </button>
                </div>
              </div>

              {/* Grid of items */}
              {loadingMedia && mediaList.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">Leyendo biblioteca multimedia...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {mediaList
                    .filter(asset => {
                      const filename = asset.assetPath.split('/').pop() || '';
                      const matchesSearch = filename.toLowerCase().includes(mediaSearch.toLowerCase()) ||
                                            asset.assetPath.toLowerCase().includes(mediaSearch.toLowerCase());
                      
                      if (mediaFilter === 'image') {
                        return matchesSearch && (asset.contentType.startsWith('image/') || asset.assetPath.endsWith('.svg'));
                      }
                      if (mediaFilter === 'pdf') {
                        return matchesSearch && asset.contentType === 'application/pdf';
                      }
                      return matchesSearch;
                    })
                    .map(asset => {
                      const isImage = asset.contentType.startsWith('image/') || asset.assetPath.endsWith('.svg');
                      const isPdf = asset.contentType === 'application/pdf';
                      const filename = asset.assetPath.split('/').pop() || '';

                      return (
                        <button
                          type="button"
                          key={asset.id}
                          onClick={() => {
                            const absoluteUrl = `${window.location.origin}/api/media/${asset.assetPath}`;
                            setSelectedBook(prev => {
                              if (!prev) return prev;
                              if (mediaChooserTarget === 'cover') {
                                return { ...prev, coverImage: absoluteUrl };
                              } else {
                                return { ...prev, pdfUrl: absoluteUrl, pdfFileName: filename };
                              }
                            });
                            setMediaChooserTarget(null);
                          }}
                          className="w-full aspect-square p-2 rounded-2xl bg-[#160d21]/30 border border-purple-500/10 hover:border-purple-500/40 transition-all flex flex-col items-center justify-center relative overflow-hidden group"
                        >
                          <div className="flex-1 flex items-center justify-center">
                            {isImage ? (
                              <img src={`/api/media/${asset.assetPath}`} alt={filename} className="max-w-[50px] max-h-[50px] object-contain rounded" />
                            ) : isPdf ? (
                              <FileText className="w-8 h-8 text-red-500/70" />
                            ) : (
                              <FileText className="w-8 h-8 text-slate-500" />
                            )}
                          </div>
                          <p className="w-full text-[8px] font-bold truncate text-slate-350 text-center mt-1">
                            {filename}
                          </p>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setMediaChooserTarget(null)}
                className="text-xs font-black uppercase bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white border border-white/5"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
