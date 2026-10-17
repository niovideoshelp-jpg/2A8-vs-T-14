import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Grain, Vignette, hexA } from "../components/Atmosphere";
import { Brochure, ForumCard } from "../components/Cards";
import { Enter } from "../components/Motion";
import { Photo } from "../components/Photo";
import { GlitchText, KineticTitle } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.hype.from;
const L = (t: number) => N(t) - S0;
const E = Easing.bezier(0.16, 1, 0.3, 1);

// Balança: no papel, o T-14 "pesa" mais ("the matchup looks almost unfair")
const Balance: React.FC<{ at: number; tipAt: number }> = ({ at, tipAt }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: E });
  const tilt = spring({ frame: frame - tipAt, fps: 30, config: { damping: 9, stiffness: 70, mass: 1.1 } }) * 12;
  const r = (tilt * Math.PI) / 180;
  const cx = 960;
  const cy = 470;
  const half = 430;
  const lx = cx - half * Math.cos(r);
  const ly = cy - half * Math.sin(r);
  const rx = cx + half * Math.cos(r);
  const ry = cy + half * Math.sin(r);
  const pan = (x: number, y: number, color: string, label: string) => (
    <g>
      <line x1={x} y1={y} x2={x - 90} y2={y + 150} stroke={C.muted} strokeWidth={2} />
      <line x1={x} y1={y} x2={x + 90} y2={y + 150} stroke={C.muted} strokeWidth={2} />
      <path d={`M ${x - 120} ${y + 150} Q ${x} ${y + 215} ${x + 120} ${y + 150} Z`} fill={hexA(color, 0.25)} stroke={color} strokeWidth={3} />
      <text x={x} y={y + 192} textAnchor="middle" fill={color} style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 40 }}>
        {label}
      </text>
    </g>
  );
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: appear }}>
      <polygon points={`${cx},${cy} ${cx - 80},${cy + 420} ${cx + 80},${cy + 420}`} fill={C.steel} stroke={C.muted} strokeWidth={2} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={14} fill={C.text} />
      {pan(lx, ly, C.de, "2A8")}
      {pan(rx, ry, C.ru, "T-14")}
    </svg>
  );
};

// 6a — folhetos promocionais e fóruns online
const OnPaper: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t0 = N(56.64);
  const l = (t: number) => N(t) - t0;
  const b = interpolate(frame, [2, 18], [0, 1], { ...clamp, easing: E });
  const f = interpolate(frame, [l(58.55), l(58.55) + 16], [0, 1], { ...clamp, easing: E });
  const back = interpolate(frame, [l(60.3), l(60.7)], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return (
    <AbsoluteFill>
      <Photo src="t14_parade_b.jpg" dur={dur} grade="cold" darken={0.6} blur={6} move={{ fromScale: 1.1, toScale: 1.18 }} />
      <AbsoluteFill style={{ filter: `blur(${back * 8}px)`, opacity: 1 - 0.7 * back, transform: `scale(${1 - 0.12 * back})` }}>
        <div style={{ position: "absolute", left: 230, top: 120, transform: `translateY(${(1 - b) * 900}px) rotate(${-5 + (1 - b) * -8}deg)` }}>
          <Brochure />
        </div>
        <div style={{ position: "absolute", left: 1060, top: 260, transform: `translateX(${(1 - f) * 1100}px) rotate(${4 + (1 - f) * 6}deg)` }}>
          <ForumCard />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(7,9,11,${0.5 * back})` }} />
      <Balance at={l(60.35)} tipAt={l(61.5)} />
    </AbsoluteFill>
  );
};

// 6b — "a western tank evolved from a Cold War design" (visual de filme antigo)
const ColdWar: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const flicker = 0.88 + random(`fl-${frame}`) * 0.12;
  const scratches = [0, 1, 2].map((i) => ({
    x: random(`sx-${Math.floor(frame / 3)}-${i}`) * 1920,
    o: random(`so-${Math.floor(frame / 3)}-${i}`) > 0.55 ? 0.35 : 0,
  }));
  const jitter = (random(`jy-${frame}`) - 0.5) * 3;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: flicker, transform: `translateY(${jitter}px)` }}>
        <Photo src="hist_leo2a4.jpg" dur={dur} grade="mono" darken={0.2} move={{ fromScale: 1.08, toScale: 1.18, fromX: 1, toX: -2 }} />
        <AbsoluteFill style={{ background: "rgba(120, 90, 40, 0.28)", mixBlendMode: "color" }} />
      </AbsoluteFill>
      {scratches.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: s.x, top: 0, bottom: 0, width: 2, background: "#fff", opacity: s.o }} />
      ))}
      <Vignette strength={0.9} />
      <div style={{ position: "absolute", left: 150, bottom: 150, display: "flex", alignItems: "baseline", gap: 24 }}>
        <KineticTitle text="Leopard 2" size={120} delay={0.2} stagger={0.03} />
        <span style={{ fontFamily: FONT.mono, fontSize: 56, color: C.de, opacity: interpolate(frame, [14, 24], [0, 1], clamp) }}>1979</span>
      </div>
      <Grain opacity={0.22} />
    </AbsoluteFill>
  );
};

// 6c — "a fourth-generation Russian super tank loaded with futuristic promises" (holograma)
const Futurist: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(65.2);
  const l = (t: number) => N(t) - t0;
  const k = interpolate(frame, [l(65.45), l(65.45) + 10], [0, 1], { ...clamp, easing: E });
  const holo = 0.5 + 0.5 * Math.sin(frame * 0.35);
  const glitchOn = frame % 41 < 3;
  const push = interpolate(frame, [0, l(70.24)], [1, 1.1]);
  return (
    <AbsoluteFill>
      <DarkStage left={C.ru} right={C.ru} glow={0.14} />
      <div style={{ position: "absolute", left: 310, top: 330, width: 1300, transform: `translateX(${glitchOn ? 14 : 0}px) scale(${push})`, transformOrigin: "50% 60%" }}>
        <Img
          src={staticFile("img/t14_cut.webp")}
          style={{ width: "100%", position: "absolute", filter: "grayscale(1) brightness(1.4) sepia(1) hue-rotate(-50deg) saturate(4)", opacity: 0.35 + 0.15 * holo, mixBlendMode: "screen", transform: "translateX(-8px)" }}
        />
        <Img src={staticFile("img/t14_cut.webp")} style={{ width: "100%", position: "relative", filter: "contrast(1.1) saturate(0.7) brightness(0.9)", opacity: 0.92 }} />
        <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(226,54,43,0.12) 0px, rgba(226,54,43,0.12) 2px, transparent 2px, transparent 6px)", mixBlendMode: "screen" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
        <div style={{ display: "inline-block", border: `2px solid ${C.ru}`, background: hexA(C.ru, 0.12), padding: "12px 30px" }}>
          <GlitchText text="4th generation" size={72} start={l(65.45)} color={C.text} intensity={0.8} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const S6Hype: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence durationInFrames={L(62.56) + 2} name="6a no papel">
      <OnPaper dur={L(62.56)} />
    </Sequence>
    <Sequence from={L(62.56)} durationInFrames={L(65.2) - L(62.56) + 2} name="6b guerra fria">
      <ColdWar dur={L(65.2) - L(62.56)} />
    </Sequence>
    <Sequence from={L(65.2)} durationInFrames={L(70.24) - L(65.2)} name="6c futurista">
      <Enter kind="whip-right" frames={9}>
        <Futurist />
      </Enter>
    </Sequence>
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
