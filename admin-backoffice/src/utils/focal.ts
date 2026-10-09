/**
 * Image framing ("cadrage").
 *
 * A focal point is the part of an image that must stay visible when the image is
 * cropped to fit a box — `object-cover` otherwise keeps the centre, which is what
 * cuts the top off portraits and the subject out of wide photos.
 *
 * Nothing is cropped on upload. The stored object is untouched; the focal point
 * only moves what `object-position` keeps in view, so a photo can be re-framed
 * later, repeatedly, without re-uploading it.
 *
 * It travels in the URL fragment: `.../photo.jpg#fx=30&fy=20`.
 *
 * That looks unusual, so the reason: every image in this system is referenced as a
 * bare URL string — Program.image, Article.image, Article.images[], Partner.logo,
 * User.profilePicture — with no relation to the Media row that owns it. Carrying
 * the framing in the URL means it reaches the page with no extra request and no
 * join, and keeps working inside the JSON array of URLs that `images` stores.
 * Browsers drop the fragment when fetching, so the image loads exactly as before.
 *
 * Anything without a fragment is centred, which is precisely today's behaviour —
 * so this is additive for every image already uploaded.
 */
export interface Focal {
  x: number
  y: number
}

export const DEFAULT_FOCAL: Focal = { x: 50, y: 50 }

const clamp = (n: number): number => Math.min(100, Math.max(0, n))

const readPercent = (raw: string | null, fallback: number): number => {
  if (raw === null || raw.trim() === '') return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? clamp(n) : fallback
}

/** Read the focal point from a URL, falling back to the centre. */
export function parseFocal(url?: string | null): Focal {
  if (!url) return { ...DEFAULT_FOCAL }
  const hash = url.split('#')[1]
  if (!hash) return { ...DEFAULT_FOCAL }
  const params = new URLSearchParams(hash)
  // Read each axis independently and fall back per axis. `Number(null)` is 0, not
  // NaN, so testing isFinite alone turns a missing parameter into 0% — the
  // top-left corner. Any URL carrying an unrelated fragment, or only one of the
  // two values, would slam every image into its corner.
  return {
    x: readPercent(params.get('fx'), DEFAULT_FOCAL.x),
    y: readPercent(params.get('fy'), DEFAULT_FOCAL.y),
  }
}

/**
 * Write a focal point onto a URL, replacing any fragment already there.
 * A centred point adds nothing: it is the default, and leaving the URL clean
 * keeps it identical to what older records already store.
 */
export function withFocal(url: string, focal: Focal): string {
  const base = url.split('#')[0]
  const x = Math.round(clamp(focal.x))
  const y = Math.round(clamp(focal.y))
  if (x === DEFAULT_FOCAL.x && y === DEFAULT_FOCAL.y) return base
  return `${base}#fx=${x}&fy=${y}`
}

/** Style binding for an <img> or background that uses object-cover/contain. */
export function focalStyle(url?: string | null): Record<string, string> {
  const { x, y } = parseFocal(url)
  return { objectPosition: `${x}% ${y}%` }
}
