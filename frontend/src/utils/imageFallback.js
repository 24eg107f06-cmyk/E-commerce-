export const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f1f5f9"/><text x="50%" y="48%" font-family="sans-serif" font-weight="bold" font-size="20" fill="%2394a3b8" dominant-baseline="middle" text-anchor="middle">MYSHOP</text><text x="50%" y="56%" font-family="sans-serif" font-size="14" fill="%23cbd5e1" dominant-baseline="middle" text-anchor="middle">Image Unavailable</text></svg>';

export const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = FALLBACK_IMAGE;
};
