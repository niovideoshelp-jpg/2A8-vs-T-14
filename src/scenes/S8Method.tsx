import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Grain, TechGrid, hexA } from "../components/Atmosphere";
import { HudFrame } from "../components/Hud";
import { LottieAsset } from "../components/LottieAsset";
import { Enter } from "../components/Motion";
import { Photo } from "../components/Photo";
import { KineticTitle, Tag, TypeOn } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.method.from;
const L = (t: number) => N(t) - S0;
const E = Easing.bezier(0.16, 1, 0.3, 1);

// 8a — separar o marketing militar da física do mundo real
const MarketingVsPhysics: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t0 = N(77.76);
  const l = (t: number) => N(t) - t0;
  const a = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: E });
  const b = interpolate(frame, [l(79.8), l(79.8) + 14], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - 50 * a}% 0 0)` }}>
        <Photo src="t14_parade_a.jpg" dur={dur} grade="neutral" darken={0.35} move={{ fromScale: 1.12, toScale: 1.04 }} style={{ filter: "saturate(1.4)" }} />
        <AbsoluteFill style={{ background: `linear-gradient(0deg, ${hexA(C.ru, 0.25)}, transparent 60%)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${100 - 50 * b}%)` }}>
        <Photo src="leo2_forest.jpg" dur={dur} grade="mono" darken={0.35} move={{ fromScale: 1.04, toScale: 1.12 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 958, top: 0, bottom: 0, width: 4, background: C.text, transform: `scaleY(${b})` }} />
      <div style={{ position: "absolute", left: 120, bottom: 150, opacity: a }}>
        <Tag text="Marketing militar" color={C.ru} />
        <KineticTitle text="Promessas" size={110} delay={0.2} stagger={0.03} />
      </div>
      <div style={{ position: "absolute", left: 1080, bottom: 150 }}>
        <div style={{ opacity: b }}>
          <Tag text="Física do mundo real" color={C.de} />
        </div>
        <KineticTitle text="Realidade" size={110} delay={l(79.9) / 30} stagger={0.03} />
      </div>
    </AbsoluteFill>
  );
};

// 8b — índice do dossiê: os temas da comparação
const ITEMS = [
  { n: "01", t: "Poder de fogo", at: 81.75, img: "leo2_firing.jpg" },
  { n: "02", t: "Blindagem", at: 82.66, img: "t14_side.jpg" },
  { n: "03", t: "Proteção ativa", at: 83.33, img: "leo2a7_trophy.jpg" },
  { n: "04", t: "Eletrônica", at: 84.72, img: "t14_top.jpg" },
  { n: "05", t: "Mobilidade", at: 85.52, img: "leo2_move.jpg" },
  { n: "06", t: "Indústria e logística", at: 88.9, img: "leo2a7_rail.jpg", key: true },
];

const Dossier: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(81.12);
  const l = (t: number) => N(t) - t0;
  let active = -1;
  ITEMS.forEach((it, i) => {
    if (frame >= l(it.at)) active = i;
  });
  const forgot = interpolate(frame, [l(87.12), l(87.4)], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.1} />
      <TechGrid opacity={0.2} />
      <div style={{ position: "absolute", left: 140, top: 150 }}>
        <Tag text="O que vamos comparar" color={C.muted} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 230, display: "flex", flexDirection: "column", gap: 18 }}>
        {ITEMS.map((it, i) => {
          const k = interpolate(frame, [l(it.at), l(it.at) + 10], [0, 1], { ...clamp, easing: E });
          const isActive = i === active;
          const color = it.key ? C.de : C.text;
          return (
            <div key={it.n} style={{ display: "flex", alignItems: "center", gap: 22, opacity: k * (isActive ? 1 : 0.42), transform: `translateX(${(1 - k) * -60}px)` }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 26, color: it.key ? C.de : C.muted, width: 44 }}>{it.n}</span>
              <span style={{ width: isActive ? 46 : 18, height: 3, background: it.key ? C.de : C.text }} />
              <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: isActive ? 68 : 56, color, textTransform: "uppercase", letterSpacing: 2, lineHeight: 1.05, whiteSpace: "nowrap" }}>
                {it.t}
              </span>
            </div>
          );
        })}
        <div style={{ marginLeft: 66, marginTop: 6, opacity: forgot, transform: `translateY(${(1 - forgot) * 12}px)` }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: 4, color: C.bg, background: C.de, padding: "6px 14px" }}>
            ! O FATOR QUE MUITOS ESQUECEM
          </span>
        </div>
      </div>
      {/* painel de imagem que acompanha o item ativo */}
      <div style={{ position: "absolute", left: 1120, top: 220, width: 660, height: 640, overflow: "hidden", border: `1px solid ${C.line}`, background: C.bg2 }}>
        {ITEMS.map((it, i) => {
          const k = interpolate(frame, [l(it.at), l(it.at) + 8], [0, 1], clamp);
          if (i > active || (i < active && frame > l(ITEMS[i + 1].at) + 8)) return null;
          const z = interpolate(frame, [l(it.at), l(it.at) + 120], [1.15, 1.02], { ...clamp, easing: E });
          return (
            <Img
              key={it.n}
              src={staticFile(`img/${it.img}`)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: k,
                transform: `scale(${z})`,
                filter: it.key ? "contrast(1.1) saturate(0.85)" : "grayscale(0.35) contrast(1.1) brightness(0.85)",
                clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`,
              }}
            />
          );
        })}
        <div style={{ position: "absolute", left: 20, bottom: 18, fontFamily: FONT.mono, fontSize: 22, color: C.text, letterSpacing: 3 }}>
          {active >= 0 ? `${ITEMS[active].n} / 06` : ""}
        </div>
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${active === 5 ? C.de : "transparent"}` }} />
      </div>
    </AbsoluteFill>
  );
};

// 8c — dados oficiais e análises técnicas
const Sources: React.FC<{ dur: number }> = ({ dur }) => {
  const t0 = N(91.32);
  const l = (t: number) => N(t) - t0;
  return (
    <AbsoluteFill>
      <Photo src="t14_compartments.jpg" dur={dur} grade="mono" darken={0.7} move={{ fromScale: 1.05, toScale: 1.15 }} />
      <AbsoluteFill style={{ background: "rgba(10, 30, 45, 0.45)", mixBlendMode: "multiply" }} />
      <TechGrid opacity={0.35} size={48} />
      <div style={{ position: "absolute", right: 120, top: 200, width: 640, height: 640, opacity: 0.5 }}>
        <LottieAsset name="radar-white" loop />
      </div>
      <div style={{ position: "absolute", left: 150, top: 330, display: "flex", flexDirection: "column", gap: 26 }}>
        <TypeOn text="> METODOLOGIA" startFrame={2} cps={30} style={{ fontSize: 26, color: C.muted, letterSpacing: 4 }} cursor={false} />
        <TypeOn text="DADOS OFICIAIS" startFrame={l(92.4)} cps={26} style={{ fontSize: 76, color: C.text, fontWeight: 700 }} cursor={false} />
        <TypeOn text="ANÁLISES TÉCNICAS" startFrame={l(93.65)} cps={26} style={{ fontSize: 76, color: C.de, fontWeight: 700 }} />
      </div>
    </AbsoluteFill>
  );
};

export const S8Method: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence  durationInFrames={L(81.12) + 2} name="8a marketing x física">
      <MarketingVsPhysics dur={L(81.12)} />
    </Sequence>
    <Sequence from={L(81.12)} durationInFrames={L(91.32) - L(81.12) + 2} name="8b dossiê">
      <Enter kind="zoom-in" frames={10}>
        <Dossier />
      </Enter>
    </Sequence>
    <Sequence from={L(91.32)} durationInFrames={L(95.12) - L(91.32)} name="8c fontes">
      <Enter kind="wipe-right" frames={12}>
        <Sources dur={L(95.12) - L(91.32)} />
      </Enter>
    </Sequence>
    <HudFrame label="DOSSIÊ" sub="ESCOPO DA ANÁLISE" />
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
