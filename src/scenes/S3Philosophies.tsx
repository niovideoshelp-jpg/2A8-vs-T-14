import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { DarkStage, Flash, Grain, TechGrid } from "../components/Atmosphere";
import { FlagDE, FlagRU } from "../components/Flags";
import { KineticTitle, Tag, TypeOn } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.philosophies.from;
const L = (t: number) => N(t) - S0;
const sec = (t: number) => L(t) / 30;

export const S3Philosophies: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SCENES.philosophies.to - S0;
  const face = interpolate(frame, [L(31.1), L(31.6)], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const titleUp = interpolate(frame, [L(31.1), L(31.6)], [0, -270], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const titleScale = interpolate(frame, [L(31.1), L(31.6)], [1, 0.55], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const push = interpolate(frame, [0, dur], [1, 1.08]);
  const split = interpolate(frame, [L(31.15), L(31.7)], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const imagine = interpolate(frame, [L(28.1), L(28.35)], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <DarkStage left={C.de} right={C.ru} glow={0.08 + 0.22 * face} />
        <TechGrid opacity={0.18} />
      </AbsoluteFill>

      {/* "Agora, imagine..." */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: imagine }}>
        <TypeOn text="AGORA, IMAGINE..." startFrame={L(27.15)} cps={22} style={{ fontSize: 34, letterSpacing: 10, color: C.muted }} />
      </AbsoluteFill>

      {/* Duas filosofias opostas */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateY(${titleUp}px) scale(${titleScale})` }}>
        <KineticTitle text="Duas filosofias" size={150} delay={sec(28.32)} stagger={0.03} />
        <KineticTitle
          text="opostas de guerra"
          size={150}
          delay={sec(29.8)}
          stagger={0.03}
          charColor={(i, n) => (i < n / 2 ? C.de : C.ru)}
        />
      </AbsoluteFill>

      {/* Frente a frente: divisor central + bandeiras */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={960} y1={600 - 190 * split} x2={960} y2={600 + 190 * split} stroke={C.text} strokeWidth={3} opacity={split} />
      </svg>
      <div style={{ position: "absolute", left: 960 - 120 - 360 * face, top: 560, opacity: face, transform: `translateX(${(1 - face) * -200}px)` }}>
        <FlagDE width={240} />
        <div style={{ marginTop: 14 }}>
          <Tag text="Alemanha" color={C.de} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 960 - 120 + 360 * face, top: 560, opacity: face, transform: `translateX(${(1 - face) * 200}px)` }}>
        <FlagRU width={240} />
        <div style={{ marginTop: 14 }}>
          <Tag text="Rússia" color={C.ru} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 860,
          textAlign: "center",
          fontFamily: FONT.mono,
          fontSize: 26,
          letterSpacing: 12,
          color: C.text,
          opacity: face,
        }}
      >
        FRENTE A FRENTE
      </div>
      <Flash at={dur - 3} length={6} peak={0.9} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
