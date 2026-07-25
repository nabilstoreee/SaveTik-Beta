import { useState } from 'react';
import { Menu, X, Sun, Moon, Smartphone } from 'lucide-react';

interface NavbarProps {
  activeView: 'downloader' | 'guide' | 'restrictions' | 'donation' | 'history' | 'feedback' | 'favorites' | 'offline';
  onViewChange: (view: 'downloader' | 'guide' | 'restrictions' | 'donation' | 'history' | 'feedback' | 'favorites' | 'offline') => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onOpenInstallModal: () => void;
  accentColor?: string;
}

export default function Navbar({ 
  activeView,
  onViewChange,
  theme,
  onThemeToggle,
  onOpenInstallModal,
  accentColor = '#FFE600'
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-20 bg-neo-card border-b-[4px] border-neo-border z-40 px-4 md:px-8 flex items-center justify-between transition-colors">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Icon (Mobile) */}
          <button 
            id="mobile-menu-toggle"
            onClick={toggleMenu}
            className="p-2 lg:hidden neo-border bg-neo-bg text-neo-text active:translate-y-0.5 transition-all cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu size={20} className="stroke-[3]" />
          </button>
          
          <a href="/" className="flex items-center gap-2">
            <span className="font-heading font-black text-2xl md:text-3xl tracking-tight uppercase text-neo-text dark:text-white">
              Save<span className="text-blue-700 dark:text-blue-500 font-black">Tik</span>
            </span>
          </a>
        </div>

        {/* Right Side: Desktop Items & Theme Toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => {
                onViewChange('downloader');
              }}
              className={`font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'downloader'
                  ? 'underline underline-offset-4 decoration-[3px]'
                  : 'text-neo-text hover:opacity-80'
              }`}
              style={{ color: activeView === 'downloader' ? accentColor : undefined }}
            >
              🏠 BERANDA
            </button>
            
            <button
              onClick={() => {
                onViewChange('guide');
              }}
              className={`font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'guide'
                  ? 'underline underline-offset-4 decoration-[3px]'
                  : 'text-neo-text hover:opacity-80'
              }`}
              style={{ color: activeView === 'guide' ? accentColor : undefined }}
            >
              📖 CARA PENGGUNAAN
            </button>

            <button
              onClick={() => {
                onViewChange('restrictions');
              }}
              className={`font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'restrictions'
                  ? 'underline underline-offset-4 decoration-[3px]'
                  : 'text-neo-text hover:opacity-80'
              }`}
              style={{ color: activeView === 'restrictions' ? accentColor : undefined }}
            >
              🚫 LARANGAN
            </button>

            <button
              onClick={() => {
                onViewChange('donation');
              }}
              className={`font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'donation'
                  ? 'underline underline-offset-4 decoration-[3px]'
                  : 'text-neo-text hover:opacity-80'
              }`}
              style={{ color: activeView === 'donation' ? accentColor : undefined }}
            >
              💛 DONASI
            </button>

            <button
              onClick={() => {
                onViewChange('feedback');
              }}
              className={`font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'feedback'
                  ? 'underline underline-offset-4 decoration-[3px]'
                  : 'text-neo-text hover:opacity-80'
              }`}
              style={{ color: activeView === 'feedback' ? accentColor : undefined }}
            >
              💬 FEEDBACK
            </button>

            <button
              onClick={() => {
                onViewChange('favorites');
              }}
              className={`font-heading font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeView === 'favorites'
                  ? 'underline underline-offset-4 decoration-[3px]'
                  : 'text-neo-text hover:opacity-80'
              }`}
              style={{ color: activeView === 'favorites' ? accentColor : undefined }}
            >
              ⭐ Favorit
            </button>

            <div className="bg-[#E2F7F2] dark:bg-[#1A3D35] neo-border-thin px-3 py-1.5 font-mono text-xs flex items-center gap-2 font-black text-[#14B8A6] transition-colors rounded-lg">
              ✓ ONLINE
            </div>
          </div>

          {/* Theme Toggle Quick Button */}
          <button
            onClick={onThemeToggle}
            className="p-1.5 neo-border bg-neo-bg text-neo-text hover:bg-neo-bg-sec active:translate-y-0.5 transition-all shadow-neo-btn-press cursor-pointer rounded-lg"
            aria-label="Toggle theme"
            title={`Mode: ${theme}`}
          >
            {theme === 'light' ? <Moon size={18} className="stroke-[3]" /> : <Sun size={18} className="stroke-[3]" />}
          </button>
        </div>

        {/* Hamburger Drawer Slide-From-Left (Mobile & Tablet) */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 z-50 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMenu}
        >
          <div 
            className={`w-[290px] max-w-full h-full bg-neo-bg border-r-[4px] border-neo-border p-6 flex flex-col justify-between transition-transform duration-300 overflow-y-auto ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-neo-border">
                <span className="font-heading font-black text-xl tracking-tight uppercase text-neo-text">
                  MENU SAVETIK
                </span>
                <button 
                  id="drawer-close"
                  onClick={toggleMenu}
                  className="p-1 neo-border bg-neo-card text-neo-text cursor-pointer rounded-md"
                >
                  <X size={18} className="stroke-[3]" />
                </button>
              </div>

              {/* Navigation links in drawer */}
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    onViewChange('downloader');
                    toggleMenu();
                  }}
                  className={`w-full text-left block py-2.5 px-4 font-black text-xs neo-border shadow-neo-btn transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider rounded-lg ${
                    activeView === 'downloader' ? 'bg-neo-bg-sec' : 'bg-neo-card text-neo-text'
                  }`}
                  style={{ color: activeView === 'downloader' ? accentColor : undefined }}
                >
                  🏠 BERANDA
                </button>
                <button
                  onClick={() => {
                    onViewChange('guide');
                    toggleMenu();
                  }}
                  className={`w-full text-left block py-2.5 px-4 font-black text-xs neo-border shadow-neo-btn transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider rounded-lg ${
                    activeView === 'guide' ? 'bg-neo-bg-sec' : 'bg-neo-card text-neo-text'
                  }`}
                  style={{ color: activeView === 'guide' ? accentColor : undefined }}
                >
                  📖 CARA PENGGUNAAN
                </button>
                <button
                  onClick={() => {
                    onViewChange('restrictions');
                    toggleMenu();
                  }}
                  className={`w-full text-left block py-2.5 px-4 font-black text-xs neo-border shadow-neo-btn transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider rounded-lg ${
                    activeView === 'restrictions' ? 'bg-neo-bg-sec' : 'bg-neo-card text-neo-text'
                  }`}
                  style={{ color: activeView === 'restrictions' ? accentColor : undefined }}
                >
                  🚫 LARANGAN
                </button>
                <button
                  onClick={() => {
                    onViewChange('history');
                    toggleMenu();
                  }}
                  className={`w-full text-left block py-2.5 px-4 font-black text-xs neo-border shadow-neo-btn transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider rounded-lg ${
                    activeView === 'history' ? 'bg-neo-bg-sec' : 'bg-neo-card text-neo-text'
                  }`}
                  style={{ color: activeView === 'history' ? accentColor : undefined }}
                >
                  ⏳ RIWAYAT
                </button>
                <button
                  onClick={() => {
                    onViewChange('donation');
                    toggleMenu();
                  }}
                  className={`w-full text-left block py-2.5 px-4 font-black text-xs neo-border shadow-neo-btn transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider rounded-lg ${
                    activeView === 'donation' ? 'bg-neo-bg-sec' : 'bg-neo-card text-neo-text'
                  }`}
                  style={{ color: activeView === 'donation' ? accentColor : undefined }}
                >
                  💛 DONASI
                </button>
                <button
                  onClick={() => {
                    onViewChange('feedback');
                    toggleMenu();
                  }}
                  className={`w-full text-left block py-2.5 px-4 font-black text-xs neo-border shadow-neo-btn transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider rounded-lg ${
                    activeView === 'feedback' ? 'bg-neo-bg-sec' : 'bg-neo-card text-neo-text'
                  }`}
                  style={{ color: activeView === 'feedback' ? accentColor : undefined }}
                >
                  💬 FEEDBACK
                </button>
                <button
                  onClick={() => {
                    onViewChange('favorites');
                    toggleMenu();
                  }}
                  className={`w-full text-left block py-2.5 px-4 font-black text-xs neo-border shadow-neo-btn transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider rounded-lg ${
                    activeView === 'favorites' ? 'bg-neo-bg-sec' : 'bg-neo-card text-neo-text'
                  }`}
                  style={{ color: activeView === 'favorites' ? accentColor : undefined }}
                >
                  ⭐ Favorit
                </button>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onOpenInstallModal();
                      toggleMenu();
                    }}
                    className="w-full py-3 px-4 bg-neo-card text-neo-text hover:bg-neo-bg-sec font-heading font-black text-xs uppercase tracking-wider neo-border shadow-neo-btn flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-y-0.5 rounded-lg"
                  >
                    <Smartphone size={16} className="stroke-[3]" />
                    INSTALL APP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Pad fixed top bar */}
      <div className="h-20" />
    </>
  );
}
