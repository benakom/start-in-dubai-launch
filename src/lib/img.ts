// Variantes responsives des photos : <nom>-800.webp est générée à côté de chaque photo de /assets/photos/ (1200 px).
export function srcset(src?: string): string | undefined {
  if (!src || !src.startsWith("/assets/photos/") || /-800\.webp$/.test(src)) return undefined;
  return `${src.replace(/\.webp$/, "-800.webp")} 800w, ${src} 1200w`;
}

// Version floutée de 48 px (fond du hero sur mobile : même ambiance, et Chrome ne la compte pas comme LCP).
export function blur(src?: string): string | undefined {
  if (!src || !/^\/assets\/(photos|img)\/[^/]+\.(webp|jpg)$/.test(src) || src.includes("/logo")) return undefined;
  return src.replace(/\.(webp|jpg)$/, "-blur.webp");
}
