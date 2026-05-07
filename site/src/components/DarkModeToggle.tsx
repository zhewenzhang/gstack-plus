import { useTheme } from '@/i18n/useTheme';

export default function DarkModeToggle({ className = '' }: { className?: string }) {
  const [dark, setTheme] = useTheme();

  return (
    <button
      onClick={() => setTheme(!dark)}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors border border-neutral-300 dark:border-[#383838] hover:bg-neutral-100 dark:hover:bg-[#1e1e1e] ${dark ? 'text-[#ccc] bg-[#1e1e1e]' : 'text-neutral-600 bg-white'} ${className}`}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? (
        /* Sun — shown in dark mode to switch to light */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="3.2"/>
          <line x1="8" y1="1" x2="8" y2="2.5"/>
          <line x1="8" y1="13.5" x2="8" y2="15"/>
          <line x1="1" y1="8" x2="2.5" y2="8"/>
          <line x1="13.5" y1="8" x2="15" y2="8"/>
          <line x1="3.2" y1="3.2" x2="4.2" y2="4.2"/>
          <line x1="11.8" y1="11.8" x2="12.8" y2="12.8"/>
          <line x1="12.8" y1="3.2" x2="11.8" y2="4.2"/>
          <line x1="4.2" y1="11.8" x2="3.2" y2="12.8"/>
        </svg>
      ) : (
        /* Moon — shown in light mode to switch to dark (Heroicons, MIT) */
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
        </svg>
      )}
    </button>
  );
}
