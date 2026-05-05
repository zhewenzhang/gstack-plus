import { useEffect, useState } from 'react';

const KEY = 'gstack-plus-theme';

function detectInitial(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(KEY);
  if (stored !== null) return stored === 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark);
}

let listeners: ((dark: boolean) => void)[] = [];
let current: boolean | null = null;

export function useTheme(): [boolean, (dark: boolean) => void] {
  const [dark, setDark] = useState<boolean>(() => {
    if (current !== null) return current;
    const init = detectInitial();
    return init;
  });

  useEffect(() => {
    if (current === null) {
      current = dark;
      applyTheme(dark);
    }
    const listener = (d: boolean) => setDark(d);
    listeners.push(listener);
    return () => { listeners = listeners.filter(fn => fn !== listener); };
  }, []);

  const setTheme = (d: boolean) => {
    current = d;
    localStorage.setItem(KEY, d ? 'dark' : 'light');
    applyTheme(d);
    listeners.forEach(fn => fn(d));
  };

  return [dark, setTheme];
}
