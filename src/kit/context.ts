import { createContext, useContext } from "react";
import { FPS } from "../theme";

// Relógio do capítulo: converte tempo da narração (s) em frame absoluto e em frame local do beat
export type ChapterClock = { offset: number; beatStartFrame: number; beatDur: number };

export const ClockCtx = createContext<ChapterClock>({ offset: 0, beatStartFrame: 0, beatDur: 1 });

export const narrFrame = (offset: number, narr: number) => Math.round((narr + offset) * FPS);

// Dentro de um beat: frame local correspondente a um instante da narração
export const useBeatClock = () => {
  const c = useContext(ClockCtx);
  const local = (narr: number) => narrFrame(c.offset, narr) - c.beatStartFrame;
  return { local, dur: c.beatDur, sec: (narr: number) => local(narr) / FPS };
};
