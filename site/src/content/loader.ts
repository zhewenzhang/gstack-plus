// eslint-disable-next-line @typescript-eslint/no-explicit-any
const files = (import.meta as any).glob('../../../**/*.md', { as: 'raw', eager: true }) as Record<string, any>;

export function loadMarkdown(source: string): string | null {
  const normalized = source.replace(/\\/g, '/');
  const target = `../../../${normalized}`;
  const found = files[target];
  if (found) return typeof found === 'string' ? found : String(found);
  // Fallback: try without leading ../../../
  for (const key of Object.keys(files)) {
    if (key.endsWith(normalized)) {
      const v = files[key];
      return typeof v === 'string' ? v : String(v);
    }
  }
  return null;
}
