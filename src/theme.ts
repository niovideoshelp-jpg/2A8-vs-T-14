import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Tipografia: Oswald (Google Fonts) em pesos grossos — uma única família em todo o vídeo.
// Os arquivos do Google Fonts (variáveis, 200–700) ficam em public/fonts: assim o render não
// depende de baixar a fonte na hora (a rede desta máquina às vezes perde o DNS no meio do render).
const FAMILY = "Oswald";
const SUBSETS = [
  {
    file: "fonts/oswald-latin.woff2",
    range:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  },
  {
    file: "fonts/oswald-latin-ext.woff2",
    range:
      "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
  },
];

if (typeof document !== "undefined") {
  const handle = delayRender("Carregando a fonte Oswald");
  Promise.all(
    SUBSETS.map(({ file, range }) =>
      new FontFace(FAMILY, `url(${staticFile(file)}) format("woff2")`, { weight: "200 700", unicodeRange: range })
        .load()
        .then((face) => document.fonts.add(face)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
}

export const FONT = {
  display: FAMILY,
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
