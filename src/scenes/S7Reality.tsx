import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { LightLeak } from "@remotion/light-leaks";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { DarkStage, Flash, Grain, TechGrid, hexA } from "../components/Atmosphere";
import { Brochure } from "../components/Cards";
import { HudFrame } from "../components/Hud";
import { shakeAt } from "../components/Motion";
import { Cutout, Photo } from "../components/Photo";
import { KineticTitle, Tag } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.reality.from;
const L = (t: number) => N(t) - S0;

// Borda rasgada (zigue-zague determinístico) para dividir o folheto em duas metades
const TEAR = Array.from({ length: 17 }).map((_, i) => [50 + (i % 2 === 0 ? -3 : 3) + ((i * 37) % 5) - 2, (i / 16) * 100]);
const leftClip = `polygon(0 0, ${TEAR.map(([x, y]) => `${x}% ${y}%`).join(", ")}, 0 100%)`;
const rightClip = `polygon(100% 0, ${TEAR.map(([x, y]) => `${x}% ${y}%`).join(", ")}, 100% 100%)`;

// 7a — "Mas em combate real, o papel não vence batalhas"
const PaperTear: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tear = L(71.9);
  const k = interpolate(frame, [tear, tear + 26], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const tagIn = interpolate(frame, [L(70.4), L(70.7)], [0, 1], clamp);
  // as duas metades ficam num mesmo suporte inclinado; só o rasgo as separa
  const half = (side: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        clipPath: side < 0 ? leftClip : rightClip,
        transform: `translate(${side * k * 520}px, ${k * k * 900}px) rotate(${side * k * 28}deg)`,
        transformOrigin: side < 0 ? "0% 100%" : "100% 100%",
      }}
    >
      <Brochure style={{ filter: "grayscale(0.4)" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ transform: shakeAt(frame, [{ at: 0, dur: 16, amp: 18 }]) }}>
      <Photo src="leo2_firing.jpg" dur={dur} grade="mono" darken={0.45} move={{ fromScale: 1.18, toScale: 1.08 }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 10, flexDirection: "column" }}>
        <KineticTitle text="O papel não" size={150} delay={(tear + 4) / 30} stagger={0.025} />
        <KineticTitle text="vence batalhas" size={150} color={C.de} delay={(tear + 12) / 30} stagger={0.025} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 640, top: 200, width: 640, height: 820, transform: "rotate(-3deg)" }}>
        {half(-1)}
        {half(1)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", opacity: tagIn }}>
        <Tag text="Em combate real" color={C.text} />
      </div>
    </AbsoluteFill>
  );
};

// 7b — Título principal: LEOPARD 2A8 × T-14 ARMATA
const MainTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".leo"), { x: -900, duration: 0.7, ease: "expo.out" }, 0)
      .from(selector(".t14"), { x: 900, duration: 0.7, ease: "expo.out" }, 0)
      .from(selector(".vs"), { scale: 3, opacity: 0, duration: 0.5, ease: "expo.out" }, 0.15)
      .from(selector(".n-de"), { y: 60, opacity: 0, duration: 0.6, ease: "expo.out" }, 0.25)
      .from(selector(".n-ru"), { y: 60, opacity: 0, duration: 0.6, ease: "expo.out" }, 0.35)
      .from(selector(".sub"), { opacity: 0, letterSpacing: "40px", duration: 1.0, ease: "expo.out" }, 0.6)
      .to(selector(".stage"), { scale: 1.06, duration: 3.6, ease: "none" }, 0);
  });
  return (
    <AbsoluteFill style={{ transform: shakeAt(frame, [{ at: 0, dur: 18, amp: 20 }]) }}>
      <DarkStage left={C.de} right={C.ru} glow={0.3} />
      <TechGrid opacity={0.18} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="stage" style={{ position: "absolute", inset: 0 }}>
          <div className="leo" style={{ position: "absolute", left: -60, top: 470, width: 1000 }}>
            <Cutout src="leo2a8_cut.webp" width={1000} glow={hexA(C.de, 0.3)} />
          </div>
          <div className="t14" style={{ position: "absolute", left: 980, top: 500, width: 1000 }}>
            <Cutout src="t14_cut.webp" width={1000} glow={hexA(C.ru, 0.3)} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", alignItems: "center", gap: 46 }}>
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
        <div className="sub" style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", fontFamily: FONT.mono, fontSize: 26, letterSpacing: 14, color: C.muted }}>
          MARKETING × REALIDADE
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const S7Reality: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence  durationInFrames={L(74.34)} name="7a papel">
      <PaperTear dur={L(74.34)} />
    </Sequence>
    <Sequence from={L(74.34)} durationInFrames={L(77.76) - L(74.34)} name="7b título">
      <MainTitle />
      <Sequence  durationInFrames={40} layout="none">
        <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.85 }}>
          <LightLeak durationInFrames={40} seed={4} hueShift={10} />
        </AbsoluteFill>
      </Sequence>
    </Sequence>
    <Flash at={0} length={6} peak={0.6} />
    <Flash at={L(74.34)} length={10} peak={0.95} />
    <HudFrame label="VEREDITO" sub="EM ANÁLISE" />
    <Grain opacity={0.06} />
  </AbsoluteFill>
);
