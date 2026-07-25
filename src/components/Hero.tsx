import React, { useState, FormEvent, useEffect } from 'react';
import { Download, Clipboard, Link2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HeroProps {
  onExtract: (url: string) => Promise<void>;
  loading: boolean;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const PLATFORMS = ['TIKTOK', 'YOUTUBE', 'INSTAGRAM', 'SPOTIFY', 'CAPCUT', 'FACEBOOK'];

export default function Hero({ onExtract, loading, showToast }: HeroProps) {
  const [url, setUrl] = useState('');
  const [displayPlatform, setDisplayPlatform] = useState(PLATFORMS[0]);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Platform detection logic with simulated delay
  useEffect(() => {
    if (!url) {
      setDetectedPlatform(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const urlLower = url.toLowerCase();
    
    // Simulate a brief "searching" animation
    const searchTimer = setTimeout(() => {
      setIsSearching(false);
      if (urlLower.includes('tiktok.com')) {
        setDetectedPlatform('TIKTOK');
      } else if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
        setDetectedPlatform('YOUTUBE');
      } else if (urlLower.includes('instagram.com')) {
        setDetectedPlatform('INSTAGRAM');
      } else if (urlLower.includes('spotify.com')) {
        setDetectedPlatform('SPOTIFY');
      } else if (urlLower.includes('capcut.com')) {
        setDetectedPlatform('CAPCUT');
      } else if (urlLower.includes('facebook.com') || urlLower.includes('fb.watch')) {
        setDetectedPlatform('FACEBOOK');
      } else {
        setDetectedPlatform('UNKNOWN');
      }
    }, 800);

    return () => clearTimeout(searchTimer);
  }, [url]);

  // Cycling animation logic
  useEffect(() => {
    if (!isSearching) return;

    const interval = setInterval(() => {
      setDisplayPlatform((prev) => {
        const currentIndex = PLATFORMS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % PLATFORMS.length;
        return PLATFORMS[nextIndex];
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSearching]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      showToast('tempel link tiktok ig youtube video disini', 'warning');
      return;
    }

    await onExtract(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        showToast('Tersalin!', 'success');
      } else {
        showToast('Clipboard empty!', 'warning');
      }
    } catch (err) {
      showToast('Gagal mengakses clipboard.', 'warning');
    }
  };

  return (
    <section className="pt-8 pb-4 md:pt-12 md:pb-6 px-4 md:px-8 max-w-5xl mx-auto text-center">
      {/* Badge Decorative */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <div className="inline-flex items-center gap-1.5 bg-[#DBEAFE] dark:bg-[#1E293B] text-[#1E3A8A] dark:text-blue-300 neo-border-thin px-3 py-1.5 rounded-[30px] text-xs font-black uppercase tracking-wider rotate-[-1deg] shadow-xs">
          <Sparkles size={14} className="text-[#1E3A8A] dark:text-blue-300" />
          SAVETIK VERSI BETA V1.0
        </div>
      </div>

      {/* Fluid Main Heading */}
      <h1 className="font-heading font-black tracking-tighter uppercase leading-[0.9] text-neo-text mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
        SATU TAUTAN <br />
        <span className="bg-[#E11D48] text-white px-3 inline-block rotate-[1deg] neo-border my-2">
          SEMUA PLATFORM
        </span>
      </h1>

      <p className="max-w-2xl mx-auto text-neo-text opacity-70 font-medium text-base md:text-lg mb-10 leading-relaxed">
        Ekstrak video TikTok tanpa watermark, konversi video YouTube menjadi MP4/MP3 kualitas tinggi, serta download konten Instagram secara gratis dan instan.
      </p>

      {/* Main Downloader Input Box */}
      <div className="max-w-3xl mx-auto mb-10">
        <form 
          onSubmit={handleSubmit} 
          className="bg-neo-card neo-border p-4 md:p-6 shadow-neo mb-3 flex flex-col md:flex-row gap-4 items-stretch rounded-2xl"
        >
          <div className="flex-1 flex flex-col gap-3">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-neo-text opacity-50">
                <Link2 size={20} className="stroke-[3]" />
              </div>
              <input 
                id="downloader-url-input"
                type="url"
                placeholder="tempel link tiktok ig youtube video disini"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-11 pr-24 py-3.5 neo-border-thin bg-neo-bg text-neo-text focus:bg-neo-card focus:outline-none focus:ring-3 focus:ring-[#6366F1] font-semibold text-sm transition-all rounded-xl"
              />
              {/* Paste button inside input */}
              <button
                id="paste-btn"
                type="button"
                onClick={handlePaste}
                className="absolute right-2 px-3 py-1.5 bg-neo-bg-sec hover:bg-neo-bg text-neo-text text-xs font-black uppercase neo-border-thin flex items-center gap-1 active:translate-y-0.5 rounded-lg cursor-pointer"
                title="Paste Clipboard Content"
              >
                <Clipboard size={12} className="stroke-[3]" />
                TEMPEL
              </button>
            </div>

            {/* Platform Status Indicator */}
            {url.length > 0 && (
              <div className="flex items-center gap-3 px-1 animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="w-2.5 h-2.5 bg-[#00D1FF] neo-border-thin border-neo-border" />
                <div className="flex items-center gap-2">
                   <div className={`${detectedPlatform && !isSearching ? (detectedPlatform === 'YOUTUBE' ? 'bg-[#E11D48]' : 'bg-[#84CC16]') : 'bg-gray-400'} p-0.5 rounded-sm transition-colors`}>
                     <CheckCircle2 size={10} className="text-white" />
                   </div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-neo-text flex items-center gap-2">
                    {isSearching ? (
                      <>STATUS <span className="text-gray-400">·</span> <span className="animate-pulse">{displayPlatform}</span></>
                    ) : detectedPlatform ? (
                      <>DETECTED <span className="text-gray-400">·</span> <span className={detectedPlatform === 'YOUTUBE' ? 'text-[#E11D48]' : 'text-[#6366F1]'}>{detectedPlatform}</span></>
                    ) : null}
                  </span>
                </div>
              </div>
            )}

            {/* YouTube Maintenance Notice */}
            {detectedPlatform === 'YOUTUBE' && !isSearching && (
              <div className="bg-[#FFF9EB] dark:bg-[#322812] neo-border-thin p-3 rounded-xl flex items-start gap-2.5 text-left text-xs font-bold text-[#B45309] dark:text-[#FCD34D] animate-in fade-in duration-200 mt-1">
                <AlertTriangle size={16} className="shrink-0 stroke-[2.5] mt-0.5" />
                <p className="font-bold leading-relaxed">
                  Mohon maaf, server downloader YouTube sedikit ada masalah untuk sementara ini. Silakan gunakan dulu pengunduhan TikTok dan Instagram yang tetap aktif & normal terimakasih :)
                </p>
              </div>
            )}
          </div>

          <button 
            id="submit-download-btn"
            type="submit"
            disabled={loading}
            className="bg-[#6366F1] text-white py-3.5 px-8 neo-btn text-base font-black tracking-wide uppercase select-none md:w-auto cursor-pointer rounded-xl"
          >
            {loading ? (
              <span className="font-mono text-xs animate-pulse flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                MEMPROSES...
              </span>
            ) : (
              <>
                <Download size={18} className="stroke-[3]" />
                EKSTRAK MEDIA
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
