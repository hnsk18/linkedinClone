const DEFAULT_API = 'http://localhost:8080';

/**
 * Resolves stored profile / upload paths to a full URL for <img src>.
 */
export function resolveProfileImageUrl(url, apiBase) {
    if (url == null || typeof url !== 'string') return null;
    const u = url.trim();
    if (!u) return null;
    if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:') || u.startsWith('blob:')) {
        return u;
    }
    const base = (apiBase || import.meta.env.VITE_API_BASE || DEFAULT_API).replace(/\/$/, '');
    return `${base}${u.startsWith('/') ? '' : '/'}${u}`;
}
