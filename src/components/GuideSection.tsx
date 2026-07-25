import { BookOpen, HelpCircle, ArrowLeft } from 'lucide-react';

interface GuideSectionProps {
  onBack: () => void;
}

export default function GuideSection({ onBack }: GuideSectionProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Back to main menu button (top) */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-neo-card hover:bg-neo-bg-sec text-neo-text font-heading font-black text-xs md:text-sm uppercase tracking-wider border-[3px] border-neo-border shadow-[3px_3px_0px_0px_var(--neo-border)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--neo-border)] transition-all flex items-center gap-2 cursor-pointer rounded-lg"
        >
          <ArrowLeft size={14} className="stroke-[3]" />
          MENU UTAMA
        </button>
      </div>

      {/* CARA PENGGUNAAN SECTION */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-[#6366F1] stroke-[3]" size={28} />
          <h2 className="font-heading font-black text-2xl md:text-4xl uppercase tracking-tight text-neo-text">
            CARA PENGGUNAAN
          </h2>
        </div>
        <p className="font-mono text-xs md:text-sm font-black text-neo-text opacity-60 uppercase tracking-wider mb-8">
          3 LANGKAH EASY 🚀
        </p>

        {/* 3 Steps Cards */}
        <div className="space-y-6">
          
          {/* Step 1 */}
          <div className="bg-neo-card p-5 border-[3px] border-neo-border rounded-[10px] shadow-[4px_4px_0px_0px_#F97316] flex gap-4 items-start transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FCD34D] border-[3px] border-neo-border rounded-md flex items-center justify-center font-heading font-black text-lg md:text-xl shrink-0 text-black">
              1
            </div>
            <div>
              <h3 className="font-heading font-black text-sm md:text-base uppercase tracking-wide text-neo-text mb-1 flex items-center gap-1.5">
                📋 SALIN LINK
              </h3>
              <p className="text-xs md:text-sm text-neo-text opacity-70 font-semibold leading-relaxed">
                Copy link video/audio dari TikTok, YouTube, Instagram, CapCut, or Spotify.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-neo-card p-5 border-[3px] border-neo-border rounded-[10px] shadow-[4px_4px_0px_0px_#F97316] flex gap-4 items-start transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FCD34D] border-[3px] border-neo-border rounded-md flex items-center justify-center font-heading font-black text-lg md:text-xl shrink-0 text-black">
              2
            </div>
            <div>
              <h3 className="font-heading font-black text-sm md:text-base uppercase tracking-wide text-neo-text mb-1 flex items-center gap-1.5">
                📥 TEMPEL & PROSES
              </h3>
              <p className="text-xs md:text-sm text-neo-text opacity-70 font-semibold leading-relaxed">
                Paste ke kolom input di halaman utama, lalu pencet tombol EKSTRAK VIDEO.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-neo-card p-5 border-[3px] border-neo-border rounded-[10px] shadow-[4px_4px_0px_0px_#F97316] flex gap-4 items-start transition-colors">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FCD34D] border-[3px] border-neo-border rounded-md flex items-center justify-center font-heading font-black text-lg md:text-xl shrink-0 text-black">
              3
            </div>
            <div>
              <h3 className="font-heading font-black text-sm md:text-base uppercase tracking-wide text-neo-text mb-1 flex items-center gap-1.5">
                ✅ UNDUH MEDIA
              </h3>
              <p className="text-xs md:text-sm text-neo-text opacity-70 font-semibold leading-relaxed">
                Tinggal pilih format kualitas terbaik lalu klik tombol unduh.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* TANYA JAWAB LANGSUNG SECTION */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="text-[#E11D48] stroke-[3]" size={28} />
          <h2 className="font-heading font-black text-xl md:text-3xl uppercase tracking-tight text-neo-text">
            TANYA JAWAB (FAQ)
          </h2>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-5">
          
          {/* FAQ 1 */}
          <div className="bg-neo-card p-5 border-[3px] border-neo-border rounded-[10px] shadow-[4px_4px_0px_0px_#F97316] transition-colors">
            <h4 className="font-heading font-black text-sm md:text-base text-[#D97706] mb-2">
              ❓ Ini beneran gratis?
            </h4>
            <p className="text-xs md:text-sm text-neo-text opacity-70 font-semibold leading-relaxed">
              📢 Ya, 100% gratis tanpa batasan jumlah unduhan.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="bg-neo-card p-5 border-[3px] border-neo-border rounded-[10px] shadow-[4px_4px_0px_0px_#F97316] transition-colors">
            <h4 className="font-heading font-black text-sm md:text-base text-[#D97706] mb-2">
              ❓ Apakah butuh login akun?
            </h4>
            <p className="text-xs md:text-sm text-neo-text opacity-70 font-semibold leading-relaxed">
              📢 Tidak perlu. Langsung pakai tanpa mendaftar.
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="bg-neo-card p-5 border-[3px] border-neo-border rounded-[10px] shadow-[4px_4px_0px_0px_#F97316] transition-colors">
            <h4 className="font-heading font-black text-sm md:text-base text-[#D97706] mb-2">
              ❓ Hasil downloadnya ada watermark gak?
            </h4>
            <p className="text-xs md:text-sm text-neo-text opacity-70 font-semibold leading-relaxed">
              📢 Enggak, semua platform yang didukung diambil tanpa watermark.
            </p>
          </div>
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
