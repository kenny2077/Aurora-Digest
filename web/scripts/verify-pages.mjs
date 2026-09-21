import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_BASE = "/Aurora-Newsletter/";
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const source =
  process.argv[2] ?? path.join(scriptDirectory, "../dist/index.html");
const isRemote = /^https?:\/\//.test(source);

const html = isRemote
  ? await fetch(source, { cache: "no-store" }).then((response) => {
      if (!response.ok) {
        throw new Error(`Page returned HTTP ${response.status}: ${source}`);
      }
      return response.text();
    })
  : await readFile(source, "utf8");

const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(
  (match) => match[1],
);
const localReferences = references.filter((reference) =>
  reference.startsWith("/"),
);
const wrongBase = localReferences.filter(
  (reference) => !reference.startsWith(EXPECTED_BASE),
);

if (wrongBase.length > 0) {
  throw new Error(
    `Page contains URLs outside ${EXPECTED_BASE}:\n${wrongBase.join("\n")}`,
  );
}

const assetReferences = [
  ...new Set(
    localReferences.filter((reference) =>
      /\.(?:css|js|png|jpe?g|svg|ico|woff2?|ttf)(?:\?|$)/.test(reference),
    ),
  ),
];

if (assetReferences.length === 0) {
  throw new Error(
    "Page contains no local CSS, JavaScript, image, or font assets.",
  );
}

if (isRemote) {
  for (const reference of assetReferences) {
    const assetUrl = new URL(reference, source);
    const response = await fetch(assetUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Asset returned HTTP ${response.status}: ${assetUrl}`);
    }
  }
} else {
  const outputDirectory = path.dirname(source);
  for (const reference of assetReferences) {
    const pathname = new URL(reference, "https://example.invalid").pathname;
    const relativePath = decodeURIComponent(
      pathname.slice(EXPECTED_BASE.length),
    );
    await access(path.join(outputDirectory, relativePath));
  }
}
