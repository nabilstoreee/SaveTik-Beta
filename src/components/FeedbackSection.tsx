import React, { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';

interface FeedbackSectionProps {
  onBack: () => void;
  showToast: (message: string, type: 'success' | 'warning' | 'error') => void;
}

export default function FeedbackSection({ onBack, showToast }: FeedbackSectionProps) {
  const [type, setType] = useState<'fitur' | 'bug'>('fitur');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const characterLimit = 2000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    
    try {
      // Simulate API post
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      showToast('Kirim Feedback Berhasil! Terima kasih banyak atas masukannya.', 'success');
      setContent('');
      setContact('');
      onBack();
    } catch (err) {
      showToast('Kirim Feedback gagal. Silakan coba lagi nanti.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Menu Utama Back Button */}
      <div className="flex justify-start">
        <button
          id="fb-top-back-btn"
          onClick={onBack}
          className="bg-white dark:bg-[#1E293B] text-neo-text font-black text-xs uppercase px-4 py-2 border-[3px] border-neo-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] flex items-center gap-1.5 hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          <ArrowLeft size={14} className="stroke-[3]" />
          MENU UTAMA
        </button>
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl md:text-3xl font-black font-heading text-neo-text uppercase tracking-tight flex items-center gap-2.5">
            💬 FEEDBACK
          </span>
        </div>
        <p className="text-[10px] md:text-xs font-mono font-black text-neo-text tracking-wider opacity-85 uppercase leading-relaxed">
          NEMU BUG ATAU PUNYA IDE FITUR? KABARIN LANGSUNG KE KAMI 🚀
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Toggle Option (FITUR / BUG) */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            id="fb-type-fitur"
            onClick={() => setType('fitur')}
            className={`py-3 px-4 border-[3px] border-neo-border font-heading font-black text-xs md:text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer select-none rounded-[4px] ${
              type === 'fitur'
                ? 'bg-[#EAB308] text-black shadow-[4px_4px_0px_0px_#000]'
                : 'bg-white dark:bg-[#1E293B] text-neo-text hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            💡 FITUR
          </button>

          <button
            type="button"
            id="fb-type-bug"
            onClick={() => setType('bug')}
            className={`py-3 px-4 border-[3px] border-neo-border font-heading font-black text-xs md:text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer select-none rounded-[4px] ${
              type === 'bug'
                ? 'bg-[#EAB308] text-black shadow-[4px_4px_0px_0px_#000]'
                : 'bg-white dark:bg-[#1E293B] text-neo-text hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            🐛 BUG
          </button>
        </div>

        {/* Text Area Description */}
        <div className="space-y-2">
          <label className="block text-[10px] md:text-xs font-mono font-black text-neo-text uppercase tracking-wider">
            CERITAIN DETAILNYA
          </label>
          <div className="relative">
            <textarea
              id="fb-textarea-content"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, characterLimit))}
              placeholder={
                type === 'fitur'
                  ? 'Contoh: request fitur download playlist YouTube sekaligus...'
                  : 'Contoh: link video TikTok ini error tidak bisa didownload...'
              }
              rows={6}
              className="w-full p-4 bg-white dark:bg-[#1E293B] text-neo-text border-[3px] border-neo-border rounded-[4px] text-xs md:text-sm font-semibold focus:outline-none focus:ring-0 transition-all placeholder:opacity-60"
            />
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-neo-text opacity-50 font-black">
              {content.length}/{characterLimit}
            </div>
          </div>
        </div>

        {/* Contact Field (Optional) */}
        <div className="space-y-2">
          <label className="block text-[10px] md:text-xs font-mono font-black text-neo-text uppercase tracking-wider">
            KONTAK (OPSIONAL, KALAU MAU DIBALAS)
          </label>
          <input
            type="text"
            id="fb-input-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email / username Telegram / dll"
            className="w-full p-4 bg-white dark:bg-[#1E293B] text-neo-text border-[3px] border-neo-border rounded-[4px] text-xs md:text-sm font-semibold focus:outline-none focus:ring-0 transition-all placeholder:opacity-60"
          />
        </div>

        {/* Kirim Feedback Button */}
        <button
          type="submit"
          id="fb-submit-btn"
          disabled={submitting}
          className={`w-full py-4 px-6 border-[3px] border-neo-border font-heading font-black uppercase text-xs md:text-sm tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer select-none rounded-[4px] ${
            content.trim()
              ? 'bg-[#10B981] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-[#CBD5E1] dark:bg-[#475569] text-neo-text opacity-60 cursor-not-allowed'
          }`}
        >
          <Send size={16} className="stroke-[3]" />
          {submitting ? 'MENGIRIM...' : 'KIRIM FEEDBACK'}
        </button>

      </form>

      {/* Decorative Line separator */}
      <hr className="border-t-[3px] border-neo-border my-2 opacity-100" />

      {/* Full-Width bottom Back Button */}
      <button
        id="fb-bottom-back-btn"
        onClick={onBack}
        className="w-full py-4 px-6 bg-black text-white dark:bg-[#1E293B] border-[3px] border-neo-border font-heading font-black text-xs md:text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:translate-y-0.5 active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] cursor-pointer select-none rounded-[4px]"
      >
        ← KEMBALI KE MENU UTAMA
      </button>

    </section>
  );
}
