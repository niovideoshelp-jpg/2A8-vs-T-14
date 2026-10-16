import React from "react";
import { noise2D } from "@remotion/noise";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Tremor de câmera (impactos), determinístico via ruído
export const shakeAt = (frame: number, hits: { at: number; dur?: number; amp?: number }[]) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const { at, dur = 14, amp = 14 } of hits) {
    const k = interpolate(frame, [at, at + 1, at + dur], [0, 1, 0], clamp);
    if (k <= 0) continue;
    x += noise2D("sx", frame * 0.6, at) * amp * k;
    y += noise2D("sy", frame * 0.6, at) * amp * k;
    r += noise2D("sr", frame * 0.6, at) * amp * 0.05 * k;
  }
  return `translate(${x}px, ${y}px) rotate(${r}deg)`;
};

// Leve flutuação de câmera na mão (handheld)
export const handheld = (frame: number, amp = 4, seed = "h") =>
  `translate(${noise2D(seed + "x", frame * 0.015, 0) * amp}px, ${noise2D(seed + "y", frame * 0.015, 1) * amp}px)`;

type EnterKind = "whip-left" | "whip-right" | "zoom-in" | "zoom-out" | "rise" | "wipe-right" | "wipe-left" | "cut";

// Entrada da cena (a cena que entra fica por cima da anterior durante a transição)
export const Enter: React.FC<{
  kind?: EnterKind;
  frames?: number;
  children: React.ReactNode;
}> = ({ kind = "cut", frames = 10, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, frames], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  let style: React.CSSProperties = {};
  switch (kind) {
    case "whip-left":
    case "whip-right": {
      const dir = kind === "whip-left" ? -1 : 1;
      style = {
        transform: `translateX(${dir * (1 - t) * 1920}px) skewX(${dir * (1 - t) * -12}deg)`,
        filter: t < 1 ? `blur(${(1 - t) * 18}px)` : undefined,
      };
      break;
    }
    case "zoom-in":
      style = { transform: `scale(${1.25 - 0.25 * t})`, opacity: t, filter: t < 1 ? `blur(${(1 - t) * 14}px)` : undefined };
      break;
    case "zoom-out":
      style = { transform: `scale(${0.85 + 0.15 * t})`, opacity: t };
      break;
    case "rise":
      style = { transform: `translateY(${(1 - t) * 140}px)`, opacity: t };
      break;
    case "wipe-right":
      style = { clipPath: `inset(0 ${(1 - t) * 100}% 0 0)` };
      break;
    case "wipe-left":
      style = { clipPath: `inset(0 0 0 ${(1 - t) * 100}%)` };
      break;
    default:
      style = {};
  }
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

// Saída suave (fade para preto) no fim de uma cena
export const FadeOut: React.FC<{ start: number; frames?: number; children: React.ReactNode }> = ({
  start,
  frames = 10,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [start, start + frames], [1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
