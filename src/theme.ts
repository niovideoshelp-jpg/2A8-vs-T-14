import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes embutidas no projeto (public/fonts) — o render não depende da internet
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF";

const face = (family: string, file: string, weight: string, unicodeRange: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style: "normal", unicodeRange, format: "woff2" });

// Oswald e JetBrains Mono são fontes variáveis (um arquivo cobre todos os pesos)
face("Oswald", "Oswald-var-latin.woff2", "200 700", LATIN);
face("Oswald", "Oswald-var-latin-ext.woff2", "200 700", LATIN_EXT);
face("JetBrains Mono", "JetBrainsMono-var-latin.woff2", "100 800", LATIN);
face("JetBrains Mono", "JetBrainsMono-var-latin-ext.woff2", "100 800", LATIN_EXT);
for (const w of ["400", "600", "700"]) {
  face("Barlow Condensed", `BarlowCondensed-${w}-latin.woff2`, w, LATIN);
  face("Barlow Condensed", `BarlowCondensed-${w}-latin-ext.woff2`, w, LATIN_EXT);
}

export const FONT = {
  display: "Oswald, sans-serif",
  label: "'Barlow Condensed', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const C = {
  bg: "#07090B",
  bg2: "#0E1418",
  steel: "#1B242A",
  line: "rgba(233, 238, 241, 0.16)",
  text: "#E9EEF1",
  muted: "#8B989F",
  // Alemanha / Leopard 2A8
  de: "#F2B630",
  deDeep: "#7A5410",
  // Rússia / T-14 Armata
  ru: "#E2362B",
  ruDeep: "#6E1712",
  hud: "#E9EEF1",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const sec = (s: number) => Math.round(s * FPS);
