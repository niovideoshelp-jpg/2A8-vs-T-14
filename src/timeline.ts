import { FPS } from "./theme";

// A narração entra 1 s depois do início do vídeo (abertura cinematográfica)
export const NARR_OFFSET = 1.0;

// Converte um tempo da narração (s) para frame absoluto do vídeo
export const N = (narrSeconds: number) => Math.round((narrSeconds + NARR_OFFSET) * FPS);
// Converte um tempo absoluto do vídeo (s) para frame
export const V = (videoSeconds: number) => Math.round(videoSeconds * FPS);

export const TOTAL_SECONDS = 108;
export const TOTAL_FRAMES = V(TOTAL_SECONDS);

// Cenas (início/fim em tempo da narração, conforme a transcrição)
export const SCENES = {
  open: { from: 0, to: N(14.0) },
  legacy: { from: N(14.0), to: N(27.12) },
  philosophies: { from: N(27.12), to: N(32.56) },
  leopard: { from: N(32.56), to: N(44.72) },
  armata: { from: N(44.72), to: N(56.64) },
  hype: { from: N(56.64), to: N(70.24) },
  reality: { from: N(70.24), to: N(77.76) },
  method: { from: N(77.76), to: N(95.12) },
  outro: { from: N(95.12), to: TOTAL_FRAMES },
} as const;

// Trilha: três cues gerados na Magnific, posicionados nos pontos de virada do roteiro
export const MUSIC = {
  a: { src: "music/cue_a_tension.mp3", from: 0, to: N(32.6) + 6, fadeOutFrames: 45 },
  b: { src: "music/cue_b_versus.mp3", from: N(32.56), to: N(70.24), fadeOutFrames: 4 },
  c: { src: "music/cue_c_resolve.mp3", from: N(70.24), to: TOTAL_FRAMES, fadeOutFrames: 30 },
} as const;

export type Sfx = { src: string; at: number; volume: number; trimEnd?: number };

const s = (name: string) => `sfx/${name}.mp3`;

// Efeitos sonoros sincronizados (frames absolutos). Volumes contidos para não competir com a voz.
export const SFX: Sfx[] = [
  // Abertura: campo de batalha
  { src: s("boom_1"), at: V(0.05), volume: 0.55 },
  { src: s("tank_drive"), at: V(0.4), volume: 0.1 },
  { src: s("whoosh_1"), at: N(3.42), volume: 0.24 },
  { src: s("lockon"), at: N(5.0), volume: 0.16 },
  { src: s("cannon_1"), at: N(6.86), volume: 0.4 },
  { src: s("whoosh_2"), at: N(7.0), volume: 0.24 },
  // firepower / protection / mobility
  { src: s("hud_1"), at: N(7.7), volume: 0.28 },
  { src: s("hud_1"), at: N(8.4), volume: 0.28 },
  { src: s("hud_1"), at: N(9.4), volume: 0.28 },
  { src: s("turret"), at: N(10.3), volume: 0.18 },
  { src: s("whoosh_3"), at: N(11.28), volume: 0.2 },
  // Germany & Russia: mapa e linha do tempo (um "blip" por cartão)
  { src: s("whoosh_2"), at: N(13.85), volume: 0.3 },
  { src: s("radar"), at: N(14.1), volume: 0.2 },
  { src: s("hud_2"), at: N(14.6), volume: 0.32 },
  { src: s("hud_3"), at: N(16.9), volume: 0.28 },
  { src: s("hud_3"), at: N(17.9), volume: 0.28 },
  { src: s("hud_3"), at: N(18.6), volume: 0.28 },
  { src: s("hud_3"), at: N(19.3), volume: 0.28 },
  { src: s("hud_3"), at: N(20.3), volume: 0.28 },
  { src: s("hud_2"), at: N(21.3), volume: 0.32 },
  { src: s("hud_2"), at: N(22.1), volume: 0.32 },
  { src: s("whoosh_3"), at: N(24.0), volume: 0.32 },
  // Duas filosofias, frente a frente
  { src: s("riser"), at: N(28.56), volume: 0.26 },
  { src: s("whoosh_1"), at: N(31.25), volume: 0.18 },
  // Leopard 2A8
  { src: s("boom_1"), at: N(32.56), volume: 0.5 },
  { src: s("whoosh_2"), at: N(32.62), volume: 0.35 },
  { src: s("boom_2"), at: N(33.4), volume: 0.3 },
  { src: s("whoosh_3"), at: N(34.85), volume: 0.28 },
  { src: s("typing"), at: N(35.1), volume: 0.12 },
  { src: s("whoosh_1"), at: N(38.75), volume: 0.28 },
  { src: s("boom_2"), at: N(39.65), volume: 0.36 },
  { src: s("turret"), at: N(40.9), volume: 0.2 },
  { src: s("hud_1"), at: N(41.35), volume: 0.26 },
  { src: s("hud_1"), at: N(42.25), volume: 0.26 },
  { src: s("hud_1"), at: N(43.15), volume: 0.26 },
  // T-14 Armata
  { src: s("whoosh_2"), at: N(44.4), volume: 0.3 },
  { src: s("boom_1"), at: N(46.05), volume: 0.36 },
  { src: s("whoosh_3"), at: N(48.8), volume: 0.28 },
  { src: s("lockon"), at: N(52.3), volume: 0.16 },
  { src: s("whoosh_1"), at: N(53.3), volume: 0.28 },
  { src: s("hud_2"), at: N(54.7), volume: 0.3 },
  // No papel x realidade
  { src: s("whoosh_2"), at: N(56.6), volume: 0.32 },
  { src: s("whoosh_3"), at: N(58.5), volume: 0.26 },
  { src: s("boom_2"), at: N(61.5), volume: 0.3 },
  { src: s("whoosh_1"), at: N(65.1), volume: 0.22 },
  { src: s("glitch_1"), at: N(65.45), volume: 0.18 },
  { src: s("hud_1"), at: N(65.5), volume: 0.24 },
  { src: s("boom_2"), at: N(70.24), volume: 0.55 },
  // projétil perfurante atravessa o folheto
  { src: s("whoosh_3"), at: N(73.1), volume: 0.3 },
  { src: s("cannon_2"), at: N(73.16), volume: 0.2 },
  // título
  { src: s("boom_1"), at: N(74.34), volume: 0.6 },
  // Método
  { src: s("whoosh_2"), at: N(77.7), volume: 0.3 },
  { src: s("whoosh_1"), at: N(79.85), volume: 0.24 },
  { src: s("hud_3"), at: N(81.8), volume: 0.3 },
  { src: s("hud_3"), at: N(82.5), volume: 0.3 },
  { src: s("hud_3"), at: N(82.95), volume: 0.3 },
  { src: s("hud_3"), at: N(84.56), volume: 0.3 },
  { src: s("hud_3"), at: N(85.54), volume: 0.3 },
  { src: s("lockon"), at: N(87.1), volume: 0.12 },
  { src: s("hud_1"), at: N(89.07), volume: 0.26 },
  { src: s("whoosh_3"), at: N(92.3), volume: 0.24 },
  { src: s("hud_3"), at: N(92.55), volume: 0.18 },
  { src: s("hud_3"), at: N(92.9), volume: 0.18 },
  { src: s("hud_3"), at: N(93.2), volume: 0.18 },
  // Encerramento
  { src: s("whoosh_2"), at: N(95.0), volume: 0.3 },
  { src: s("hud_2"), at: N(95.6), volume: 0.3 },
  { src: s("whoosh_1"), at: N(100.55), volume: 0.24 },
  { src: s("hud_1"), at: N(101.66), volume: 0.4 },
  { src: s("boom_2"), at: N(103.25), volume: 0.42 },
];
