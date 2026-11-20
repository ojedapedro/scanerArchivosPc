/**
 * Hook: dark mode con persistencia en localStorage
 */
import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('dc-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('dc-dark-mode', dark);
  }, [dark]);

  return [dark, () => setDark(d => !d)];
}
