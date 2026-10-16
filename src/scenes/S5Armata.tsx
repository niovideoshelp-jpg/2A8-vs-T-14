import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Grain, TechGrid, hexA } from "../components/Atmosphere";
import { FlagRU } from "../components/Flags";
import { Callout, HudFrame, ScanLine } from "../components/Hud";
import { LottieAsset } from "../components/LottieAsset";
import { Enter, handheld } from "../components/Motion";
import { Cutout } from "../components/Photo";
import { KineticTitle, Tag } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.armata.from;
const L = (t: number) => N(t) - S0;

// 5a/5b — entrada do T-14 Armata + "a grande aposta da Rússia"
const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".tank"), { x: 1500, skewX: -8, filter: "blur(16px)", duration: 0.75, ease: "expo.out" }, 0.05)
      .from(selector(".flag"), { opacity: 0, x: -40, duration: 0.6, ease: "expo.out" }, L(46.05) / 30 + 0.25)
      .from(selector(".line"), { scaleX: 0, duration: 0.7, ease: "expo.out" }, L(46.05) / 30)
      .from(selector(".bet"), { opacity: 0, y: 24, duration: 0.6, ease: "expo.out" }, L(47.62) / 30);
  });
  return (
    <AbsoluteFill>
      <DarkStage left={C.ru} right={C.ru} glow={0.2} />
      <TechGrid opacity={0.2} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="tank" style={{ position: "absolute", left: 830, top: 360, width: 1060, transform: handheld(frame, 3, "t14") }}>
          <Cutout src="t14_cut.webp" width={1060} glow={hexA(C.ru, 0.25)} />
        </div>
        <div style={{ position: "absolute", left: 130, top: 300, width: 760 }}>
          <div className="flag" style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
            <FlagRU width={96} />
            <Tag text="Rússia" color={C.ru} />
          </div>
          <KineticTitle text="T-14" size={190} color={C.ru} delay={L(46.05) / 30} stagger={0.06} />
          <KineticTitle text="Armata" size={150} color={C.text} delay={L(46.6) / 30} stagger={0.03} style={{ marginTop: -10 }} />
          <div className="line" style={{ width: 520, height: 3, background: C.ru, transformOrigin: "left", marginTop: 12 }} />
          <div className="bet" style={{ marginTop: 22, fontFamily: FONT.label, fontWeight: 700, fontSize: 44, letterSpacing: 3, color: C.text, textTransform: "uppercase" }}>
            A grande aposta <span style={{ color: C.ru }}>da Rússia</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 5c — reinventar o tanque: torre não tripulada
const Reinvent: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(48.88);
  const l = (t: number) => N(t) - t0;
  const push = interpolate(frame, [0, l(52.6)], [1.0, 1.1], { ...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1) });
  // pontos no recorte (1500 px de largura, posicionado em 210,260)
  const W = 1500;
  const ox = 210;
  const oy = 260;
  const H = W * (1114 / 2400);
  const P = (fx: number, fy: number) => [ox + fx * W, oy + fy * H] as const;
  const turret = P(0.6, 0.22);
  return (
    <AbsoluteFill>
      <DarkStage left={C.ru} right={C.ru} glow={0.16} />
      <TechGrid opacity={0.2} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "60% 40%" }}>
        <div style={{ position: "absolute", left: ox, top: oy, width: W }}>
          <Cutout src="t14_cut.webp" width={W} glow={hexA(C.ru, 0.2)} />
        </div>
        <div style={{ position: "absolute", left: turret[0] - 170, top: turret[1] - 170, width: 340, height: 340, opacity: interpolate(frame, [l(51.1), l(51.3)], [0, 0.95], clamp) }}>
          <Sequence from={l(51.1)} layout="none">
            <LottieAsset name="reticle-red" />
          </Sequence>
        </div>
        <Callout x={turret[0]} y={turret[1]} dx={160} dy={-150} title="Torre não tripulada" value="OPERADA REMOTAMENTE" color={C.ru} delay={l(51.35)} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 140, top: 130 }}>
        <KineticTitle text="Reinventar o tanque" size={88} delay={0.15} stagger={0.025} />
      </div>
      <ScanLine color={C.ru} period={80} opacity={0.2} />
    </AbsoluteFill>
  );
};

// 5d — diagrama de compartimentos: tripulação em cápsula blindada
const Capsule: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t0 = N(52.6);
  const l = (t: number) => N(t) - t0;
  const zoom = interpolate(frame, [0, dur], [1.0, 1.08], { easing: Easing.bezier(0.33, 0, 0.67, 1) });
  // a imagem (1,5:1) cobre 1920x1280 e é cortada 100 px em cima/embaixo
  const box = (x0: number, x1: number, y0: number, y1: number) => ({
    left: x0 * 1920,
    top: y0 * 1280 - 100,
    width: (x1 - x0) * 1920,
    height: (y1 - y0) * 1280,
  });
  const zones = [
    { key: "turret", label: "Torre não tripulada", color: "#F2C230", b: box(0.25, 0.646, 0.338, 0.494), at: 53.0 },
    { key: "ammo", label: "Autocarregador", color: "#3CC24A", b: box(0.392, 0.621, 0.519, 0.675), at: 53.5 },
    { key: "engine", label: "Motor", color: "#3A62E8", b: box(0.083, 0.385, 0.519, 0.675), at: 53.9 },
  ];
  const crew = box(0.625, 0.933, 0.519, 0.675);
  const crewIn = interpolate(frame, [l(54.1), l(54.5)], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.25);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f12" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "70% 55%" }}>
        <Img
          src={staticFile("img/t14_compartments.jpg")}
          style={{ width: 1920, height: 1280, objectFit: "cover", position: "absolute", top: -100, left: 0, filter: "grayscale(1) contrast(1.15) brightness(0.55)" }}
        />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 60% 55%, transparent 40%, rgba(5,8,10,0.8) 100%)" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,9,11,0.92) 0%, rgba(7,9,11,0.6) 22%, rgba(7,9,11,0) 40%)" }} />
        {zones.map((z) => {
          const o = interpolate(frame, [l(z.at), l(z.at) + 8], [0, 1], clamp);
          return (
            <div key={z.key} style={{ position: "absolute", ...z.b, border: `3px solid ${z.color}`, background: hexA(z.color, 0.14), opacity: o * (1 - 0.45 * crewIn) }}>
              <div style={{ position: "absolute", left: 10, bottom: 10, fontFamily: FONT.mono, fontWeight: 700, fontSize: 22, color: "#fff", background: hexA("#07090B", 0.75), padding: "4px 10px", letterSpacing: 2, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {z.label}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            ...crew,
            border: `4px solid ${C.ru}`,
            background: hexA(C.ru, 0.12 + 0.18 * pulse * crewIn),
            boxShadow: `0 0 ${40 * crewIn}px ${hexA(C.ru, 0.7)}`,
            opacity: crewIn,
            transform: `scale(${0.9 + 0.1 * crewIn})`,
          }}
        />
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 140, top: 105, textAlign: "right", opacity: crewIn, transform: `translateY(${(1 - crewIn) * 20}px)` }}>
        <Tag text="Tripulação" color={C.ru} style={{ justifyContent: "flex-end" }} />
        <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 96, color: C.text, textTransform: "uppercase", lineHeight: 1.02, marginTop: 8 }}>
          Cápsula
          <br />
          <span style={{ color: C.ru }}>blindada</span>
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 26, color: C.muted, marginTop: 12, letterSpacing: 2 }}>3 TRIPULANTES · CASCO DIANTEIRO</div>
      </div>
      <div style={{ position: "absolute", left: 140, bottom: 90, fontFamily: FONT.mono, fontSize: 16, color: C.muted, letterSpacing: 2 }}>
        DIAGRAMA: VITALY V. KUZMIN (CC BY-SA)
      </div>
    </AbsoluteFill>
  );
};

export const S5Armata: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence  durationInFrames={L(48.88) + 2} name="5a revelação">
      <Enter kind="whip-right" frames={10}>
        <Reveal />
      </Enter>
    </Sequence>
    <Sequence from={L(48.88)} durationInFrames={L(52.6) - L(48.88) + 2} name="5c reinventar">
      <Enter kind="zoom-in" frames={10}>
        <Reinvent />
      </Enter>
    </Sequence>
    <Sequence from={L(52.6)} durationInFrames={L(56.64) - L(52.6)} name="5d cápsula">
      <Enter kind="wipe-left" frames={12}>
        <Capsule dur={L(56.64) - L(52.6)} />
      </Enter>
    </Sequence>
    <HudFrame label="ALVO 02" sub="T-14 ARMATA · RUS" color={C.ru} />
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
