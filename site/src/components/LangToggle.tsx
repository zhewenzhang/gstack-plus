import { useLang } from '@/i18n/useLang';

export default function LangToggle({ className = '' }: { className?: string }) {
  const [lang, setLang] = useLang();
  return (
    <div className={`inline-flex items-center text-xs border border-neutral-300 dark:border-[#383838] rounded-full overflow-hidden ${className}`}>
      <button
        onClick={() => setLang('zh')}
        className={`px-2.5 py-1 transition-colors ${lang === 'zh' ? 'bg-ink text-white dark:text-black' : 'text-muted hover:text-ink'}`}
        aria-pressed={lang === 'zh'}
      >
        中
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-ink text-white dark:text-black' : 'text-muted hover:text-ink'}`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
