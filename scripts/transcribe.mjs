// Transcreve a narração com whisper.cpp e grava as legendas em src/data/captions.json
// Uso: node scripts/transcribe.mjs <arquivo-16khz.wav> [modelo]
import path from "path";
import fs from "fs";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const input = process.argv[2];
if (!input) throw new Error("Informe o caminho do WAV 16 kHz");

const to = path.join(process.cwd(), "..", "whisper.cpp");
const model = process.argv[3] ?? "small";
const version = "1.5.5";

await installWhisperCpp({ to, version });
await downloadWhisperModel({ model, folder: to });

const whisperCppOutput = await transcribe({
  model,
  whisperPath: to,
  whisperCppVersion: version,
  inputPath: path.resolve(input),
  tokenLevelTimestamps: true,
  language: (process.argv[4] ?? "en"),
});

const { captions } = toCaptions({ whisperCppOutput });
fs.writeFileSync(
  path.join(process.cwd(), "src", "data", "captions.json"),
  JSON.stringify(captions, null, 2),
);
console.log(captions.map((c) => c.text).join(""));
