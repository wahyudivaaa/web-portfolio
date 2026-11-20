// Generates the static, ATS-safe CV PDF from lib/cv-data.ts.
// Output: public/cv/Wahyu-Diva-Resume.pdf (served at /cv/Wahyu-Diva-Resume.pdf)
//
// Run with: npm run generate:cv
// (package.json compiles this file + components/pdf/CvDocument.tsx +
// lib/cv-data.ts with the project's TypeScript compiler into
// .cv-build/ and runs the result with plain Node.)
//
// Why not tsx? tsx's CJS require hook breaks @react-pdf/textkit's
// `@react-pdf/hyphenate/en-us` subpath import on this setup
// (ERR_PACKAGE_PATH_NOT_EXPORTED), while plain Node ESM resolves it fine.
import { renderToFile } from "@react-pdf/renderer";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import CvDocument from "../components/pdf/CvDocument";

async function main() {
  // The compiled script runs from .cv-build/scripts/, and npm scripts run
  // with the package root as cwd — resolve the output from cwd.
  const root = process.cwd();
  const outDir = path.join(root, "public", "cv");
  const outFile = path.join(outDir, "Wahyu-Diva-Resume.pdf");
  await mkdir(outDir, { recursive: true });
  await renderToFile(<CvDocument />, outFile);
  console.log(`CV PDF written to ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
