export function webUrl(value) {
  if (typeof value !== 'string' || /\s/.test(value)) return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
export const citationUrl = (cite, source) => webUrl(cite.url) || webUrl(source?.url);
