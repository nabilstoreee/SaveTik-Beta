import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SaveTik ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F3ED] text-[#2D2331] flex items-center justify-center p-6 font-sans">
          <div className="bg-white border-[3px] border-[#2D2331] shadow-[8px_8px_0px_0px_#2D2331] p-8 max-w-lg w-full text-center space-y-6 rounded-xl">
            <div className="w-16 h-16 bg-[#FFE4E6] border-[3px] border-[#2D2331] rounded-full flex items-center justify-center mx-auto text-[#E11D48]">
              <AlertTriangle size={32} strokeWidth={3} />
            </div>

            <div>
              <h2 className="font-heading font-black text-2xl uppercase text-[#2D2331] tracking-tight mb-2">
                Terjadi Kesalahan Aplikasi
              </h2>
              <p className="text-xs font-semibold text-[#2D2331] opacity-80 leading-relaxed">
                Aplikasi mengalami kendala saat memuat komponen. Jangan khawatir, Anda dapat memuat ulang halaman ini.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#2D2331] text-white p-3 rounded-lg text-left text-[11px] font-mono overflow-x-auto max-h-32 border-[2px] border-[#2D2331]">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3.5 px-6 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-black text-sm uppercase tracking-wider border-[3px] border-[#2D2331] shadow-[4px_4px_0px_0px_#2D2331] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#2D2331] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg"
            >
              <RefreshCw size={16} strokeWidth={3} />
              MUAT ULANG HALAMAN
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
