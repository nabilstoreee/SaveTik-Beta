// Safe local storage wrapper to prevent SecurityError in sandboxed iframes or restricted privacy modes

export const safeLocalStorage = {
  getItem: (key: string, fallback: string | null = null): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key) ?? fallback;
      }
    } catch (e) {
      console.warn(`[SaveTik] localStorage.getItem failed for key "${key}":`, e);
    }
    return fallback;
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {
      console.warn(`[SaveTik] localStorage.setItem failed for key "${key}":`, e);
    }
    return false;
  },

  removeItem: (key: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
      }
    } catch (e) {
      console.warn(`[SaveTik] localStorage.removeItem failed for key "${key}":`, e);
    }
    return false;
  },

  getJSON: <T>(key: string, fallback: T): T => {
    try {
      const raw = safeLocalStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw) as T;
      }
    } catch (e) {
      console.warn(`[SaveTik] safeLocalStorage.getJSON failed for key "${key}":`, e);
    }
    return fallback;
  },

  setJSON: (key: string, value: any): boolean => {
    try {
      return safeLocalStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[SaveTik] safeLocalStorage.setJSON failed for key "${key}":`, e);
      return false;
    }
  }
};
