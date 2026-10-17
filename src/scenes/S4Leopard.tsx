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
const RATIO = 1193 / 2400; // proporção do recorte leo2a8_cut.webp

// 4a — "On one side, the Leopard 2A8"
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".tank"), { x: -1500, skewX: 8, filter: "blur(16px)", duration: 0.75, ease: "expo.out" }, 0.02)
      .from(selector(".id"), { opacity: 0, y: -20, duration: 0.6, ease: "expo.out" }, L(33.4) / 30);
  });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.2} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="tank" style={{ position: "absolute", left: 30, top: 540 - (1080 * RATIO) / 2 + 40, width: 1080, transform: handheld(frame, 3, "leo") }}>
          <Cutout src="leo2a8_cut.webp" width={1080} glow={hexA(C.de, 0.25)} />
        </div>
        <div style={{ position: "absolute", left: 1170, top: 300, width: 720 }}>
          <div className="id" style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22 }}>
            <FlagDE width={110} />
            <Tag text="Germany" color={C.de} size={64} />
          </div>
          <KineticTitle text="Leopard" size={160} color={C.text} delay={L(33.4) / 30} stagger={0.03} />
          <KineticTitle text="2A8" size={200} color={C.de} delay={L(34.05) / 30} stagger={0.06} style={{ marginTop: -14 }} />
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
      .from(selector(".y1"), { opacity: 0, y: 20, duration: 0.45, ease: "expo.out" }, 0.25)
      .from(selector(".y2"), { opacity: 0, y: 20, duration: 0.45, ease: "expo.out" }, at(37.55));
  });
  return (
    <AbsoluteFill>
      <Photo src="leo2a8_side.jpg" dur={dur} grade="warm" darken={0.45} move={{ fromScale: 1.05, toScale: 1.16, fromX: 2, toX: -2 }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,9,11,0.92) 0%, rgba(7,9,11,0.55) 45%, rgba(7,9,11,0) 75%)" }} />
      <div ref={ref} style={{ position: "absolute", left: 150, top: 290 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span className="num" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 280, lineHeight: 1, color: C.text, width: 320, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            40
          </span>
          <span className="plus" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 170, color: C.de, lineHeight: 1 }}>
            +
          </span>
          <span className="unit" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 110, color: C.de, textTransform: "uppercase" }}>
            years
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 70, marginTop: 30, paddingLeft: 40, fontFamily: FONT.display, fontWeight: 700, fontSize: 84, lineHeight: 1 }}>
          <span className="y1" style={{ color: C.text }}>1979</span>
          <span className="y2" style={{ color: C.de }}>2023</span>
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
  // recorte posicionado em (260, 250) com 1400 px de largura
  const W = 1400;
  const P = (fx: number, fy: number) => [260 + fx * W, 250 + fy * W * RATIO] as const;
  const muzzle = P(0.975, 0.05);
  const trophy = P(0.754, 0.27);
  const engine = P(0.17, 0.39);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.16} />
      <div ref={ref} style={{ position: "absolute", inset: 0, transform: shakeAt(frame, [{ at: hit, dur: 14, amp: 16 }]) }}>
        <div className="tank" style={{ position: "absolute", left: 260, top: 250, width: W, transformOrigin: "50% 60%" }}>
          <Cutout src="leo2a8_cut.webp" width={W} glow={hexA(C.de, 0.2)} />
        </div>
        <div className="weight" style={{ position: "absolute", left: 140, top: 70 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 110, color: C.de }}>≈</span>
            <span className="wt" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 180, lineHeight: 1, color: C.text, width: 200, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
              70
            </span>
            <span className="wtl" style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 110, color: C.de, textTransform: "uppercase" }}>
              tons
            </span>
          </div>
        </div>
      </div>
      <Callout x={muzzle[0]} y={muzzle[1]} dx={-10} dy={-160} title="120 mm L55A1" color={C.de} delay={l(41.35)} align="left" />
      <Callout x={trophy[0]} y={trophy[1]} dx={-110} dy={-215} title="Trophy APS" color={C.de} delay={l(42.25)} align="left" />
      <Callout x={engine[0]} y={engine[1]} dx={-170} dy={480} title="1,500 hp" color={C.de} delay={l(43.15)} align="right" />
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
