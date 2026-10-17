import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { LightLeak } from "@remotion/light-leaks";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { DarkStage, Flash, Grain, hexA } from "../components/Atmosphere";
import { Brochure } from "../components/Cards";
import { shakeAt } from "../components/Motion";
import { Cutout, Photo } from "../components/Photo";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.reality.from;
const L = (t: number) => N(t) - S0;

// Borda rasgada (zigue-zague determinístico) para dividir o folheto em duas metades
const TEAR = Array.from({ length: 17 }).map((_, i) => [50 + (i % 2 === 0 ? -3 : 3) + ((i * 37) % 5) - 2, (i / 16) * 100]);
const leftClip = `polygon(0 0, ${TEAR.map(([x, y]) => `${x}% ${y}%`).join(", ")}, 0 100%)`;
const rightClip = `polygon(100% 0, ${TEAR.map(([x, y]) => `${x}% ${y}%`).join(", ")}, 100% 100%)`;

// 7a — "But on a real battlefield, paper doesn't stop an armor-piercing round"
const PaperVsRound: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const hit = L(73.2);
  // traçante do projétil atravessando o quadro em 3 frames
  const streak = interpolate(frame, [hit - 3, hit], [0, 1], clamp);
  const streakFade = interpolate(frame, [hit, hit + 6], [1, 0], clamp);
  const k = interpolate(frame, [hit + 1, hit + 26], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const hole = interpolate(frame, [hit, hit + 2, hit + 12], [0, 1, 0.6], clamp);
  const cardIn = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const half = (side: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath: side < 0 ? leftClip : rightClip,
        transform: `translate(${side * k * 560}px, ${k * k * 900}px) rotate(${side * k * 30}deg)`,
        transformOrigin: side < 0 ? "0% 100%" : "100% 100%",
      }}
    >
      <Brochure style={{ filter: "grayscale(0.3)" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ transform: shakeAt(frame, [{ at: 0, dur: 14, amp: 14 }, { at: hit, dur: 16, amp: 24 }]) }}>
      <Photo src="leo2_firing.jpg" dur={dur} grade="mono" darken={0.45} move={{ fromScale: 1.18, toScale: 1.08 }} />
      <div style={{ position: "absolute", left: 640, top: 130, width: 640, height: 820, transform: `rotate(-3deg) translateY(${(1 - cardIn) * 60}px)`, opacity: cardIn }}>
        {frame < hit + 1 ? (
          <Brochure style={{ filter: "grayscale(0.3)" }} />
        ) : (
          <>
            {half(-1)}
            {half(1)}
          </>
        )}
        {/* furo incandescente no ponto de impacto */}
        <div
          style={{
            position: "absolute",
            left: 320 - 60,
            top: 470 - 60,
            width: 120,
            height: 120,
            borderRadius: 60,
            background: "radial-gradient(circle, #fff 0%, #FFD27A 25%, rgba(242,120,30,0.6) 45%, transparent 70%)",
            opacity: hole * (1 - k),
          }}
        />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: streak > 0 ? streakFade : 0 }}>
        <defs>
          <linearGradient id="tracer" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#FFD27A" stopOpacity="0" />
            <stop offset="0.7" stopColor="#FFE9B8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <rect x={1920 - 1920 * streak} y={597} width={1920 * streak} height={6} fill="url(#tracer)" />
      </svg>
    </AbsoluteFill>
  );
};

// 7b — Título principal: LEOPARD 2A8 VS T-14 ARMATA
const MainTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".leo"), { x: -900, duration: 0.7, ease: "expo.out" }, 0)
      .from(selector(".t14"), { x: 900, duration: 0.7, ease: "expo.out" }, 0)
      .from(selector(".vs"), { scale: 3, opacity: 0, duration: 0.5, ease: "expo.out" }, 0.15)
      .from(selector(".n-de"), { y: 60, opacity: 0, duration: 0.6, ease: "expo.out" }, 0.25)
      .from(selector(".n-ru"), { y: 60, opacity: 0, duration: 0.6, ease: "expo.out" }, 0.35)
      .to(selector(".stage"), { scale: 1.06, duration: 3.6, ease: "none" }, 0);
  });
  return (
    <AbsoluteFill style={{ transform: shakeAt(frame, [{ at: 0, dur: 18, amp: 20 }]) }}>
      <DarkStage left={C.de} right={C.ru} glow={0.3} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="stage" style={{ position: "absolute", inset: 0 }}>
          <div className="leo" style={{ position: "absolute", left: -60, top: 470, width: 1000 }}>
            <Cutout src="leo2a8_cut.webp" width={1000} glow={hexA(C.de, 0.3)} />
          </div>
          <div className="t14" style={{ position: "absolute", left: 980, top: 500, width: 1000 }}>
            <Cutout src="t14_cut.webp" width={1000} glow={hexA(C.ru, 0.3)} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center", alignItems: "center", gap: 46 }}>
          <div className="n-de" style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 118, lineHeight: 1, color: C.text, textTransform: "uppercase" }}>Leopard</div>
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 118, lineHeight: 1, color: C.de }}>2A8</div>
          </div>
          <div className="vs" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 150, color: C.text, padding: "0 10px", textShadow: "0 0 40px rgba(255,255,255,0.35)" }}>
            VS
          </div>
          <div className="n-ru" style={{ textAlign: "left" }}>
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 118, lineHeight: 1, color: C.ru }}>T-14</div>
            <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 118, lineHeight: 1, color: C.text, textTransform: "uppercase" }}>Armata</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const S7Reality: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence durationInFrames={L(74.34)} name="7a papel x projétil">
      <PaperVsRound dur={L(74.34)} />
    </Sequence>
    <Sequence from={L(74.34)} durationInFrames={L(77.76) - L(74.34)} name="7b título">
      <MainTitle />
      <Sequence durationInFrames={40} layout="none">
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5 }}>
          <LightLeak durationInFrames={40} seed={4} hueShift={10} />
        </AbsoluteFill>
      </Sequence>
    </Sequence>
    <Flash at={0} length={6} peak={0.5} />
    <Flash at={L(73.2)} length={5} color="#FFE2A8" peak={0.55} />
    <Flash at={L(74.34)} length={10} peak={0.95} />
    <Grain opacity={0.06} />
  </AbsoluteFill>
);
