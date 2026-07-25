import React, { useRef, useEffect, useState } from 'react';
import { Heart, ArrowLeft, MessageSquare, ExternalLink, ShoppingBag, Download, AlertCircle } from 'lucide-react';

const donationBanner = "/donation_banner.jpg";

interface DonationSectionProps {
  onBack: () => void;
  showToast?: (message: string, type: 'success' | 'warning' | 'error') => void;
}

export default function DonationSection({ onBack, showToast }: DonationSectionProps) {
  const timerRef = useRef<any>(null);
  const isLongPressActive = useRef(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (imageError) return;
    isLongPressActive.current = true;
    timerRef.current = setTimeout(() => {
      if (isLongPressActive.current) {
        handleSaveImage();
      }
    }, 800); // 800ms for long press
  };

  const handlePressEnd = () => {
    isLongPressActive.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handlePressLeave = () => {
    isLongPressActive.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleSaveImage = () => {
    if (imageError) return;
    const link = document.createElement('a');
    link.href = donationBanner;
    link.download = 'savetik_donation_qr.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Gambar QR Code berhasil disimpan ke galeri!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" id="donation-section">
      
      {/* Back to main menu button (top) */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-neo-card hover:bg-neo-bg-sec text-neo-text font-heading font-black text-xs md:text-sm uppercase tracking-wider border-[3px] border-neo-border shadow-[3px_3px_0px_0px_var(--neo-border)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--neo-border)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={14} className="stroke-[3]" />
          MENU UTAMA
        </button>
      </div>

      {/* SUPPORT / DONASI SECTION */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="text-[#E11D48] fill-[#E11D48] stroke-[3]" size={28} />
          <h2 className="font-heading font-black text-2xl md:text-4xl uppercase tracking-tight text-neo-text">
            SUPPORT / DONASI
          </h2>
        </div>

        <p className="text-xs md:text-sm font-semibold text-neo-text opacity-70 leading-relaxed mb-8">
          SaveTik Downloader gratis dan gak pakai iklan. Kalau layanan ini bermanfaat, dukungan kamu bantu banget buat biaya server & pengembangan fitur baru.
        </p>

        {/* DONATION BANNER IMAGE & ACTIONS CONTAINER */}
        <div className="mb-8 max-w-[280px] sm:max-w-[320px] mx-auto flex flex-col gap-3">
          <div 
            className="relative border-[3px] border-neo-border rounded-[15px] overflow-hidden shadow-[5px_5px_0px_0px_#E11D48] bg-neo-card select-none active:scale-[0.98] transition-transform"
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressLeave}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            title={imageError ? "QR Code belum diunggah" : "Tekan lama untuk mengunduh"}
          >
            {!imageError ? (
              <>
                <img 
                  src={donationBanner} 
                  alt="Donation Banner" 
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-auto pointer-events-auto block"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/75 py-1.5 text-center text-[10px] text-white font-mono font-bold opacity-0 hover:opacity-100 transition-opacity uppercase">
                  TEKAN LAMA UNTUK UNDUH
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-3 min-h-[220px] flex flex-col justify-center items-center bg-[#FEF2F2] dark:bg-[#451A1A]">
                <AlertCircle className="text-[#E11D48] animate-bounce" size={40} />
                <h4 className="font-heading font-black text-sm text-[#991B1B] dark:text-[#FCA5A5] uppercase">
                  QR CODE BELUM AKTIF
                </h4>
                <p className="text-[11px] font-semibold text-[#7F1D1D] dark:text-[#FECACA] opacity-90 leading-relaxed">
                  Gambar QR Code donasi belum diupload ke server. Tenang! Kamu bisa donasi langsung lewat tombol kontak di bawah.
                </p>
              </div>
            )}
          </div>

          {/* SIMPAN GAMBAR BUTTON */}
          <button
            onClick={handleSaveImage}
            disabled={imageError}
            className={`w-full py-3 font-heading font-black text-xs md:text-sm uppercase tracking-wider border-[3px] border-neo-border rounded-[8px] transition-all flex items-center justify-center gap-2 select-none ${
              imageError 
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed border-dashed opacity-50' 
                : 'bg-[#10B981] hover:bg-[#059669] text-white shadow-[4px_4px_0px_0px_var(--neo-border)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--neo-border)] cursor-pointer'
            }`}
          >
            <Download size={16} className="stroke-[3]" />
            SIMPAN GAMBAR
          </button>
        </div>

        {/* DANA & GoPay Donation Info Card (Moved below Simpan Gambar button) */}
        <div className="mb-8 max-w-lg mx-auto bg-neo-card border-[3px] border-neo-border p-5 rounded-[12px] shadow-[4px_4px_0px_0px_var(--neo-border)] space-y-4">
          <h3 className="font-heading font-black text-sm uppercase tracking-wide text-neo-text text-center border-b-2 border-neo-border pb-2">
            Donasi Via E-Wallet (DANA & GoPay)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-neo-bg border-[2px] border-neo-border rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-black uppercase text-blue-600 dark:text-blue-400 block">DANA</span>
                <span className="font-mono font-bold text-sm text-neo-text select-all">085702526159</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('085702526159');
                  if (showToast) showToast('Nomor DANA berhasil disalin!', 'success');
                }}
                className="px-2.5 py-1.5 bg-[#FFE600] text-black font-heading font-black text-[10px] uppercase border-[2px] border-neo-border rounded shadow-[2px_2px_0px_0px_var(--neo-border)] active:translate-y-0.5 cursor-pointer"
              >
                Salin
              </button>
            </div>

            <div className="p-3 bg-neo-bg border-[2px] border-neo-border rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-black uppercase text-emerald-600 dark:text-emerald-400 block">GoPay</span>
                <span className="font-mono font-bold text-sm text-neo-text select-all">085702526159</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('085702526159');
                  if (showToast) showToast('Nomor GoPay berhasil disalin!', 'success');
                }}
                className="px-2.5 py-1.5 bg-[#FFE600] text-black font-heading font-black text-[10px] uppercase border-[2px] border-neo-border rounded shadow-[2px_2px_0px_0px_var(--neo-border)] active:translate-y-0.5 cursor-pointer"
              >
                Salin
              </button>
            </div>
          </div>

          <p className="text-center font-heading font-bold text-xs text-neo-text opacity-95 pt-1">
            Terimakasih yang sudah berdonasi ke server kami ❤️
          </p>
        </div>

        {/* EXTERNAL ACTION LINKS (CONTACT / WEBSITE) */}
        <div className="space-y-4 max-w-lg mx-auto">
          
          {/* Contact Owner Link */}
          <a
            href="https://wa.me/6289677157146"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-neo-card hover:bg-neo-bg-sec text-neo-text font-heading font-black text-xs md:text-sm uppercase tracking-wider border-[3px] border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--neo-border)] transition-all flex items-center justify-between px-5 cursor-pointer rounded-[8px]"
          >
            <span className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#10B981] stroke-[3]" />
              CONTACT OWNER
            </span>
            <ExternalLink size={14} className="stroke-[3] text-neo-text opacity-50" />
          </a>

          {/* Website Buy Otomatis Link */}
          <a
            href="https://www.nabil-official.web.id"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-neo-card hover:bg-neo-bg-sec text-neo-text font-heading font-black text-xs md:text-sm uppercase tracking-wider border-[3px] border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--neo-border)] transition-all flex items-center justify-between px-5 cursor-pointer rounded-[8px]"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#6366F1] stroke-[3]" />
              WEBSITE BUY OTOMATIS
            </span>
            <ExternalLink size={14} className="stroke-[3] text-neo-text opacity-50" />
          </a>

        </div>

      </section>

      {/* Huge Back Button at bottom */}
      <div className="mt-12">
        <button
          onClick={onBack}
          className="w-full py-4 bg-neo-border hover:opacity-90 text-neo-bg font-heading font-black text-sm md:text-base uppercase tracking-wider border-[3px] border-neo-border shadow-[4px_4px_0px_0px_#F97316] hover:shadow-[2px_2px_0px_0px_#F97316] transition-all cursor-pointer text-center rounded-[8px]"
        >
          ← KEMBALI KE MENU UTAMA
        </button>
      </div>

    </div>
  );
}
