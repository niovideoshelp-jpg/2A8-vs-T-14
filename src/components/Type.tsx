import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { interpolate, random, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";

const splitChars = (text: string, charColor?: (i: number, n: number) => string) =>
  text.split("").map((ch, i, all) => (
    <span
      key={i}
      className="ch"
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        willChange: "transform",
        color: charColor ? charColor(i, all.length) : undefined,
      }}
    >
      {ch}
    </span>
  ));

// Título com letras subindo em cascata (GSAP), com máscara para corte limpo
export const KineticTitle: React.FC<{
  text: string;
  size?: number;
  color?: string;
  delay?: number; // segundos
  stagger?: number;
  font?: string;
  weight?: number;
  tracking?: number;
  outDelay?: number; // segundos (opcional): quando as letras saem
  charColor?: (i: number, n: number) => string;
  style?: React.CSSProperties;
}> = ({
  text,
  size = 140,
  color = C.text,
  delay = 0,
  stagger = 0.035,
  font = FONT.display,
  weight = 700,
  tracking = 2,
  outDelay,
  charColor,
  style,
}) => {
  const ref = useGsapTimeline<HTMLDivElement>(
    ({ timeline, selector }) => {
      timeline.from(
        selector(".ch"),
        {
          yPercent: 110,
          rotateX: -80,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger,
        },
        delay,
      );
      if (outDelay !== undefined) {
        timeline.to(
          selector(".ch"),
          { yPercent: -110, opacity: 0, duration: 0.45, ease: "power3.in", stagger: stagger * 0.6 },
          outDelay,
        );
      }
    },
    { dependencies: [text, delay, stagger, outDelay] },
  );
  return (
    <div
      ref={ref}
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1,
        color,
        letterSpacing: tracking,
        textTransform: "uppercase",
        overflow: "hidden",
        paddingBottom: size * 0.06,
        perspective: 800,
        ...style,
      }}
    >
      {splitChars(text, charColor)}
    </div>
  );
};

// Texto que "digita" caractere a caractere com cursor (leitura de terminal)
export const TypeOn: React.FC<{
  text: string;
  startFrame?: number;
  cps?: number; // caracteres por segundo
  style?: React.CSSProperties;
  cursor?: boolean;
}> = ({ text, startFrame = 0, cps = 32, style, cursor = true }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor(((frame - startFrame) / 30) * cps));
  const shown = text.slice(0, n);
  const done = n >= text.length;
  return (
    <span style={{ fontFamily: FONT.mono, whiteSpace: "pre", ...style }}>
      {shown}
      {cursor && (!done || Math.floor(frame / 12) % 2 === 0) ? (
        <span style={{ opacity: frame >= startFrame ? 1 : 0 }}>▌</span>
      ) : null}
    </span>
  );
};

// Texto com fatias deslocadas (glitch) nos primeiros frames e em "picos"
export const GlitchText: React.FC<{
  text: string;
  size: number;
  color?: string;
  start?: number;
  intensity?: number;
  style?: React.CSSProperties;
}> = ({ text, size, color = C.text, start = 0, intensity = 1, style }) => {
  const frame = useCurrentFrame() - start;
  const burst = frame >= 0 && frame < 10 ? 1 : frame % 47 < 3 ? 0.5 : 0;
  const amt = burst * intensity;
  const seed = Math.floor(frame / 2);
  const off = (s: string) => (random(`${s}-${seed}`) - 0.5) * 40 * amt;
  const base: React.CSSProperties = {
    fontFamily: FONT.display,
    fontWeight: 700,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: 4,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };
  const vis = interpolate(frame, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", opacity: vis, ...style }}>
      {amt > 0 ? (
        <>
          <div style={{ ...base, position: "absolute", inset: 0, color: C.ru, transform: `translateX(${off("r")}px)`, mixBlendMode: "screen", clipPath: `inset(${random(`a${seed}`) * 60}% 0 ${random(`b${seed}`) * 30}% 0)` }}>
            {text}
          </div>
          <div style={{ ...base, position: "absolute", inset: 0, color: "#36C3FF", transform: `translateX(${off("b")}px)`, mixBlendMode: "screen", clipPath: `inset(${random(`c${seed}`) * 30}% 0 ${random(`d${seed}`) * 60}% 0)` }}>
            {text}
          </div>
        </>
      ) : null}
      <div style={{ ...base, color, position: "relative", transform: `translateX(${off("m") * 0.3}px)` }}>{text}</div>
    </div>
  );
};

// Etiqueta pequena tipo "tag" militar
export const Tag: React.FC<{ text: string; color?: string; style?: React.CSSProperties }> = ({
  text,
  color = C.text,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      fontFamily: FONT.mono,
      fontSize: 22,
      letterSpacing: 4,
      color,
      textTransform: "uppercase",
      ...style,
    }}
  >
    <span style={{ width: 28, height: 2, background: color }} />
    {text}
  </div>
);
