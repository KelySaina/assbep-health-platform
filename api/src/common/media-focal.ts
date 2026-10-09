/**
 * Server-side image framing ("cadrage").
 *
 * Focal point = the part of an image that must stay visible when it is cropped to
 * fit a box (CSS object-position). It is stored, authoritatively, on the Media
 * row — focalX / focalY, defaulting to 50/50 (centre).
 *
 * Content records (Program.image, Article.image/images[], Partner.logo,
 * User.profilePicture) reference images as bare URL strings, with no relation back
 * to the Media row. So the framing is resolved at READ time: the interceptor looks
 * each URL up in the Media table and re-stamps the current focal onto it as a URL
 * fragment (.../photo.jpg#fx=30&fy=20), which the frontends already read.
 *
 * Doing it on read, not at selection time, is the whole point: change an image's
 * framing in the library and every place it appears follows on the next response,
 * with no re-selection and nothing to keep in sync. Any fragment already on the
 * stored URL is stripped first, so a stale one left by an older client is corrected
 * rather than trusted.
 */
export interface Focal {
  x: number;
  y: number;
}

export const CENTRE: Focal = { x: 50, y: 50 };

const clamp = (n: number): number => Math.min(100, Math.max(0, n));

/** A string that points at this deployment's object storage. */
export function isMediaUrl(value: unknown): value is string {
  return typeof value === 'string' && value.includes('/storage/');
}

/** The URL without any framing fragment — what is stored as media.url. */
export function baseUrl(url: string): string {
  return url.split('#')[0];
}

/** Write a focal point onto a URL. Centre adds nothing, keeping the URL clean. */
export function withFocal(url: string, focal: Focal): string {
  const base = baseUrl(url);
  const x = Math.round(clamp(focal.x));
  const y = Math.round(clamp(focal.y));
  if (x === CENTRE.x && y === CENTRE.y) return base;
  return `${base}#fx=${x}&fy=${y}`;
}

/** Collect the base form of every media URL in an arbitrary response tree. */
export function collectMediaUrls(node: unknown, into: Set<string>): void {
  if (isMediaUrl(node)) {
    into.add(baseUrl(node));
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) collectMediaUrls(item, into);
    return;
  }
  if (node && typeof node === 'object') {
    for (const value of Object.values(node)) collectMediaUrls(value, into);
  }
}

/**
 * Rewrite every media URL in the tree to carry its current focal. Mutates arrays
 * and objects in place and returns strings rewritten (strings are immutable, so a
 * string node is replaced by its parent). A URL absent from the map — its Media
 * row was deleted — falls back to centre, i.e. the bare URL.
 */
export function rewriteMediaUrls<T>(node: T, focals: Map<string, Focal>): T {
  if (isMediaUrl(node)) {
    const focal = focals.get(baseUrl(node)) ?? CENTRE;
    return withFocal(node, focal) as unknown as T;
  }
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) node[i] = rewriteMediaUrls(node[i], focals);
    return node;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node as Record<string, unknown>)) {
      (node as Record<string, unknown>)[key] = rewriteMediaUrls(
        (node as Record<string, unknown>)[key],
        focals,
      );
    }
    return node;
  }
  return node;
}
