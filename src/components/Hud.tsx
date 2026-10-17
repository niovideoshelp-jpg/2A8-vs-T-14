import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { C, FONT } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Rótulo técnico com linha-guia apontando para um ponto (callout)
export const Callout: React.FC<{
  x: number;
  y: number;
  dx: number;
  dy: number;
  title: string;
  value?: string;
  color?: string;
  delay?: number;
  align?: "left" | "right";
}> = ({ x, y, dx, dy, title, value, color = C.hud, delay = 0, align = "left" }) => {
  const frame = useCurrentFrame() - delay;
  const dot = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const ln = interpolate(frame, [4, 18], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const txt = interpolate(frame, [14, 26], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  if (frame < 0) return null;
  const ex = x + dx;
  const ey = y + dy;
  const len = Math.hypot(dx, dy);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={x} cy={y} r={9 * dot} fill="none" stroke={color} strokeWidth={2} />
        <circle cx={x} cy={y} r={3.5 * dot} fill={color} />
        <line
          x1={x}
          y1={y}
          x2={ex}
          y2={ey}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={len}
          strokeDashoffset={len * (1 - ln)}
        />
        <line
          x1={ex}
          y1={ey}
          x2={ex + (align === "left" ? 1 : -1) * 220 * ln}
          y2={ey}
          stroke={color}
          strokeWidth={2}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: ey - 58,
          left: align === "left" ? ex + 4 : undefined,
          right: align === "right" ? 1920 - ex + 4 : undefined,
          textAlign: align,
          opacity: txt,
          transform: `translateY(${(1 - txt) * 12}px)`,
        }}
      >
        <div style={{ fontFamily: FONT.label, fontWeight: 700, fontSize: 30, color: C.text, letterSpacing: 1.5, textTransform: "uppercase" }}>
          {title}
        </div>
        {value ? (
          <div style={{ fontFamily: FONT.mono, fontSize: 20, color, marginTop: 2, letterSpacing: 1 }}>{value}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

