import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { C, FONT, MIN_TEXT } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Indicação de uma parte do tanque: ponto + linha-guia que termina na lateral do texto (sem sublinhado)
export const Callout: React.FC<{
  x: number;
  y: number;
  dx: number;
  dy: number;
  title: string;
  color?: string;
  delay?: number;
  align?: "left" | "right"; // lado em que o texto fica em relação ao fim da linha
  size?: number;
}> = ({ x, y, dx, dy, title, color = C.text, delay = 0, align = "left", size = 60 }) => {
  const frame = useCurrentFrame() - delay;
  const dot = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const ln = interpolate(frame, [4, 18], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const txt = interpolate(frame, [14, 26], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  if (frame < 0) return null;
  const ex = x + dx;
  const ey = y + dy;
  const len = Math.hypot(dx, dy);
  const fs = Math.max(MIN_TEXT, size);
  const gap = 18;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={x} cy={y} r={13 * dot} fill="none" stroke={color} strokeWidth={3} />
        <circle cx={x} cy={y} r={5 * dot} fill={color} />
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth={3} strokeDasharray={len} strokeDashoffset={len * (1 - ln)} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: ey - fs * 0.62,
          left: align === "right" ? ex + gap : undefined,
          right: align === "left" ? 1920 - ex + gap : undefined,
          opacity: txt,
          transform: `translateX(${(1 - txt) * (align === "right" ? 16 : -16)}px)`,
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: fs,
          lineHeight: 1.2,
          color,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textShadow: "0 4px 24px rgba(0,0,0,0.85)",
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
