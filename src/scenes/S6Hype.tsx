import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Grain, Vignette, hexA } from "../components/Atmosphere";
import { Brochure, ForumCard } from "../components/Cards";
import { Enter } from "../components/Motion";
import { Cutout, Photo } from "../components/Photo";
import { GlitchText, KineticTitle } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.hype.from;
const L = (t: number) => N(t) - S0;
const E = Easing.bezier(0.16, 1, 0.3, 1);

// "the matchup looks almost unfair": no papel, o T-14 cresce e o Leopard encolhe
const Unfair: React.FC<{ at: number; peakAt: number }> = ({ at, peakAt }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: E });
  const grow = spring({ frame: frame - (at + 6), fps: 30, durationInFrames: peakAt - at, config: { damping: 14, stiffness: 60 } });
  return (
    <AbsoluteFill style={{ opacity: appear }}>
      <div style={{ position: "absolute", left: 150, bottom: 170, width: 760, transformOrigin: "50% 100%", transform: `scale(${1 - 0.42 * grow})`, filter: `brightness(${1 - 0.45 * grow})` }}>
        <Cutout src="leo2a8_cut.webp" width={760} glow={hexA(C.de, 0.18)} style={{ position: "relative" }} />
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 170, width: 760, transformOrigin: "60% 100%", transform: `scale(${1 + 0.62 * grow})` }}>
        <Cutout src="t14_cut.webp" width={760} glow={hexA(C.ru, 0.2 + 0.35 * grow)} style={{ position: "relative" }} />
      </div>
    </AbsoluteFill>
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
      <Unfair at={l(60.35)} peakAt={l(61.7)} />
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
      <div style={{ position: "absolute", left: 150, bottom: 140, display: "flex", alignItems: "baseline", gap: 40 }}>
        <KineticTitle text="Leopard 2" size={120} delay={0.2} stagger={0.03} />
        <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 120, lineHeight: 1, color: C.de, opacity: interpolate(frame, [14, 24], [0, 1], clamp) }}>1979</span>
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
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 20}px)` }}>
        <GlitchText text="4th generation" size={110} start={l(65.45)} color={C.text} intensity={0.8} style={{ display: "inline-block", textShadow: `0 0 30px ${hexA(C.ru, 0.8)}` }} />
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
