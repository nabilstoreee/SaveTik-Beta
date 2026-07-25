import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Download,
  Youtube,
  Instagram
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DownloadResult from './components/DownloadResult';
import SkeletonLoader from './components/SkeletonLoader';
import GuideSection from './components/GuideSection';
import RestrictionsSection from './components/RestrictionsSection';
import DonationSection from './components/DonationSection';
import HistorySection from './components/HistorySection';
import FeedbackSection from './components/FeedbackSection';
import FavoritesSection from './components/FavoritesSection';
import OfflinePage from './components/OfflinePage';
import InstallPwaModal, { usePwaInstall } from './components/InstallPwaModal';
import { VideoInfo } from './types';
import { safeLocalStorage } from './lib/storage';

export default function App() {
  const [extractedVideo, setExtractedVideo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'downloader' | 'guide' | 'restrictions' | 'donation' | 'history' | 'feedback' | 'favorites' | 'offline'>('downloader');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? (navigator.onLine ?? true) : true;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Koneksi internet kembali terhubung!', 'success');
      if (activeView === 'offline') {
        setActiveView('downloader');
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setActiveView('offline');
      showToast('Koneksi internet terputus!', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [activeView]);

  // PWA Install Hook
  const { deferredPrompt, isStandalone, isIos } = usePwaInstall();

  // Mode Tampilan State: 'light' | 'dark' | 'auto'
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>(() => {
    const saved = safeLocalStorage.getItem('savetik-theme-mode');
    if (saved) return saved as 'light' | 'dark' | 'auto';
    return 'auto';
  });

  // System Dark Mode state listener for device schedule
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const effectiveTheme: 'light' | 'dark' = themeMode === 'auto' 
    ? (systemIsDark ? 'dark' : 'light') 
    : themeMode;

  useEffect(() => {
    const root = window.document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    safeLocalStorage.setItem('savetik-theme-mode', themeMode);
  }, [effectiveTheme, themeMode]);

  // Accent & Canvas Color defaults
  const accentColor = '#FFE600';

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = effectiveTheme === 'dark';

    // Set primary accent colors
    root.style.setProperty('--neo-accent', accentColor);
    root.style.setProperty('--neo-accent-text', '#000000');

    // Set canvas website background colors
    const bg = isDark ? '#18141F' : '#FAF8FC';
    const bgSec = isDark ? '#231D2D' : '#F2EEF7';
    const cardBg = isDark ? '#2B2338' : '#FFFFFF';

    root.style.setProperty('--neo-bg', bg);
    root.style.setProperty('--neo-bg-sec', bgSec);
    root.style.setProperty('--neo-card', cardBg);
    document.body.style.backgroundColor = bg;
  }, [effectiveTheme]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      const current = prev === 'auto' ? (systemIsDark ? 'dark' : 'light') : prev;
      return current === 'light' ? 'dark' : 'light';
    });
  };

  // Scrollbar auto-show and auto-hide effect
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | number;
    const handleScroll = () => {
      document.documentElement.classList.add('is-scrolling');
      document.body.classList.add('is-scrolling');
      clearTimeout(scrollTimeout as any);
      scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
        document.body.classList.remove('is-scrolling');
      }, 1000); // Hide after 1 second of inactivity
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout as any);
    };
  }, []);

  // Toast System state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'error') => {
    setToast({ message, type });
  };

  // Auto Dismiss Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleExtract = async (videoUrl: string) => {
    setLoading(true);
    setExtractedVideo(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      const res = await fetch('/api/download/info', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: videoUrl })
      });

      const data = await res.json();

      if (res.ok && data.success && data.videoInfo) {
        setExtractedVideo(data.videoInfo);
        showToast('Video berhasil diekstrak! Pilih format unduhan.', 'success');
        
        // Add to history automatically
        const history = safeLocalStorage.getJSON<any[]>('savetik_history', []);
        if (!history.some((item: any) => item.id === data.videoInfo.id)) {
          safeLocalStorage.setJSON('savetik_history', [data.videoInfo, ...history].slice(0, 50));
        }
      } else {
        showToast(data.message || 'Ekstraksi gagal. Pastikan link video valid.', 'error');
      }
    } catch (err) {
      showToast('Koneksi server terputus. Gagal melakukan ekstraksi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = (video: VideoInfo) => {
    setExtractedVideo(video);
    setActiveView('downloader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text flex flex-col justify-between transition-colors">
      
      {/* 1. TOAST NOTIFICATION SYSTEM */}
      {toast && (
        <div 
          id="toast-container"
          className="fixed top-24 right-4 z-50 max-w-sm w-full bg-neo-card neo-border p-4 shadow-neo flex items-start gap-3 animate-in slide-in-from-right-10 duration-200"
        >
          {/* Toast Icon */}
          <div className="shrink-0">
            {toast.type === 'success' && (
              <div className="p-1 bg-[#E2F7F2] neo-border-thin">
                <CheckCircle size={18} className="text-[#14B8A6] stroke-[3]" />
              </div>
            )}
            {toast.type === 'warning' && (
              <div className="p-1 bg-[#FFF9EB] neo-border-thin">
                <AlertTriangle size={18} className="text-[#FCD34D] stroke-[3]" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="p-1 bg-[#FFF2F8] neo-border-thin">
                <XCircle size={18} className="text-[#E11D48] stroke-[3]" />
              </div>
            )}
          </div>

          {/* Toast Msg */}
          <div className="flex-1">
            <p className="text-xs font-black uppercase text-neo-text tracking-wide">
              {toast.type === 'success' ? 'Berhasil' : toast.type === 'warning' ? 'Perhatian' : 'Kesalahan'}
            </p>
            <p className="text-xs text-neo-text opacity-80 font-bold mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>

          {/* Close Toast */}
          <button 
            id="toast-dismiss-btn"
            onClick={() => setToast(null)}
            className="text-neo-text opacity-40 hover:opacity-100 font-black text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. NAVBAR */}
      <Navbar 
        activeView={activeView}
        onViewChange={setActiveView}
        theme={effectiveTheme}
        onThemeToggle={toggleTheme}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        accentColor={accentColor}
      />

      {/* 3. MAIN APP ROUTING / VIEWS */}
      <main className="flex-grow pb-16">
        
        {activeView === 'guide' ? (
          /* How to Use / FAQ Guide View */
          <GuideSection onBack={() => setActiveView('downloader')} />
        ) : activeView === 'restrictions' ? (
          /* Restrictions View */
          <RestrictionsSection onBack={() => setActiveView('downloader')} />
        ) : activeView === 'donation' ? (
          /* Donation View */
          <DonationSection onBack={() => setActiveView('downloader')} showToast={showToast} />
        ) : activeView === 'history' ? (
          /* History View */
          <HistorySection 
            onBack={() => setActiveView('downloader')} 
            onSelectVideo={handleSelectVideo}
            showToast={showToast}
          />
        ) : activeView === 'favorites' ? (
          /* Favorites / Bookmarks View */
          <FavoritesSection
            onBack={() => setActiveView('downloader')}
            onSelectVideo={handleSelectVideo}
            showToast={showToast}
          />
        ) : activeView === 'offline' ? (
          /* Offline Mode View */
          <OfflinePage
            onRetry={() => {
              if (navigator.onLine) {
                setIsOnline(true);
                setActiveView('downloader');
                showToast('Koneksi internet terhubung kembali!', 'success');
              } else {
                showToast('Masih offline. Periksa koneksi internet Anda.', 'warning');
              }
            }}
            onBack={() => setActiveView('downloader')}
          />
        ) : activeView === 'feedback' ? (
          /* Feedback / Bug Report / Feature Request View */
          <FeedbackSection onBack={() => setActiveView('downloader')} showToast={showToast} />
        ) : (
          /* Landing Downloader View */
          <div className="space-y-4">
            
            {/* Hero extraction forms */}
            <Hero 
              onExtract={handleExtract} 
              loading={loading} 
              showToast={showToast}
            />

            {/* Render loading state */}
            {loading && <SkeletonLoader />}

            {/* Result extracted box */}
            {extractedVideo && (
              <DownloadResult 
                videoInfo={extractedVideo} 
                onClear={() => setExtractedVideo(null)} 
                showToast={showToast}
              />
            )}

            {/* Feature Cards */}
            <section className="py-6 px-4 md:px-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="bg-neo-card p-5 neo-border shadow-neo flex gap-4 items-start">
                  <div className="p-2.5 bg-[#E0E7FF] dark:bg-[#1E1B4B] neo-border-thin shrink-0">
                    <Sparkles size={20} className="text-[#6366F1] stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black uppercase text-sm tracking-wide mb-1 text-neo-text">
                      Bebas Watermark
                    </h3>
                    <p className="text-xs text-neo-text opacity-70 font-medium leading-relaxed">
                      Dapatkan video TikTok murni tanpa logo TikTok yang mengganggu di layar, siap dibagikan ke platform lain.
                    </p>
                  </div>
                </div>

                <div className="bg-neo-card p-5 neo-border shadow-neo flex gap-4 items-start">
                  <div className="p-2.5 bg-[#FFE4E6] dark:bg-[#4C1D95] neo-border-thin shrink-0">
                    <Download size={20} className="text-[#E11D48] stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black uppercase text-sm tracking-wide mb-1 text-neo-text">
                      Audio & MP3 Ultra HD
                    </h3>
                    <p className="text-xs text-neo-text opacity-70 font-medium leading-relaxed">
                      Konversi video musik favorit Anda secara instan ke MP3 murni dengan bit-rate tinggi 320kbps secara otomatis.
                    </p>
                  </div>
                </div>

                <div className="bg-neo-card p-5 neo-border shadow-neo flex gap-4 items-start">
                  <div className="p-2.5 bg-[#FEF2F2] dark:bg-[#7F1D1D] neo-border-thin shrink-0">
                    <Youtube size={20} className="text-[#DC2626] stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black uppercase text-sm tracking-wide mb-1 text-neo-text">
                      YouTube Video
                    </h3>
                    <p className="text-xs text-neo-text opacity-70 font-medium leading-relaxed">
                      Unduh video YouTube dengan kualitas tinggi hingga resolusi 1080p, lengkap dengan suara yang jernih.
                    </p>
                  </div>
                </div>

                <div className="bg-neo-card p-5 neo-border shadow-neo flex gap-4 items-start">
                  <div className="p-2.5 bg-[#FDF2F8] dark:bg-[#50072B] neo-border-thin shrink-0">
                    <Instagram size={20} className="text-[#DB2777] stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black uppercase text-sm tracking-wide mb-1 text-neo-text">
                      Instagram Media
                    </h3>
                    <p className="text-xs text-neo-text opacity-70 font-medium leading-relaxed">
                      Unduh video Reels, foto, carousel, atau postingan slide Instagram dengan mudah tanpa mengurangi kualitas aslinya.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature educational section */}
            <section className="py-12 px-4 md:px-8 max-w-5xl mx-auto">
              <div className="bg-neo-bg-sec border-3 border-neo-border p-6 md:p-10 relative">
                
                {/* Visual Label */}
                <span className="absolute -top-3 left-6 bg-[#6366F1] text-white px-3 py-1 text-xs font-black uppercase tracking-wider neo-border-thin rotate-[-1deg]">
                  BAGAIMANA CARA KERJANYA?
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                  <div className="space-y-2">
                    <div className="font-heading font-black text-2xl text-[#6366F1]">01.</div>
                    <h4 className="font-heading font-black uppercase text-sm tracking-wide text-neo-text">
                      Salin Tautan Video
                    </h4>
                    <p className="text-xs text-neo-text opacity-80 leading-relaxed font-semibold">
                      Buka aplikasi TikTok, YouTube, atau Instagram. Klik bagikan lalu salin tautan media (URL) yang ingin Anda simpan ke perangkat.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="font-heading font-black text-2xl text-[#E11D48]">02.</div>
                    <h4 className="font-heading font-black uppercase text-sm tracking-wide text-neo-text">
                      Tempel & Ekstrak
                    </h4>
                    <p className="text-xs text-neo-text opacity-80 leading-relaxed font-semibold">
                      Tempel tautan di kolom input di atas, lalu tekan tombol "Ekstrak Video" untuk memulai proses analisis secara otomatis.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="font-heading font-black text-2xl text-[#14B8A6]">03.</div>
                    <h4 className="font-heading font-black uppercase text-sm tracking-wide text-neo-text">
                      Unduh Langsung
                    </h4>
                    <p className="text-xs text-neo-text opacity-80 leading-relaxed font-semibold">
                      Pilih kualitas MP4 atau konversi otomatis ke MP3. Klik tombol unduh dan berkas akan segera tersimpan di galeri Anda.
                    </p>
                  </div>
                </div>

              </div>
            </section>

          </div>
        )}

      </main>



      {/* 5. FOOTER */}
      <footer className="bg-neo-card border-t-[4px] border-neo-border py-12 px-4 md:px-8 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand info column */}
          <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl tracking-tight uppercase text-neo-text dark:text-white">
                  Save<span>Tik</span>
                </span>
              </div>
              <p className="text-xs text-neo-text opacity-70 leading-relaxed font-semibold max-w-sm">
                SaveTik adalah platform ekstraktor video modern yang dirancang unduh berkecepatan tinggi untuk kebutuhan pengunduhan media anda seperti tiktok youtube Instagram dll.
              </p>
            <div className="text-[10px] font-mono text-neo-text opacity-50 font-black uppercase">
              Developer Website : Nabil Assihidiqi :)
            </div>
          </div>

          {/* Quick links sitemap */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-heading font-black text-xs uppercase tracking-wider mb-3 text-neo-text">
                Dukungan Platform
              </h5>
              <ul className="space-y-2 text-xs font-semibold text-neo-text opacity-70">
                <li className="hover:text-[#6366F1] transition-colors"><a href="#">TikTok MP4 Video</a></li>
                <li className="hover:text-[#6366F1] transition-colors"><a href="#">TikTok Slideshow</a></li>
                <li className="hover:text-[#6366F1] transition-colors"><a href="#">YouTube Full HD</a></li>
                <li className="hover:text-[#6366F1] transition-colors"><a href="#">YouTube Audio MP3</a></li>
                <li className="hover:text-[#6366F1] transition-colors"><a href="#">Instagram Full HD</a></li>
                <li className="hover:text-[#6366F1] transition-colors"><a href="#">Instagram Slideshow</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-heading font-black text-xs uppercase tracking-wider mb-3 text-neo-text">
                Kebijakan
              </h5>
              <ul className="space-y-2 text-xs font-semibold text-neo-text opacity-70">
                <li className="hover:text-[#E11D48] transition-colors"><a href="#">Terms of Service</a></li>
                <li className="hover:text-[#E11D48] transition-colors"><a href="#">Privacy Policy</a></li>
                <li className="hover:text-[#E11D48] transition-colors"><a href="#">DMCA Copyright</a></li>
                <li className="hover:text-[#E11D48] transition-colors">
                  <button onClick={() => { setActiveView('feedback'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left font-semibold hover:text-[#E11D48] cursor-pointer">
                    Lapor Bug & Feedback
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright badge columns */}
          <div className="md:col-span-3 flex flex-col justify-end items-start md:items-end">
            <p className="text-[10px] font-mono font-black text-neo-text opacity-50 mt-4 md:mt-0">
              © {new Date().getFullYear()} SAVETIK. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      </footer>

      {/* PWA Install Modal */}
      <InstallPwaModal 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)} 
        deferredPrompt={deferredPrompt} 
        isStandalone={isStandalone} 
        isIos={isIos} 
        showToast={showToast} 
      />

    </div>
  );
}
