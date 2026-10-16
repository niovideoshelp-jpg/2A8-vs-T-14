import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "../theme";

// Grão de filme: textura maior que o quadro, deslocada a cada 2 frames (determinístico)
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2);
  const x = Math.floor(random(`gx-${step}`) * 512);
  const y = Math.floor(random(`gy-${step}`) * 512);
  return (
    <AbsoluteFill style={{ overflow: "hidden", mixBlendMode: "overlay", opacity, pointerEvents: "none" }}>
      <Img
        src={staticFile("img/grain.jpg")}
        style={{ position: "absolute", left: -x, top: -y, width: 2432, height: 1592, maxWidth: "none" }}
      />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// Grade técnica de fundo (linhas finas)
export const TechGrid: React.FC<{ opacity?: number; size?: number; drift?: number }> = ({
  opacity = 0.35,
  size = 80,
  drift = 0.25,
}) => {
  const frame = useCurrentFrame();
  const off = (frame * drift) % size;
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${off}px ${off}px`,
        maskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, black 30%, transparent 100%)",
      }}
    />
  );
};

// Fundo escuro com brilho de cor (usado nas cenas de estúdio/versus)
export const DarkStage: React.FC<{ left?: string; right?: string; glow?: number }> = ({
  left = C.de,
  right = C.ru,
  glow = 0.22,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const breathe = interpolate(frame, [0, durationInFrames], [0.9, 1.1]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 60% at 12% 60%, ${hexA(left, glow * breathe)} 0%, transparent 70%), radial-gradient(ellipse 55% 60% at 88% 60%, ${hexA(right, glow * breathe)} 0%, transparent 70%), radial-gradient(ellipse 90% 60% at 50% 110%, rgba(255,255,255,0.06) 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Barras de cinema (abrem/fecham)
export const Letterbox: React.FC<{ amount: number }> = ({ amount }) => {
  const h = amount * 140;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000" }} />
    </AbsoluteFill>
  );
};

// Flash branco curto para cortes de impacto
export const Flash: React.FC<{ at: number; length?: number; color?: string; peak?: number }> = ({
  at,
  length = 8,
  color = "#fff",
  peak = 0.85,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + length], [0, peak, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: "screen" }} />;
};

export const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.max(0, Math.min(1, a))})`;
};
