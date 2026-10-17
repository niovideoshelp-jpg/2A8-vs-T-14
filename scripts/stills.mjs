// Renderiza vários quadros de verificação de uma vez (um único bundle)
// Uso: node scripts/stills.mjs <pasta-saida> <segundo1> <segundo2> ...   (COMP=Ch1 para outra composição)
import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [outDir, ...secs] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP ?? "Intro" });

for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(s) * composition.fps));
  const output = path.join(outDir, `t${String(s).replace(".", "_").padStart(6, "0")}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", jpegQuality: 85, scale: 0.5 });
  console.log("ok", s, output);
}
