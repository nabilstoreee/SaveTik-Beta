import React, { useState, useEffect } from 'react';
import { Download, X, CheckCircle2, Sparkles } from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  isStandalone: boolean;
  isIos: boolean;
  showToast?: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed & opened as app)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return { deferredPrompt, isStandalone, isIos, setDeferredPrompt };
}

export default function InstallPwaModal({
  isOpen,
  onClose,
  deferredPrompt,
  isStandalone,
  isIos,
  showToast
}: InstallPwaModalProps) {
  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          showToast?.('Aplikasi SaveTik berhasil dipasang di layar utama!', 'success');
        } else {
          showToast?.('Pemasangan aplikasi dibatalkan.', 'warning');
        }
      } catch (err) {
        console.error('Error triggering install prompt:', err);
      } finally {
        onClose();
      }
    } else {
      showToast?.('Pemasangan aplikasi SaveTik diproses ke Layar Utama HP Anda!', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-neo-card neo-border neo-shadow p-6 md:p-8 max-w-lg w-full rounded-2xl relative text-neo-text transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-neo-bg neo-border-thin rounded-lg text-neo-text hover:bg-[#FF6B6B] hover:text-white transition-all active:translate-y-0.5 cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} className="stroke-[3]" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 bg-[#6366F1]/10 text-[#6366F1] dark:bg-[#6366F1]/20 dark:text-[#818cf8] neo-border-thin px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">
          <Sparkles size={14} />
          App Website SaveTik Beta
        </div>

        <h3 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tight mb-2 text-neo-text">
          Install SaveTik diHP anda
        </h3>

        <p className="text-sm font-semibold opacity-80 leading-relaxed mb-6">
          Nikmati akses cepat 1-klik dari layar utama HP atau Komputer Anda tanpa perlu membuka browser lagi. Gratis, ringan, dan cepat!
        </p>

        {/* Benefits list */}
        <div className="bg-neo-bg neo-border p-4 rounded-xl space-y-2.5 mb-6 text-xs font-bold text-neo-text">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-[#10B981] shrink-0 stroke-[3]" />
            <span>Akses langsung tanpa perlu ketik alamat URL lagi</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-[#10B981] shrink-0 stroke-[3]" />
            <span>Tampilan full-screen selayaknya aplikasi native Android/iOS</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-[#10B981] shrink-0 stroke-[3]" />
            <span>Hemat kuota & loading lebih cepat dengan sistem caching modern</span>
          </div>
        </div>

        {/* Installation Status / Direct Action Button */}
        {isStandalone ? (
          <div className="bg-[#E2F7F2] dark:bg-[#1A3A34] neo-border p-4 rounded-xl text-center text-xs font-black text-[#10B981] uppercase mb-2">
            ✓ Aplikasi SaveTik sudah terpasang di perangkat ini!
          </div>
        ) : (
          <div className="mt-4">
            <button
              onClick={handleInstallClick}
              className="w-full py-4 px-6 bg-[#6366F1] hover:bg-[#5558e6] text-white font-heading font-black text-sm md:text-base uppercase tracking-wider neo-border neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 rounded-xl cursor-pointer active:translate-y-1"
            >
              <Download size={20} className="stroke-[3]" />
              INSTALL APP SAVETIK SEKARANG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
