import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import projects from "./src/data/content/projects.json";
import art from "./src/data/content/art.json";

const SITE = "https://abrarabir.com";
const NAME = "Abrar Abir";

type Page = {
  path: string;
  title: string;
  description: string;
  image?: string;
};

const pages: Page[] = [
  ...projects.map((p) => ({
    path: `/projects/${p.slug}`,
    title: `${p.title} | ${NAME}`,
    description: p.summary,
    image: p.image || undefined,
  })),
  {
    path: "/art",
    title: `Art Portfolio | ${NAME}`,
    description: art.intro,
  },
  {
    path: "/certificates",
    title: `Certificates | ${NAME}`,
    description: `Awards, certificates and recognitions earned by ${NAME} in AI, robotics, research and art.`,
  },
];

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const setMeta = (html: string, key: string, value: string) =>
  html.replace(
    new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*"`),
    `$1${escape(value)}"`
  );

const pageHtml = (html: string, page: Page) => {
  const url = SITE + page.path;
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`);
  for (const key of ["description", "og:description", "twitter:description"])
    out = setMeta(out, key, page.description);
  for (const key of ["og:title", "twitter:title", "og:image:alt"])
    out = setMeta(out, key, page.title);
  out = setMeta(out, "og:url", url);
  if (page.image) {
    for (const key of ["og:image", "twitter:image"])
      out = setMeta(out, key, SITE + page.image);
    // The size tags describe the default og-image.png, not this photo
    out = out.replace(/\s*<meta property="og:image:(?:width|height)"[^>]*>/g, "");
  }
  return out;
};

// Writes a copy of index.html for each page, with its own title, description
// and link preview, so crawlers and social sites see them without running JS.
// The app itself still boots the same way from any of them
const prerender = (): Plugin => ({
  name: "prerender-meta",
  apply: "build",
  enforce: "post",
  generateBundle(_, bundle) {
    const index = bundle["index.html"];
    if (index?.type !== "asset") return;
    const html = String(index.source);
    for (const page of pages) {
      this.emitFile({
        type: "asset",
        fileName: `${page.path.slice(1)}/index.html`,
        source: pageHtml(html, page),
      });
    }
    const urls = ["/", ...pages.map((p) => p.path)]
      .map((p) => `  <url><loc>${SITE}${p}</loc></url>`)
      .join("\n");
    this.emitFile({
      type: "asset",
      fileName: "sitemap.xml",
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), prerender()],
});
