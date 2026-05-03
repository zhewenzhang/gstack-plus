import { useState } from 'react';

export default function CodeBlock({
  code,
  lang = 'bash',
  caption,
}: {
  code: string;
  lang?: string;
  caption?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard API unavailable */
    }
  };

  return (
    <div className="not-prose">
      {caption && (
        <div className="text-[11px] uppercase tracking-wider text-muted mb-2">{caption}</div>
      )}
      <div className="relative group rounded-xl bg-[#0b0b0b] text-neutral-100 font-mono text-[13px] leading-relaxed">
        <button
          onClick={copy}
          className="absolute top-2.5 right-2.5 px-2.5 py-1 text-[11px] rounded bg-white/10 hover:bg-white/20 text-neutral-200 transition-opacity opacity-60 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
        <pre className="overflow-x-auto px-4 py-3.5 pr-16">
          <code className={`language-${lang}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
