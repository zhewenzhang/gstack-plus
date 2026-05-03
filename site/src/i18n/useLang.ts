import { useEffect, useState } from 'react';
import type { Lang } from './strings';

const KEY = 'gstack-plus-lang';

function detectInitial(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(KEY);
  if (stored === 'zh' || stored === 'en') return stored;
  const browser = navigator.language.toLowerCase();
  return browser.startsWith('zh') ? 'zh' : 'en';
}

let listeners: ((l: Lang) => void)[] = [];
let current: Lang | null = null;

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => current ?? detectInitial());

  useEffect(() => {
    if (current === null) current = lang;
    const listener = (l: Lang) => setLang(l);
    listeners.push(listener);
    return () => { listeners = listeners.filter(fn => fn !== listener); };
  }, [lang]);

  const setLangGlobal = (l: Lang) => {
    current = l;
    localStorage.setItem(KEY, l);
    document.documentElement.lang = l === 'zh' ? 'zh-Hant' : 'en';
    listeners.forEach(fn => fn(l));
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  }, []);

  return [lang, setLangGlobal];
}
