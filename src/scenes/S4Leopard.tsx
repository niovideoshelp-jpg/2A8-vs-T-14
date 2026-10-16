import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { DarkStage, Grain, TechGrid, hexA } from "../components/Atmosphere";
import { FlagDE } from "../components/Flags";
import { Callout, HudFrame, ScanLine } from "../components/Hud";
import { Enter, handheld, shakeAt } from "../components/Motion";
import { Cutout, Photo } from "../components/Photo";
import { KineticTitle, Tag } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.leopard.from;
const L = (t: number) => N(t) - S0;

// 4a — entrada do Leopard 2A8 com título
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".tank"), { x: -1500, skewX: 8, filter: "blur(16px)", duration: 0.75, ease: "expo.out" }, 0.02)
      .from(selector(".flag"), { opacity: 0, x: 40, duration: 0.6, ease: "expo.out" }, (L(33.6) / 30) + 0.25)
      .from(selector(".line"), { scaleX: 0, duration: 0.7, ease: "expo.out" }, L(33.6) / 30);
  });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.2} />
      <TechGrid opacity={0.2} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="tank" style={{ position: "absolute", left: 40, top: 330, width: 1040, transform: handheld(frame, 3, "leo") }}>
          <Cutout src="leo2a8_cut.webp" width={1040} glow={hexA(C.de, 0.25)} />
        </div>
        <div style={{ position: "absolute", left: 1120, top: 330, width: 760 }}>
          <div className="flag" style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
            <FlagDE width={96} />
            <Tag text="Alemanha" color={C.de} />
          </div>
          <KineticTitle text="Leopard" size={150} color={C.text} delay={L(33.6) / 30} stagger={0.03} />
          <KineticTitle text="2A8" size={190} color={C.de} delay={L(34.3) / 30} stagger={0.06} style={{ marginTop: -10 }} />
          <div className="line" style={{ width: 520, height: 3, background: C.de, transformOrigin: "left", marginTop: 12 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4b — quatro décadas de engenharia (1979 → 2023)
const Decades: React.FC<{ dur: number }> = ({ dur }) => {
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .fromTo(selector(".num"), { textContent: 0 }, { textContent: 44, duration: 1.6, ease: "power2.out", snap: { textContent: 1 } }, 0.25)
      .from(selector(".unit"), { opacity: 0, x: -30, duration: 0.5, ease: "expo.out" }, 0.6)
      .fromTo(selector(".bar"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power2.out" }, 0.25)
      .from(selector(".yr"), { opacity: 0, y: 10, duration: 0.4, stagger: 1.2 }, 0.3);
  });
  return (
    <AbsoluteFill>
      <Photo src="leo2a8_side.jpg" dur={dur} grade="warm" darken={0.45} move={{ fromScale: 1.05, toScale: 1.16, fromX: 2, toX: -2 }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,9,11,0.92) 0%, rgba(7,9,11,0.55) 45%, rgba(7,9,11,0) 75%)" }} />
      <div ref={ref} style={{ position: "absolute", left: 150, top: 300 }}>
        <Tag text="Mais de quatro décadas" color={C.de} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 10 }}>
          <span className="num" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 260, lineHeight: 1, color: C.text }}>
            44
          </span>
          <span className="unit" style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 90, color: C.de, textTransform: "uppercase" }}>
            anos
          </span>
        </div>
        <div style={{ fontFamily: FONT.label, fontWeight: 700, fontSize: 52, letterSpacing: 3, color: C.text, textTransform: "uppercase", marginTop: 6 }}>
          de engenharia alemã
        </div>
        <div style={{ marginTop: 34, width: 640 }}>
          <div className="bar" style={{ height: 4, background: `linear-gradient(90deg, ${C.deDeep}, ${C.de})`, transformOrigin: "left" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: FONT.mono, fontSize: 24, color: C.muted }}>
            <span className="yr">1979 · LEOPARD 2</span>
            <span className="yr" style={{ color: C.de }}>2023 · 2A8</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4c/4d — ~70 toneladas + componentes projetados para o combate
const Specs: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(38.88);
  const l = (t: number) => N(t) - t0;
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .fromTo(selector(".wt"), { textContent: 0 }, { textContent: 70, duration: l(40.05) / 30 - 0.15, ease: "power3.in", snap: { textContent: 1 } }, 0.15)
      .from(selector(".wtl"), { opacity: 0, y: 20, duration: 0.4 }, 0.2)
      .to(selector(".weight"), { opacity: 0, y: -60, duration: 0.45, ease: "power3.in" }, l(40.85) / 30)
      .from(selector(".tank"), { scale: 1.12, duration: 2.2, ease: "power2.out" }, 0);
  });
  const hit = l(40.05);
  const tagIn = interpolate(frame, [l(43.25), l(43.6)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.16} />
      <TechGrid opacity={0.22} />
      <div ref={ref} style={{ position: "absolute", inset: 0, transform: shakeAt(frame, [{ at: hit, dur: 14, amp: 16 }]) }}>
        <div className="tank" style={{ position: "absolute", left: 260, top: 250, width: 1400, transformOrigin: "50% 60%" }}>
          <Cutout src="leo2a8_cut.webp" width={1400} glow={hexA(C.de, 0.2)} />
        </div>
        <div className="weight" style={{ position: "absolute", left: 150, top: 90, transformOrigin: "left top" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 80, color: C.de }}>≈</span>
            <span
              className="wt"
              style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 170, lineHeight: 1, color: C.text, width: 190, textAlign: "right", fontVariantNumeric: "tabular-nums" }}
            >
              70
            </span>
            <span className="wtl" style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 72, color: C.de, textTransform: "uppercase" }}>
              toneladas
            </span>
          </div>
        </div>
      </div>
      <Callout x={1646} y={376} dx={-40} dy={-200} title="Canhão 120 mm" value="RHEINMETALL L/55A1" color={C.de} delay={l(41.35)} align="right" />
      <Callout x={1170} y={334} dx={-100} dy={-150} title="Proteção ativa" value="TROPHY APS" color={C.de} delay={l(42.25)} align="right" />
      <Callout x={540} y={591} dx={-120} dy={400} title="Motor 1.500 cv" value="MTU MB 873" color={C.de} delay={l(43.15)} />
      <div style={{ position: "absolute", left: 150, top: 130, opacity: tagIn, transform: `translateY(${(1 - tagIn) * 14}px)` }}>
        <Tag text="Projetado para o combate real" color={C.text} />
      </div>
      <ScanLine color={C.de} period={75} opacity={0.22} />
    </AbsoluteFill>
  );
};

export const S4Leopard: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Sequence  durationInFrames={L(34.96) + 2} name="4a revelação">
        <Reveal />
      </Sequence>
      <Sequence from={L(34.96)} durationInFrames={L(38.88) - L(34.96) + 2} name="4b décadas">
        <Enter kind="whip-left" frames={9}>
          <Decades dur={L(38.88) - L(34.96)} />
        </Enter>
      </Sequence>
      <Sequence from={L(38.88)} durationInFrames={L(44.72) - L(38.88)} name="4c especificações">
        <Enter kind="zoom-in" frames={10}>
          <Specs />
        </Enter>
      </Sequence>
      <HudFrame label="ALVO 01" sub="LEOPARD 2A8 · DEU" color={C.de} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
