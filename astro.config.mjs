import { defineConfig } from "astro/config";

// Site statique publié par GitHub Pages. La page de lancement (public/index.html) reste l'accueil.
export default defineConfig({
  site: "https://www.startindubai.com",
  trailingSlash: "always",
  build: { format: "directory" },
  compressHTML: true,
});
