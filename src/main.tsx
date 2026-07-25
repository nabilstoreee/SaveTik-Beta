import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Register Service Worker safely only when top-level (not inside preview iframe)
if ('serviceWorker' in navigator) {
  const isInIframe = window.self !== window.top;
  
  if (import.meta.env.PROD && !isInIframe) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('[SaveTik] ServiceWorker registration warning:', err);
      });
    });
  } else if (isInIframe) {
    // Unregister any active service worker inside iframe preview to prevent cached white screens
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    }).catch(() => {});
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
