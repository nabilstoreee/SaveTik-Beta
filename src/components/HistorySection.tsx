import { Trash2, ExternalLink, ArrowLeft, Download, CheckSquare, Square } from 'lucide-react';
import { VideoInfo } from '../types';
import { useState, useEffect } from 'react';
import { safeLocalStorage } from '../lib/storage';

interface HistorySectionProps {
  onBack: () => void;
  onSelectVideo: (video: VideoInfo) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export default function HistorySection({ onBack, onSelectVideo, showToast }: HistorySectionProps) {
  const [history, setHistory] = useState<VideoInfo[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  useEffect(() => {
    const saved = safeLocalStorage.getJSON<VideoInfo[]>('savetik_history', []);
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    safeLocalStorage.removeItem('savetik_history');
    setHistory([]);
    setSelectedIndices([]);
    showToast('Riwayat berhasil dikosongkan.', 'success');
  };

  const removeSelected = () => {
    if (selectedIndices.length === 0) {
      showToast('Pilih setidaknya satu riwayat yang ingin dihapus!', 'warning');
      return;
    }
    const newHistory = history.filter((_, idx) => !selectedIndices.includes(idx));
    setHistory(newHistory);
    safeLocalStorage.setJSON('savetik_history', newHistory);
    setSelectedIndices([]);
    showToast('Riwayat yang dipilih berhasil dihapus!', 'success');
  };

  const toggleSelectAll = () => {
    if (selectedIndices.length === history.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(history.map((_, idx) => idx));
    }
  };

  const toggleSelectIndex = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const removeAt = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    safeLocalStorage.setJSON('savetik_history', newHistory);
    setSelectedIndices(selectedIndices.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-neo-card hover:bg-neo-bg-sec text-neo-text font-heading font-black text-xs md:text-sm uppercase tracking-wider border-[3px] border-neo-border shadow-[3px_3px_0px_0px_var(--neo-border)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--neo-border)] transition-all flex items-center gap-2 cursor-pointer rounded-lg"
        >
          <ArrowLeft size={16} strokeWidth={3} /> KEMBALI KE DOWNLOADER
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-tighter text-neo-text">
            RIWAYAT <span className="text-[#6366F1]">DOWNLOAD</span>
          </h2>
          <p className="text-xs font-bold text-neo-text opacity-70 mt-1">
            Centang item riwayat yang ingin dibersihkan, lalu klik Hapus Sekarang.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={toggleSelectAll}
              className="bg-neo-card text-neo-text px-3 py-2 neo-border-thin font-black text-[10px] uppercase hover:opacity-90 transition-colors cursor-pointer rounded-md flex items-center gap-1.5"
            >
              {selectedIndices.length === history.length ? <CheckSquare size={14} className="text-blue-600" /> : <Square size={14} />} 
              {selectedIndices.length === history.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
            </button>

            {selectedIndices.length > 0 && (
              <button 
                onClick={removeSelected}
                className="bg-[#FFE4E6] dark:bg-[#4A1D1D] text-[#E11D48] dark:text-[#FF4D4D] px-3 py-2 neo-border-thin font-black text-[10px] uppercase hover:opacity-90 transition-colors cursor-pointer rounded-md flex items-center gap-1.5 animate-pulse"
              >
                <Trash2 size={12} strokeWidth={3} /> HAPUS SEKARANG ({selectedIndices.length})
              </button>
            )}

            <button 
              onClick={clearHistory}
              className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 neo-border-thin font-black text-[10px] uppercase hover:opacity-90 transition-colors cursor-pointer rounded-md flex items-center gap-1.5"
            >
              <Trash2 size={12} strokeWidth={3} /> HAPUS SEMUA
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-neo-card neo-border shadow-neo p-12 text-center transition-colors">
          <div className="w-16 h-16 bg-neo-bg neo-border flex items-center justify-center mx-auto mb-4 text-neo-text opacity-30">
            <Trash2 size={32} />
          </div>
          <h3 className="font-heading font-black text-xl uppercase mb-2 text-neo-text">
            Riwayat Kosong
          </h3>
          <p className="text-sm text-neo-text opacity-70 font-semibold mb-6">
            Kamu belum menyimpan atau mengunduh video apapun.
          </p>
          <button 
            onClick={onBack}
            className="bg-[#6366F1] text-white px-6 py-3 neo-border shadow-neo-btn font-black text-sm uppercase tracking-wider cursor-pointer"
          >
            MULAI DOWNLOAD
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {history.map((video, index) => {
            const isSelected = selectedIndices.includes(index);
            return (
              <div 
                key={`${video.id}-${index}`}
                className={`bg-neo-card neo-border shadow-neo overflow-hidden flex flex-col group transition-all ${
                  isSelected ? 'ring-4 ring-[#E11D48] border-[#E11D48]' : ''
                }`}
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
                  
                  {/* Checkbox overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      type="button"
                      onClick={() => toggleSelectIndex(index)}
                      className={`w-7 h-7 neo-border flex items-center justify-center rounded cursor-pointer transition-all ${
                        isSelected ? 'bg-[#E11D48] text-white' : 'bg-white/90 text-black hover:bg-white'
                      }`}
                      title={isSelected ? 'Batalkan pilihan' : 'Pilih untuk dihapus'}
                    >
                      {isSelected ? <CheckSquare size={16} strokeWidth={3} /> : <Square size={16} strokeWidth={3} />}
                    </button>
                  </div>

                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white font-black text-[8px] uppercase tracking-widest backdrop-blur-sm neo-border-thin">
                    {video.platform}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={() => onSelectVideo(video)}
                      className="p-3 bg-white text-black neo-border shadow-neo-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title="Lihat Detail"
                    >
                      <ExternalLink size={18} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => removeAt(index)}
                      className="p-3 bg-[#FFE4E6] text-[#E11D48] neo-border shadow-neo-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      title="Hapus"
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
                    className="w-full py-2 bg-neo-bg hover:bg-neo-bg-sec text-neo-text font-black text-[10px] neo-border-thin shadow-neo-sm transition-all active:translate-y-0.5 flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer"
                  >
                    <Download size={14} strokeWidth={3} /> LIHAT UNDUHAN
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
