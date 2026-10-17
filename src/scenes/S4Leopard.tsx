import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { DarkStage, Grain, hexA } from "../components/Atmosphere";
import { FlagDE } from "../components/Flags";
import { Callout } from "../components/Hud";
import { Enter, handheld, shakeAt } from "../components/Motion";
import { Cutout, Photo } from "../components/Photo";
import { KineticTitle, Tag } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const S0 = SCENES.leopard.from;
const L = (t: number) => N(t) - S0;

// 4a — "On one side, the Leopard 2A8"
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".tank"), { x: -1500, skewX: 8, filter: "blur(16px)", duration: 0.75, ease: "expo.out" }, 0.02)
      .from(selector(".flag"), { opacity: 0, x: 40, duration: 0.6, ease: "expo.out" }, L(33.4) / 30 + 0.2);
  });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.2} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="tank" style={{ position: "absolute", left: 40, top: 330, width: 1040, transform: handheld(frame, 3, "leo") }}>
          <Cutout src="leo2a8_cut.webp" width={1040} glow={hexA(C.de, 0.25)} />
        </div>
        <div style={{ position: "absolute", left: 1130, top: 360, width: 760 }}>
          <KineticTitle text="Leopard" size={150} color={C.text} delay={L(33.4) / 30} stagger={0.03} />
          <KineticTitle text="2A8" size={190} color={C.de} delay={L(34.05) / 30} stagger={0.06} style={{ marginTop: -10 }} />
          <div className="flag" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
            <FlagDE width={96} />
            <Tag text="Germany" color={C.de} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4b — "more than four decades of continuous German engineering"
const Decades: React.FC<{ dur: number }> = ({ dur }) => {
  const t0 = N(34.96);
  const at = (t: number) => (N(t) - t0) / 30;
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .fromTo(selector(".num"), { textContent: 0 }, { textContent: 40, duration: at(36.35), ease: "power2.out", snap: { textContent: 1 } }, 0.1)
      .from(selector(".plus"), { opacity: 0, scale: 0.4, duration: 0.35, ease: "back.out(3)" }, at(36.35))
      .from(selector(".unit"), { opacity: 0, x: -30, duration: 0.5, ease: "expo.out" }, at(36.35))
      .fromTo(selector(".bar"), { scaleX: 0 }, { scaleX: 1, duration: at(37.6), ease: "power2.inOut" }, 0.1)
      .from(selector(".yr"), { opacity: 0, y: 10, duration: 0.4, stagger: at(37.6) - 0.3 }, 0.2);
  });
  return (
    <AbsoluteFill>
      <Photo src="leo2a8_side.jpg" dur={dur} grade="warm" darken={0.45} move={{ fromScale: 1.05, toScale: 1.16, fromX: 2, toX: -2 }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,9,11,0.92) 0%, rgba(7,9,11,0.55) 45%, rgba(7,9,11,0) 75%)" }} />
      <div ref={ref} style={{ position: "absolute", left: 150, top: 330 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span className="num" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 260, lineHeight: 1, color: C.text, width: 300, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            40
          </span>
          <span className="plus" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 160, color: C.de, lineHeight: 1 }}>
            +
          </span>
          <span className="unit" style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 90, color: C.de, textTransform: "uppercase" }}>
            years
          </span>
        </div>
        <div style={{ marginTop: 30, width: 640 }}>
          <div className="bar" style={{ height: 4, background: `linear-gradient(90deg, ${C.deDeep}, ${C.de})`, transformOrigin: "left" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: FONT.mono, fontSize: 28, color: C.muted }}>
            <span className="yr">1979</span>
            <span className="yr" style={{ color: C.de }}>2023</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4c — "a nearly 70-ton beast where every bolt was designed to keep working under real fire"
const Specs: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(38.88);
  const l = (t: number) => N(t) - t0;
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .fromTo(selector(".wt"), { textContent: 0 }, { textContent: 70, duration: l(39.65) / 30 - 0.1, ease: "power3.in", snap: { textContent: 1 } }, 0.1)
      .from(selector(".wtl"), { opacity: 0, y: 20, duration: 0.4 }, 0.15)
      .to(selector(".weight"), { opacity: 0, y: -60, duration: 0.45, ease: "power3.in" }, l(41.0) / 30)
      .from(selector(".tank"), { scale: 1.12, duration: 2.2, ease: "power2.out" }, 0);
  });
  const hit = l(39.65);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.16} />
      <div ref={ref} style={{ position: "absolute", inset: 0, transform: shakeAt(frame, [{ at: hit, dur: 14, amp: 16 }]) }}>
        <div className="tank" style={{ position: "absolute", left: 260, top: 250, width: 1400, transformOrigin: "50% 60%" }}>
          <Cutout src="leo2a8_cut.webp" width={1400} glow={hexA(C.de, 0.2)} />
        </div>
        <div className="weight" style={{ position: "absolute", left: 150, top: 80, transformOrigin: "left top" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 80, color: C.de }}>≈</span>
            <span className="wt" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 170, lineHeight: 1, color: C.text, width: 190, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              70
            </span>
            <span className="wtl" style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 72, color: C.de, textTransform: "uppercase" }}>
              tons
            </span>
          </div>
        </div>
      </div>
      <Callout x={1646} y={376} dx={-40} dy={-200} title="120 mm L55A1" color={C.de} delay={l(41.35)} align="right" />
      <Callout x={1170} y={334} dx={-100} dy={-150} title="Trophy APS" color={C.de} delay={l(42.25)} align="right" />
      <Callout x={540} y={591} dx={-120} dy={400} title="1,500 hp" color={C.de} delay={l(43.15)} />
    </AbsoluteFill>
  );
};

export const S4Leopard: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence durationInFrames={L(34.96) + 2} name="4a revelação">
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
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
