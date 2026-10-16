import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Move = {
  fromScale?: number;
  toScale?: number;
  fromX?: number; // % do quadro
  toX?: number;
  fromY?: number;
  toY?: number;
};

// Foto em tela cheia com movimento de câmera (Ken Burns) e correção de cor cinematográfica
export const Photo: React.FC<{
  src: string;
  move?: Move;
  grade?: "cold" | "warm" | "neutral" | "mono";
  position?: string;
  darken?: number;
  blur?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({ src, move = {}, grade = "neutral", position = "center", darken = 0.25, blur = 0, dur, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames: compDur } = useVideoConfig();
  const durationInFrames = dur ?? compDur;
  const {
    fromScale = 1.08,
    toScale = 1.2,
    fromX = 0,
    toX = 0,
    fromY = 0,
    toY = 0,
  } = move;
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.33, 0, 0.67, 1),
    extrapolateRight: "clamp",
  });
  const scale = fromScale + (toScale - fromScale) * t;
  const x = fromX + (toX - fromX) * t;
  const y = fromY + (toY - fromY) * t;

  const filters: Record<string, string> = {
    cold: "contrast(1.12) saturate(0.72) brightness(0.92) hue-rotate(-6deg)",
    warm: "contrast(1.1) saturate(0.85) brightness(0.95) sepia(0.12)",
    neutral: "contrast(1.1) saturate(0.8) brightness(0.95)",
    mono: "grayscale(1) contrast(1.2) brightness(0.9)",
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000", ...style }}>
      <Img
        src={staticFile(`img/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `translate(${x}%, ${y}%) scale(${scale})`,
          filter: `${filters[grade]}${blur ? ` blur(${blur}px)` : ""}`,
        }}
      />
      {/* tonalidade: sombras frias, altas quentes */}
      <AbsoluteFill
        style={{
          background:
            grade === "warm"
              ? "linear-gradient(180deg, rgba(40,25,5,0.15), rgba(0,0,0,0.1))"
              : "linear-gradient(180deg, rgba(5,18,28,0.25), rgba(0,0,0,0.15))",
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${darken})` }} />
    </AbsoluteFill>
  );
};

// Recorte do tanque (PNG/WebP com alfa) com sombra de contato e luz de contorno
export const Cutout: React.FC<{
  src: string;
  width: number;
  glow?: string;
  style?: React.CSSProperties;
  className?: string;
  shadow?: boolean;
}> = ({ src, width, glow, style, className, shadow = true }) => (
  <div className={className} style={{ position: "absolute", width, ...style }}>
    {shadow ? (
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: "-3%",
          height: "14%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(6px)",
        }}
      />
    ) : null}
    <Img
      src={staticFile(`img/${src}`)}
      style={{
        width: "100%",
        display: "block",
        position: "relative",
        filter: `contrast(1.08) saturate(0.85)${glow ? ` drop-shadow(0 0 28px ${glow})` : ""}`,
      }}
    />
  </div>
);
