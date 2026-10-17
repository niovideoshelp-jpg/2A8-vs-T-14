import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { DarkStage, Flash, Grain, hexA } from "../components/Atmosphere";
import { Cutout } from "../components/Photo";
import { KineticTitle } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES, TOTAL_FRAMES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.outro.from;
const L = (t: number) => N(t) - S0;
const E = Easing.bezier(0.16, 1, 0.3, 1);

const DocIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={64} height={78} viewBox="0 0 64 78">
    <path d="M4 4 H42 L60 22 V74 H4 Z" fill="none" stroke={color} strokeWidth={4} />
    <path d="M42 4 V22 H60" fill="none" stroke={color} strokeWidth={4} />
    {[34, 46, 58].map((y) => (
      <line key={y} x1={14} y1={y} x2={50} y2={y} stroke={color} strokeWidth={4} />
    ))}
  </svg>
);

const Thumb: React.FC<{ fill: string; stroke: string }> = ({ fill, stroke }) => (
  <svg width={130} height={130} viewBox="0 0 24 24">
    <path
      d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
      fill={fill}
      stroke={stroke}
      strokeWidth={0.6}
    />
  </svg>
);

export const S9Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = TOTAL_FRAMES - S0;
  // "All the sources ... in the description"
  const src = interpolate(frame, [4, 20], [0, 1], { ...clamp, easing: E });
  const srcOut = interpolate(frame, [L(99.5), L(99.8)], [1, 0], clamp);
  const arrow = Math.sin(frame * 0.2) * 8;
  // "please leave a like"
  const likeIn = interpolate(frame, [L(100.6), L(100.95)], [0, 1], { ...clamp, easing: E });
  const press = L(101.66);
  const pressed = frame >= press;
  const pop = spring({ frame: frame - press, fps: 30, config: { damping: 8, stiffness: 180 } });
  const likeScale = pressed ? 0.85 + 0.15 * pop + 0.08 * Math.max(0, 1 - (frame - press) / 10) : interpolate(frame, [press - 6, press], [1, 0.88], clamp);
  const likeOut = interpolate(frame, [L(103.1), L(103.35)], [1, 0], clamp);
  // assinatura final no hit da música
  const endT = L(103.25);
  const endFade = interpolate(frame, [dur - 40, dur - 2], [1, 0], clamp);
  const bgDim = interpolate(frame, [endT, endT + 20], [0.55, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: endFade }}>
        <DarkStage left={C.de} right={C.ru} glow={0.18} />
        <AbsoluteFill style={{ opacity: bgDim, transform: `scale(${interpolate(frame, [0, dur], [1, 1.08])})` }}>
          <div style={{ position: "absolute", left: 20, top: 520, width: 900 }}>
            <Cutout src="leo2a8_cut.webp" width={900} glow={hexA(C.de, 0.25)} />
          </div>
          <div style={{ position: "absolute", left: 1000, top: 545, width: 900 }}>
            <Cutout src="t14_cut.webp" width={900} glow={hexA(C.ru, 0.25)} />
          </div>
          <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(7,9,11,0.85) 0%, rgba(7,9,11,0.2) 45%, rgba(7,9,11,0) 100%)" }} />
        </AbsoluteFill>

        {/* Fontes na descrição */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", opacity: src * srcOut, transform: `translateY(${(1 - src) * 40}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30, background: hexA("#0E1418", 0.85), border: `2px solid ${hexA(C.de, 0.6)}`, padding: "30px 48px" }}>
            <DocIcon color={C.de} />
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 68, color: C.text, textTransform: "uppercase", lineHeight: 1.05 }}>Sources in the description</div>
            <div style={{ fontFamily: FONT.display, fontSize: 80, color: C.de, transform: `translateY(${arrow}px)` }}>↓</div>
          </div>
        </div>

        {/* Like (ícone, sem texto) */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", opacity: likeIn * likeOut }}>
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: 120,
              border: `4px solid ${pressed ? C.de : C.text}`,
              background: pressed ? hexA(C.de, 0.2) : "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${likeScale * (0.6 + 0.4 * likeIn)})`,
              boxShadow: pressed ? `0 0 ${60 * pop}px ${hexA(C.de, 0.6)}` : "none",
            }}
          >
            <Thumb fill={pressed ? C.de : "none"} stroke={pressed ? C.de : C.text} />
          </div>
          {pressed
            ? Array.from({ length: 10 }).map((_, i) => {
                const a = (i / 10) * Math.PI * 2;
                const d = interpolate(frame - press, [0, 14], [120, 240], clamp);
                const o = interpolate(frame - press, [0, 14], [1, 0], clamp);
                return (
                  <div
                    key={i}
                    style={{ position: "absolute", top: 120 + Math.sin(a) * d - 5, left: 960 + Math.cos(a) * d - 5, width: 10, height: 10, borderRadius: 5, background: C.de, opacity: o }}
                  />
                );
              })
            : null}
        </div>

        {/* Assinatura final */}
        {frame >= endT ? (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <KineticTitle text="Leopard 2A8" size={110} color={C.de} delay={endT / 30} stagger={0.025} />
              <KineticTitle text="vs" size={110} delay={endT / 30 + 0.2} />
              <KineticTitle text="T-14 Armata" size={110} color={C.ru} delay={endT / 30 + 0.1} stagger={0.025} />
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Flash at={endT} length={10} peak={0.7} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
