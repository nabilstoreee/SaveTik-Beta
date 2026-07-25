import React from 'react';
import { WifiOff, RefreshCw, ArrowLeft, CloudOff } from 'lucide-react';

interface OfflinePageProps {
  onRetry: () => void;
  onBack?: () => void;
}

export default function OfflinePage({ onRetry, onBack }: OfflinePageProps) {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
      <div className="bg-neo-card neo-border shadow-neo p-8 md:p-12 rounded-[20px] transition-colors">
        <div className="w-20 h-20 bg-[#FFE4E6] dark:bg-[#4A1D1D] text-[#E11D48] dark:text-[#FF4D4D] neo-border rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-neo-sm animate-bounce">
          <WifiOff size={40} className="stroke-[3]" />
        </div>

        <div className="inline-block px-3 py-1 bg-[#FFE600] text-black font-heading font-black text-xs uppercase neo-border-thin mb-4 rounded-md">
          OFFLINE MODE DETECTED
        </div>

        <h2 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tighter text-neo-text mb-3">
          KONEKSI INTERNET TERPUTUS
        </h2>

        <p className="text-xs md:text-sm font-bold text-neo-text opacity-80 leading-relaxed mb-8 max-w-md mx-auto">
          Kamu sedang tidak terhubung ke internet. Beberapa fitur online seperti ekstraksi video baru memerlukan koneksi internet aktif. Riwayat dan video favorit yang sudah tersimpan sebelumnya masih dapat diakses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-heading font-black text-xs uppercase tracking-wider neo-border shadow-neo-btn transition-all active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer rounded-xl"
          >
            <RefreshCw size={16} className="stroke-[3]" />
            COBA SAMBUNGKAN KEMBALI
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3.5 bg-neo-card hover:bg-neo-bg-sec text-neo-text font-heading font-black text-xs uppercase tracking-wider neo-border shadow-neo-btn transition-all active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer rounded-xl"
            >
              <ArrowLeft size={16} className="stroke-[3]" />
              KEMBALI
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t-2 border-neo-border flex items-center justify-center gap-2 text-[10px] font-mono font-bold text-neo-text opacity-60">
          <CloudOff size={14} /> SaveTik Offline Fallback Engine v2.0
        </div>
      </div>
    </div>
  );
}
