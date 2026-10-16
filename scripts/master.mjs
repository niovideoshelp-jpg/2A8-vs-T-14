// Masterização final para YouTube: ganho até -14 LUFS + limitador transparente (teto -1,5 dBFS)
// Uso: node scripts/master.mjs [entrada] [saida] [audio-substituto.wav]
// O 3º argumento (opcional) troca a trilha de áudio do vídeo por outro render só de áudio.
import { spawnSync } from "child_process";

const input = process.argv[2] ?? "out/intro_raw.mp4";
const output = process.argv[3] ?? "out/Intro_2A8_vs_T14.mp4";
const audioOverride = process.argv[4];
const TARGET = -14;

const audioSrc = audioOverride ?? input;

const measure = (args) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", audioSrc, "-af", args, "-f", "null", "-"], { encoding: "utf8" });
  return r.stderr;
};

const before = measure("ebur128=peak=true:framelog=quiet");
const I = parseFloat(before.match(/I:\s+(-?[\d.]+) LUFS/)[1]);
console.log(`Antes: ${I} LUFS`);

// o limitador só atua nos picos (impactos); o ganho leva o integrado ao alvo
const gain = TARGET - I + 0.3;
const chain = `volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:attack=3:release=60:level=false,aresample=48000`;

const args = ["-y", "-hide_banner", "-loglevel", "error", "-i", input];
if (audioOverride) args.push("-i", audioOverride, "-map", "0:v:0", "-map", "1:a:0");
args.push("-c:v", "copy", "-af", chain, "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", "-shortest", output);
const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);

const after = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", output, "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const I2 = after.match(/I:\s+(-?[\d.]+) LUFS/)?.[1];
const TP = after.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1];
console.log(`Depois: ${I2} LUFS · true peak ${TP} dBFS → ${output}`);
