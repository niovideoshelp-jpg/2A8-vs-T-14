import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Grain, hexA } from "../components/Atmosphere";
import { FlagRU } from "../components/Flags";
import { Callout } from "../components/Hud";
import { LottieAsset } from "../components/LottieAsset";
import { Enter, handheld } from "../components/Motion";
import { Cutout } from "../components/Photo";
import { KineticTitle, Tag } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.armata.from;
const L = (t: number) => N(t) - S0;
const E = Easing.bezier(0.16, 1, 0.3, 1);

// 5a — "On the other side, the T-14 Armata, Russia's big bet"
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".tank"), { x: 1500, skewX: -8, filter: "blur(16px)", duration: 0.75, ease: "expo.out" }, 0.05)
      .from(selector(".flag"), { opacity: 0, x: -40, duration: 0.6, ease: "expo.out" }, L(46.05) / 30 + 0.25)
      // "Russia's big bet": leve avanço de câmera sobre o tanque
      .to(selector(".tank"), { scale: 1.06, duration: 1.4, ease: "power2.inOut" }, L(47.6) / 30);
  });
  return (
    <AbsoluteFill>
      <DarkStage left={C.ru} right={C.ru} glow={0.2} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="tank" style={{ position: "absolute", left: 830, top: 360, width: 1060, transform: handheld(frame, 3, "t14"), transformOrigin: "50% 60%" }}>
          <Cutout src="t14_cut.webp" width={1060} glow={hexA(C.ru, 0.25)} />
        </div>
        <div style={{ position: "absolute", left: 130, top: 330, width: 760 }}>
          <KineticTitle text="T-14" size={190} color={C.ru} delay={L(46.05) / 30} stagger={0.06} />
          <KineticTitle text="Armata" size={150} color={C.text} delay={L(46.75) / 30} stagger={0.03} style={{ marginTop: -10 }} />
          <div className="flag" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
            <FlagRU width={96} />
            <Tag text="Russia" color={C.ru} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 5b — "reinvent the battle tank from scratch by pulling the crew out of the turret"
const Turret: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(48.88);
  const l = (t: number) => N(t) - t0;
  const push = interpolate(frame, [0, l(53.4)], [1.0, 1.12], { ...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1) });
  const W = 1500;
  const ox = 210;
  const oy = 260;
  const H = W * (1114 / 2400);
  const turret = [ox + 0.6 * W, oy + 0.22 * H] as const;
  return (
    <AbsoluteFill>
      <DarkStage left={C.ru} right={C.ru} glow={0.16} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "60% 40%" }}>
        <div style={{ position: "absolute", left: ox, top: oy, width: W }}>
          <Cutout src="t14_cut.webp" width={W} glow={hexA(C.ru, 0.2)} />
        </div>
        <Sequence from={l(52.3)} layout="none">
          <div style={{ position: "absolute", left: turret[0] - 170, top: turret[1] - 170, width: 340, height: 340, opacity: 0.95 }}>
            <LottieAsset name="reticle-red" />
          </div>
        </Sequence>
        <Callout x={turret[0]} y={turret[1]} dx={160} dy={-150} title="Unmanned turret" color={C.ru} delay={l(52.85)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 5c — "putting everyone in an armored capsule in the hull" (diagrama de compartimentos)
const Capsule: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t0 = N(53.4);
  const l = (t: number) => N(t) - t0;
  const zoom = interpolate(frame, [0, dur], [1.0, 1.08], { easing: Easing.bezier(0.33, 0, 0.67, 1) });
  // a imagem (1,5:1) cobre 1920x1280 e é cortada 100 px em cima/embaixo
  const box = (x0: number, x1: number, y0: number, y1: number) => ({
    left: x0 * 1920,
    top: y0 * 1280 - 100,
    width: (x1 - x0) * 1920,
    height: (y1 - y0) * 1280,
  });
  const turret = box(0.25, 0.646, 0.338, 0.494);
  const crew = box(0.625, 0.933, 0.519, 0.675);
  const turretIn = interpolate(frame, [4, 14], [0, 1], { ...clamp, easing: E });
  const crewIn = interpolate(frame, [l(54.7), l(55.1)], [0, 1], { ...clamp, easing: E });
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.25);
  const label = (text: string, color: string) => (
    <div style={{ position: "absolute", left: 0, top: -50, fontFamily: FONT.display, fontWeight: 700, fontSize: 36, letterSpacing: 2, color: "#fff", background: hexA("#07090B", 0.8), borderLeft: `5px solid ${color}`, padding: "2px 14px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f12" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "70% 55%" }}>
        <Img
          src={staticFile("img/t14_compartments.jpg")}
          style={{ width: 1920, height: 1280, objectFit: "cover", position: "absolute", top: -100, left: 0, filter: "grayscale(1) contrast(1.15) brightness(0.55)" }}
        />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 60% 55%, transparent 40%, rgba(5,8,10,0.8) 100%)" }} />
        <div style={{ position: "absolute", ...turret, border: `3px solid ${C.text}`, background: "rgba(233,238,241,0.08)", opacity: turretIn * (1 - 0.5 * crewIn) }} />
        <div
          style={{
            position: "absolute",
            ...crew,
            border: `4px solid ${C.ru}`,
            background: hexA(C.ru, 0.14 + 0.18 * pulse * crewIn),
            boxShadow: `0 0 ${40 * crewIn}px ${hexA(C.ru, 0.7)}`,
            opacity: crewIn,
            transform: `scale(${0.9 + 0.1 * crewIn})`,
          }}
        >
          {label("Armored crew capsule", C.ru)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const S5Armata: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence durationInFrames={L(48.88) + 2} name="5a revelação">
      <Enter kind="whip-right" frames={10}>
        <Reveal />
      </Enter>
    </Sequence>
    <Sequence from={L(48.88)} durationInFrames={L(53.4) - L(48.88) + 2} name="5b torre">
      <Enter kind="zoom-in" frames={10}>
        <Turret />
      </Enter>
    </Sequence>
    <Sequence from={L(53.4)} durationInFrames={L(56.64) - L(53.4)} name="5c cápsula">
      <Enter kind="wipe-left" frames={12}>
        <Capsule dur={L(56.64) - L(53.4)} />
      </Enter>
    </Sequence>
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
