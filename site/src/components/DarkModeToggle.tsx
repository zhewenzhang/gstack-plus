import { useTheme } from '@/i18n/useTheme';

export default function DarkModeToggle({ className = '' }: { className?: string }) {
  const [dark, setTheme] = useTheme();

  return (
    <button
      onClick={() => setTheme(!dark)}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors text-muted hover:text-ink hover:bg-neutral-100 dark:hover:bg-[#1e1e1e] ${className}`}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? (
        /* Sun — shown in dark mode to switch to light */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4"/>
          <line x1="8" y1="1" x2="8" y2="2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="8" y1="13.5" x2="8" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="1" y1="8" x2="2.5" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="13.5" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="3.2" y1="3.2" x2="4.2" y2="4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="11.8" y1="11.8" x2="12.8" y2="12.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="12.8" y1="3.2" x2="11.8" y2="4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="4.2" y1="11.8" x2="3.2" y2="12.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      ) : (
        /* Moon — shown in light mode to switch to dark */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13 10A6 6 0 016 3a6.5 6.5 0 100 10A6 6 0 0113 10z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}
