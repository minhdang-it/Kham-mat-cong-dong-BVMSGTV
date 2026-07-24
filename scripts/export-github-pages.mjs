import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE_URL = "https://khammatcongdong.matsaigontravinh.vn";
const CUSTOM_DOMAIN = "khammatcongdong.matsaigontravinh.vn";
const projectRoot = process.cwd();
const clientDirectory = path.join(projectRoot, "dist", "client");
const workerPath = path.join(projectRoot, "dist", "server", "index.js");
const outputDirectory = path.join(projectRoot, "github-pages");

const workerModuleUrl = `${pathToFileURL(workerPath).href}?export=${Date.now()}`;
const { default: worker } = await import(workerModuleUrl);

const workerEnvironment = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const workerContext = {
  waitUntil() {},
  passThroughOnException() {},
};

const renderRoute = async (pathname, accept) => {
  const response = await worker.fetch(
    new Request(`${SITE_URL}${pathname}`, {
      headers: { accept },
    }),
    workerEnvironment,
    workerContext,
  );

  if (!response.ok) {
    throw new Error(`Không thể xuất ${pathname}: HTTP ${response.status}`);
  }

  return response.text();
};

const makeStaticHtml = (renderedHtml) =>
  renderedHtml
    .replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1"/>',
      "",
    )
    .replace(
      /(<meta charSet="utf-8"\/>)<meta charSet="utf-8"\/>/,
      "$1",
    )
    .replace(
      /<meta name="codex-preview" content="development"\/>/,
      "",
    )
    .replace(/<link[^>]+\brel="modulepreload"[^>]*\/>/g, "")
    .replace(
      /<script\b([^>]*)>[\s\S]*?<\/script>/gi,
      (script, attributes) => {
        const isStructuredData = /application\/ld\+json/i.test(attributes);
        const isSiteScript = /\bsrc=["']\/site\.js["']/i.test(attributes);
        return isStructuredData || isSiteScript ? script : "";
      },
    )
    .replace(/\sdata-rsc-css-href="[^"]*"/g, "")
    .replace(/\sdata-precedence="[^"]*"/g, "")
    .replace(/\b(href|src)="\/(?!\/)/g, '$1="./')
    .replace(/url\(\/assets\//g, "url(./assets/");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(clientDirectory, outputDirectory, { recursive: true });

const renderedHome = await renderRoute("/", "text/html");
const staticHome = makeStaticHtml(renderedHome);
await writeFile(path.join(outputDirectory, "index.html"), staticHome, "utf8");
await writeFile(path.join(outputDirectory, "404.html"), staticHome, "utf8");
await writeFile(path.join(outputDirectory, ".nojekyll"), "", "utf8");
await writeFile(path.join(outputDirectory, "CNAME"), CUSTOM_DOMAIN, "utf8");

const robots = [
  "User-agent: *",
  "Allow: /",
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  `Host: ${SITE_URL}`,
  "",
].join("\n");

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  "  <url>",
  `    <loc>${SITE_URL}/</loc>`,
  "    <lastmod>2026-07-24</lastmod>",
  "    <changefreq>weekly</changefreq>",
  "    <priority>1.0</priority>",
  "  </url>",
  "</urlset>",
  "",
].join("\n");

await writeFile(path.join(outputDirectory, "robots.txt"), robots, "utf8");
await writeFile(path.join(outputDirectory, "sitemap.xml"), sitemap, "utf8");

const manifestPath = path.join(outputDirectory, "site.webmanifest");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
manifest.start_url = "./";
manifest.icons = manifest.icons.map((icon) => ({
  ...icon,
  src: icon.src.replace(/^\//, "./"),
}));
await writeFile(
  manifestPath,
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Đã xuất GitHub Pages tại ${outputDirectory}`);
