import React, { useState } from 'react';
import { Instagram, Play, ExternalLink, Heart, MessageCircle, Share2, Sparkles, Check, RefreshCw } from 'lucide-react';
import { SOCIAL_POSTS } from '../data/artworks';
import { SocialPost } from '../types';

interface SocialFeedProps {
  darkMode: boolean;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({ darkMode }) => {
  const [activePlatform, setActivePlatform] = useState<'all' | 'instagram' | 'tiktok' | 'artstation'>('all');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const filteredPosts = SOCIAL_POSTS.filter(
    (post) => activePlatform === 'all' || post.platform === activePlatform
  );

  const toggleLike = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter((p) => p !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };

  const handleShare = (id: string) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <section id="redes" className="py-12 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
            <Instagram className="w-3.5 h-3.5" />
            <span>Redes Sociales & Feed en Vivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Mis Últimas Publicaciones
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Sigue el proceso creativo diario, speedpaints y novedades a través de mis perfiles oficiales.
          </p>
        </div>

        {/* Platform Tabs & Social Profile Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          
          {/* Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1">
            {[
              { id: 'all', label: 'Todos los Feeds' },
              { id: 'instagram', label: 'Instagram' },
              { id: 'tiktok', label: 'TikTok' },
              { id: 'artstation', label: 'ArtStation' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`btn-social-tab-${tab.id}`}
                onClick={() => setActivePlatform(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activePlatform === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* External Social Links Shortcuts */}
          <div className="flex items-center space-x-3 text-xs">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold border border-pink-500/20 hover:bg-pink-500/20 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@camitoons_art</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>@camitoons.studio</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

        </div>

        {/* Social Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => {
            const isLiked = likedPosts.includes(post.id);
            const currentLikes = isLiked ? post.likes + 1 : post.likes;

            return (
              <div
                key={post.id}
                id={`social-card-${post.id}`}
                className={`rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col justify-between ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={post.avatarUrl}
                      alt={post.username}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-purple-400"
                    />
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{post.username}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{post.handle}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {post.platform}
                  </span>
                </div>

                {/* Media Preview */}
                <div className="relative aspect-square bg-slate-950 overflow-hidden group">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {post.videoPreview && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-purple-600 ml-0.5" />
                      </div>
                    </div>
                  )}

                  <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {post.date}
                  </span>
                </div>

                {/* Caption & Actions */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          isLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                        <span>{currentLikes}</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleShare(post.id)}
                      className="hover:text-purple-400 transition-colors"
                      title="Compartir"
                    >
                      {copiedLink === post.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
