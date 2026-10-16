import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Grain, TechGrid, Vignette, hexA } from "../components/Atmosphere";
import { Brochure, ForumCard } from "../components/Cards";
import { HudFrame, ScanLine } from "../components/Hud";
import { LottieAsset } from "../components/LottieAsset";
import { Enter } from "../components/Motion";
import { Photo } from "../components/Photo";
import { GlitchText, KineticTitle, Tag } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.hype.from;
const L = (t: number) => N(t) - S0;
const E = Easing.bezier(0.16, 1, 0.3, 1);

// Balança: no papel, o T-14 "pesa" mais
const Balance: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const appear = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: E });
  const tilt = spring({ frame: frame - at - 8, fps, config: { damping: 9, stiffness: 70, mass: 1.1 } }) * 11;
  const r = (tilt * Math.PI) / 180;
  const cx = 960;
  const cy = 610;
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
      <text x={x} y={y + 190} textAnchor="middle" fill={color} style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 40 }}>
        {label}
      </text>
    </g>
  );
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: appear }}>
      <polygon points={`${cx},${cy} ${cx - 70},${cy + 330} ${cx + 70},${cy + 330}`} fill={C.steel} stroke={C.muted} strokeWidth={2} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={14} fill={C.text} />
      {pan(lx, ly, C.de, "2A8")}
      {pan(rx, ry, C.ru, "T-14")}
    </svg>
  );
};

// 6a — folhetos e fóruns: no papel a disputa parece injusta
const OnPaper: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t0 = N(56.64);
  const l = (t: number) => N(t) - t0;
  const b = interpolate(frame, [2, 18], [0, 1], { ...clamp, easing: E });
  const f = interpolate(frame, [l(58.45), l(58.45) + 16], [0, 1], { ...clamp, easing: E });
  const back = interpolate(frame, [l(60.2), l(60.6)], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  return (
    <AbsoluteFill>
      <Photo src="t14_parade_b.jpg" dur={dur} grade="cold" darken={0.6} blur={6} move={{ fromScale: 1.1, toScale: 1.18 }} />
      <AbsoluteFill style={{ filter: `blur(${back * 8}px)`, opacity: 1 - 0.65 * back, transform: `scale(${1 - 0.12 * back})` }}>
        <div style={{ position: "absolute", left: 230, top: 120, transform: `translateY(${(1 - b) * 900}px) rotate(${-5 + (1 - b) * -8}deg)` }}>
          <Brochure />
        </div>
        <div style={{ position: "absolute", left: 1060, top: 250, transform: `translateX(${(1 - f) * 1100}px) rotate(${4 + (1 - f) * 6}deg)` }}>
          <ForumCard />
        </div>
      </AbsoluteFill>
      <Sequence from={l(60.2)} layout="none">
        <AbsoluteFill style={{ background: `rgba(7,9,11,${0.5 * back})` }} />
      </Sequence>
      <Balance at={l(60.3)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: interpolate(frame, [l(60.25), l(60.5)], [0, 1], clamp) }}>
        <Tag text="No papel" color={C.muted} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        <KineticTitle text="Quase injusta" size={140} delay={l(61.25) / 30} stagger={0.03} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 6b — Leopard: evolução de um projeto da Guerra Fria (visual de filme antigo)
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
      <div style={{ position: "absolute", left: 150, bottom: 170 }}>
        <Tag text="Evolução de um projeto da Guerra Fria" color={C.de} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 8 }}>
          <KineticTitle text="Leopard 2" size={120} delay={0.2} stagger={0.03} />
          <span style={{ fontFamily: FONT.mono, fontSize: 56, color: C.de, opacity: interpolate(frame, [14, 24], [0, 1], clamp) }}>1979</span>
        </div>
      </div>
      <Grain opacity={0.22} />
    </AbsoluteFill>
  );
};

// 6c — T-14: "supertanque de 4ª geração" com promessas futuristas (holograma)
const Futurist: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(65.2);
  const l = (t: number) => N(t) - t0;
  const chip = (at: number) => interpolate(frame, [l(at), l(at) + 10], [0, 1], { ...clamp, easing: E });
  const holo = 0.5 + 0.5 * Math.sin(frame * 0.35);
  const glitchOn = frame % 41 < 3;
  const chips = [
    { at: 66.85, text: "4ª geração", x: 170, y: 220, align: "left" as const },
    { at: 67.99, text: "Supertanque", x: 1750, y: 220, align: "right" as const },
    { at: 69.33, text: "Promessas futuristas", x: 960, y: 900, align: "center" as const },
  ];
  return (
    <AbsoluteFill>
      <DarkStage left={C.ru} right={C.ru} glow={0.12} />
      <TechGrid opacity={0.28} size={60} drift={0.6} />
      <div style={{ position: "absolute", left: 960 - 480, top: 540 - 480, width: 960, height: 960, opacity: 0.32 }}>
        <LottieAsset name="radar-red" loop />
      </div>
      <div style={{ position: "absolute", left: 310, top: 330, width: 1300, transform: `translateX(${glitchOn ? 14 : 0}px)` }}>
        <Img src={staticFile("img/t14_cut.webp")} style={{ width: "100%", position: "absolute", filter: "grayscale(1) brightness(1.4) sepia(1) hue-rotate(-50deg) saturate(4)", opacity: 0.35 + 0.15 * holo, mixBlendMode: "screen", transform: "translateX(-8px)" }} />
        <Img src={staticFile("img/t14_cut.webp")} style={{ width: "100%", position: "relative", filter: "contrast(1.1) saturate(0.7) brightness(0.9)", opacity: 0.92 }} />
        <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(226,54,43,0.12) 0px, rgba(226,54,43,0.12) 2px, transparent 2px, transparent 6px)", mixBlendMode: "screen" }} />
      </div>
      {chips.map((c) => {
        const k = chip(c.at);
        return (
          <div
            key={c.text}
            style={{
              position: "absolute",
              top: c.y,
              left: c.align === "left" ? c.x : c.align === "center" ? 0 : undefined,
              right: c.align === "right" ? 1920 - c.x : c.align === "center" ? 0 : undefined,
              textAlign: c.align,
              opacity: k,
              transform: `translateY(${(1 - k) * 20}px)`,
            }}
          >
            <div style={{ display: "inline-block", border: `2px solid ${C.ru}`, background: hexA(C.ru, 0.12), padding: "12px 26px" }}>
              <GlitchText text={c.text} size={64} start={l(c.at)} color={C.text} intensity={0.8} />
            </div>
          </div>
        );
      })}
      <ScanLine color={C.ru} period={60} opacity={0.25} />
    </AbsoluteFill>
  );
};

export const S6Hype: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence  durationInFrames={L(62.56) + 2} name="6a no papel">
      <OnPaper dur={L(62.56)} />
    </Sequence>
    <Sequence from={L(62.56)} durationInFrames={L(65.2) - L(62.56) + 2} name="6b guerra fria">
      <Enter kind="cut">
        <ColdWar dur={L(65.2) - L(62.56)} />
      </Enter>
    </Sequence>
    <Sequence from={L(65.2)} durationInFrames={L(70.24) - L(65.2)} name="6c futurista">
      <Enter kind="whip-right" frames={9}>
        <Futurist />
      </Enter>
    </Sequence>
    <HudFrame label="ANÁLISE" sub="EXPECTATIVA" />
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
