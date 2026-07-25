import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ExternalLink, ArrowLeft, Download, Heart } from 'lucide-react';
import { VideoInfo } from '../types';
import { safeLocalStorage } from '../lib/storage';

interface FavoritesSectionProps {
  onBack: () => void;
  onSelectVideo: (video: VideoInfo) => void;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export default function FavoritesSection({ onBack, onSelectVideo, showToast }: FavoritesSectionProps) {
  const [favorites, setFavorites] = useState<VideoInfo[]>([]);

  useEffect(() => {
    const saved = safeLocalStorage.getJSON<VideoInfo[]>('savetik_favorites', []);
    setFavorites(saved);
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(item => item.id !== id);
    setFavorites(updated);
    safeLocalStorage.setJSON('savetik_favorites', updated);
    showToast('Video dihapus dari daftar favorit.', 'success');
  };

  const clearAllFavorites = () => {
    safeLocalStorage.removeItem('savetik_favorites');
    setFavorites([]);
    showToast('Semua playlist favorit berhasil dikosongkan.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-neo-card hover:bg-neo-bg-sec text-neo-text font-heading font-black text-xs md:text-sm uppercase tracking-wider border-[3px] border-neo-border shadow-[3px_3px_0px_0px_var(--neo-border)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--neo-border)] transition-all flex items-center gap-2 cursor-pointer rounded-lg"
        >
          <ArrowLeft size={16} strokeWidth={3} /> KEMBALI KE DOWNLOADER
        </button>

        {favorites.length > 0 && (
          <button
            onClick={clearAllFavorites}
            className="bg-[#FFE4E6] dark:bg-[#4A1D1D] text-[#E11D48] dark:text-[#FF4D4D] px-3 py-2 neo-border-thin font-black text-[10px] uppercase hover:opacity-90 transition-colors cursor-pointer rounded-md flex items-center gap-1.5"
          >
            <Trash2 size={12} strokeWidth={3} /> Hapus Semua Favorit
          </button>
        )}
      </div>

      <div className="mb-8">
        <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tighter text-neo-text flex items-center gap-3">
          <Bookmark size={32} className="text-[#FFE600] fill-[#FFE600] stroke-[3]" />
          Playlist <span className="text-[#6366F1]">Favorit</span>
        </h2>
        <p className="text-xs font-bold text-neo-text opacity-70 mt-1">
          Simpan video favorit ke dalam playlist pribadi di web tanpa perlu akun. Tersimpan otomatis di browser kamu!
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-neo-card neo-border shadow-neo p-12 text-center transition-colors">
          <div className="w-16 h-16 bg-neo-bg neo-border flex items-center justify-center mx-auto mb-4 text-neo-text opacity-30">
            <Heart size={32} />
          </div>
          <h3 className="font-heading font-black text-xl uppercase mb-2 text-neo-text">
            Belum Ada Video Favorit
          </h3>
          <p className="text-sm text-neo-text opacity-70 font-semibold mb-6">
            Klik tombol "Simpan ke Favorit" pada hasil unduhan untuk menambahkan video ke playlist pribadi kamu.
          </p>
          <button 
            onClick={onBack}
            className="bg-[#6366F1] text-white px-6 py-3 neo-border shadow-neo-btn font-black text-sm uppercase tracking-wider cursor-pointer rounded-lg"
          >
            Mulai Cari & Simpan Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {favorites.map((video, index) => (
            <div 
              key={`${video.id || index}`}
              className="bg-neo-card neo-border shadow-neo overflow-hidden flex flex-col group transition-all"
            >
              <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=600&auto=format&fit=crop";
                  }}
                />

                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white font-black text-[8px] uppercase tracking-widest backdrop-blur-sm neo-border-thin">
                  {video.platform}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => onSelectVideo(video)}
                    className="p-3 bg-white text-black neo-border shadow-neo-sm hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-lg"
                    title="Lihat Detail"
                  >
                    <ExternalLink size={18} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={() => removeFavorite(video.id || '')}
                    className="p-3 bg-[#FFE4E6] text-[#E11D48] neo-border shadow-neo-sm hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-lg"
                    title="Hapus dari Favorit"
                  >
                    <Trash2 size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-black text-sm uppercase leading-tight mb-2 line-clamp-2 text-neo-text">
                    {video.title}
                  </h4>
                  <p className="text-[10px] text-neo-text opacity-70 font-bold uppercase truncate mb-4">
                    @{video.authorUniqueId || video.author}
                  </p>
                </div>
                
                <button 
                  onClick={() => onSelectVideo(video)}
                  className="w-full py-2 bg-neo-bg hover:bg-neo-bg-sec text-neo-text font-black text-[10px] neo-border-thin shadow-neo-sm transition-all active:translate-y-0.5 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer rounded-lg"
                >
                  <Download size={14} strokeWidth={3} /> PUTAR / UNDUH
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
