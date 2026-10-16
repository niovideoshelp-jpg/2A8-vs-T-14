import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { C, FONT, FPS } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Cantoneiras do quadro + leitura de dados nas bordas (moldura de "câmera tática")
export const HudFrame: React.FC<{
  label?: string;
  sub?: string;
  color?: string;
  inset?: number;
  delay?: number;
}> = ({ label, sub, color = C.hud, inset = 48, delay = 0 }) => {
  const frame = useCurrentFrame() - delay;
  const k = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const L = 54 * k;
  const corner = (pos: React.CSSProperties, bt: string, bl: string) => (
    <div
      style={{
        position: "absolute",
        width: L,
        height: L,
        borderTop: bt,
        borderLeft: bl,
        ...pos,
      }}
    />
  );
  const b = `2px solid ${color}`;
  const secs = Math.max(0, frame) / FPS;
  const tc = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(Math.floor(secs % 60)).padStart(2, "0")}:${String(Math.floor((secs % 1) * FPS)).padStart(2, "0")}`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: k }}>
      {corner({ top: inset, left: inset }, b, b)}
      {corner({ top: inset, right: inset, transform: "scaleX(-1)" }, b, b)}
      {corner({ bottom: inset, left: inset, transform: "scaleY(-1)" }, b, b)}
      {corner({ bottom: inset, right: inset, transform: "scale(-1,-1)" }, b, b)}
      {label ? (
        <div
          style={{
            position: "absolute",
            top: inset + 14,
            left: inset + 74,
            fontFamily: FONT.mono,
            fontSize: 20,
            letterSpacing: 3,
            color,
            display: "flex",
            gap: 18,
            alignItems: "center",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: C.ru,
              opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.25,
            }}
          />
          <span>{label}</span>
          {sub ? <span style={{ color: C.muted }}>{sub}</span> : null}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          bottom: inset + 14,
          right: inset + 74,
          fontFamily: FONT.mono,
          fontSize: 18,
          letterSpacing: 2,
          color: C.muted,
        }}
      >
        TC {tc}
      </div>
    </AbsoluteFill>
  );
};

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

// Linha de varredura horizontal (scanner)
export const ScanLine: React.FC<{ color?: string; period?: number; opacity?: number }> = ({
  color = C.hud,
  period = 90,
  opacity = 0.35,
}) => {
  const frame = useCurrentFrame();
  const y = ((frame % period) / period) * 1080;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y - 60,
          height: 60,
          background: `linear-gradient(180deg, transparent, ${color})`,
          opacity: opacity * 0.25,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 2, background: color, opacity }} />
    </AbsoluteFill>
  );
};
