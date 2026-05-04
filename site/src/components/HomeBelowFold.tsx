import { Link } from 'react-router-dom';
import { NAV } from '@/content/manifest';
import { useLang } from '@/i18n/useLang';
import { STRINGS } from '@/i18n/strings';

export default function HomeBelowFold() {
  const [lang] = useLang();
  const s = STRINGS.below;
  const path = s.pathSteps[lang];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
      {/* What is gstack-plus */}
      <div className="max-w-3xl mb-20">
        <div className="text-xs uppercase tracking-widest text-muted mb-3">{s.whatEyebrow[lang]}</div>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-4">
          {s.whatTitle[lang]}
        </h2>
        <p className="text-base sm:text-lg text-muted leading-relaxed">
          {s.whatBody[lang]}
        </p>
      </div>

      {/* Reading path */}
      <div className="mb-20">
        <div className="text-xs uppercase tracking-widest text-muted mb-3">{s.pathEyebrow[lang]}</div>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-8">
          {s.pathTitle[lang]}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {path.map(p => (
            <Link
              key={p.slug}
              to={`/doc/${p.slug}`}
              className="group block rounded-xl border border-neutral-200 hover:border-ink transition-colors p-5 bg-white"
            >
              <div className="font-display text-2xl text-muted group-hover:text-ink transition-colors mb-2">
                {p.step}
              </div>
              <div className="font-display text-lg text-ink mb-1.5">{p.title}</div>
              <div className="text-xs text-muted leading-relaxed">{p.why}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="text-xs uppercase tracking-widest text-muted mb-3">{s.catEyebrow[lang]}</div>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight mb-8">
          {s.catTitle[lang]}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV.map(section => {
            const first = section.items.slice().sort((a, b) => a.order - b.order)[0];
            return (
              <Link
                key={section.id}
                to={`/doc/${first.slug}`}
                className="group block rounded-xl border border-neutral-200 hover:border-ink transition-colors p-5 bg-white"
              >
                <div className="font-display text-xl text-ink mb-2">
                  {lang === 'en' && section.titleEn ? section.titleEn : section.title}
                </div>
                <div className="text-xs text-muted leading-relaxed mb-3">
                  {lang === 'en' && section.introEn ? section.introEn : section.intro}
                </div>
                <div className="text-xs text-muted">{s.catCount[lang](section.items.length)}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
