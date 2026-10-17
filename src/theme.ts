import { loadFont } from "@remotion/google-fonts/Oswald";

// Tipografia: Oswald (Google Fonts) em pesos grossos — uma única família em todo o vídeo
const oswald = loadFont("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });

export const FONT = {
  display: oswald.fontFamily,
};

// Tamanho mínimo de qualquer texto na tela (nada de letras ou números pequenos)
export const MIN_TEXT = 52;

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
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
