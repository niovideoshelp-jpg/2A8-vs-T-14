import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Grain } from "../components/Atmosphere";
import { Enter } from "../components/Motion";
import { Photo } from "../components/Photo";
import { KineticTitle } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.method.from;
const L = (t: number) => N(t) - S0;
const E = Easing.bezier(0.16, 1, 0.3, 1);

// 8a — "separate military marketing from real-world physics"
const MarketingVsPhysics: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const t0 = N(77.76);
  const l = (t: number) => N(t) - t0;
  const a = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: E });
  const b = interpolate(frame, [l(79.9), l(79.9) + 14], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - 50 * a}% 0 0)` }}>
        <Photo src="t14_parade_a.jpg" dur={dur} grade="neutral" darken={0.3} move={{ fromScale: 1.12, toScale: 1.04 }} style={{ filter: "saturate(1.4)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${100 - 50 * b}%)` }}>
        <Photo src="leo2_forest.jpg" dur={dur} grade="mono" darken={0.3} move={{ fromScale: 1.04, toScale: 1.12 }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 958, top: 0, bottom: 0, width: 4, background: C.text, transform: `scaleY(${b})` }} />
      <div style={{ position: "absolute", left: 120, bottom: 120 }}>
        <KineticTitle text="Marketing" size={110} delay={l(78.9) / 30} stagger={0.03} style={{ textShadow: "0 6px 30px rgba(0,0,0,0.7)" }} />
      </div>
      <div style={{ position: "absolute", left: 1080, bottom: 120 }}>
        <KineticTitle text="Physics" size={110} delay={l(80.3) / 30} stagger={0.03} style={{ textShadow: "0 6px 30px rgba(0,0,0,0.7)" }} />
      </div>
    </AbsoluteFill>
  );
};

// 8b — os seis temas da comparação (logística, "o fator esquecido", em destaque)
const ITEMS = [
  { t: "Firepower", at: 81.8, img: "leo2_firing.jpg" },
  { t: "Armor", at: 82.5, img: "t14_side.jpg" },
  { t: "Active protection", at: 82.95, img: "leo2a7_trophy.jpg" },
  { t: "Electronics", at: 84.56, img: "t14_top.jpg" },
  { t: "Mobility", at: 85.54, img: "leo2_move.jpg" },
  { t: "Industry & logistics", at: 89.07, img: "leo2a7_rail.jpg", key: true },
];

const Topics: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(81.12);
  const l = (t: number) => N(t) - t0;
  let active = -1;
  ITEMS.forEach((it, i) => {
    if (frame >= l(it.at)) active = i;
  });
  // "the factor a lot of people forget": o espaço do 6º item aparece vazio e pulsando antes de ser revelado
  const slot = interpolate(frame, [l(87.1), l(87.4)], [0, 1], { ...clamp, easing: E });
  const slotPulse = 0.55 + 0.45 * Math.sin(frame * 0.3);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.1} />
      <div style={{ position: "absolute", left: 140, top: 210, display: "flex", flexDirection: "column", gap: 22 }}>
        {ITEMS.map((it, i) => {
          const k = interpolate(frame, [l(it.at), l(it.at) + 10], [0, 1], { ...clamp, easing: E });
          const isActive = i === active;
          return (
            <div key={it.t} style={{ position: "relative", height: 84, display: "flex", alignItems: "center" }}>
              {it.key ? (
                <div style={{ position: "absolute", left: 0, top: 10, width: 640 * slot, height: 64, border: `2px solid ${C.de}`, opacity: slot * (1 - k) * slotPulse }} />
              ) : null}
              <span
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 700,
                  fontSize: isActive ? 72 : 58,
                  color: it.key ? C.de : C.text,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  opacity: k * (isActive ? 1 : 0.38),
                  transform: `translateX(${(1 - k) * -60}px)`,
                }}
              >
                {it.t}
              </span>
            </div>
          );
        })}
      </div>
      {/* imagem que acompanha o tema ativo */}
      <div style={{ position: "absolute", left: 1120, top: 220, width: 660, height: 640, overflow: "hidden", background: C.bg2, boxShadow: active === 5 ? `0 0 0 3px ${C.de}` : "none" }}>
        {ITEMS.map((it, i) => {
          const k = interpolate(frame, [l(it.at), l(it.at) + 8], [0, 1], clamp);
          if (i > active || (i < active && frame > l(ITEMS[i + 1].at) + 8)) return null;
          const z = interpolate(frame, [l(it.at), l(it.at) + 120], [1.15, 1.02], { ...clamp, easing: E });
          return (
            <Img
              key={it.t}
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
      </div>
    </AbsoluteFill>
  );
};

// 8c — "using official data and technical analyses": desenho técnico com cotas sendo traçadas
const Blueprint: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const drawIn = (start: number) => interpolate(frame, [start, start + 18], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const zoom = interpolate(frame, [0, dur], [1.0, 1.06]);
  const blue = "rgba(140, 200, 255, 0.95)";
  // cotas: [x1, y1, x2, y2, início]
  const dims = [
    [310, 225, 1610, 225, 4],
    [310, 945, 1150, 945, 14],
    [1665, 330, 1665, 905, 24],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#071420" }}>
      {/* detecção de bordas: transforma a foto em traço de desenho técnico */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="blueprint-edges" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feConvolveMatrix order={3} kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.78  0 0 0 0 1  2.2 2.2 2.2 0 0" />
        </filter>
      </svg>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{ position: "absolute", left: 310, top: 260, width: 1300 }}>
          <Img src={staticFile("img/leo2a8_cut.webp")} style={{ width: "100%", filter: "url(#blueprint-edges)", opacity: 0.95 }} />
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {dims.map(([x1, y1, x2, y2, s], i) => {
            const k = drawIn(s);
            const len = Math.hypot(x2 - x1, y2 - y1);
            const vertical = x1 === x2;
            const tick = (x: number, y: number) =>
              vertical ? <line x1={x - 14} y1={y} x2={x + 14} y2={y} stroke={blue} strokeWidth={2} /> : <line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={blue} strokeWidth={2} />;
            return (
              <g key={i} opacity={k > 0 ? 1 : 0}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={blue} strokeWidth={2} strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
                {tick(x1, y1)}
                {k > 0.98 ? tick(x2, y2) : null}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 50%, rgba(2,8,14,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

export const S8Method: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence durationInFrames={L(81.12) + 2} name="8a marketing x física">
      <MarketingVsPhysics dur={L(81.12)} />
    </Sequence>
    <Sequence from={L(81.12)} durationInFrames={L(92.4) - L(81.12) + 2} name="8b temas">
      <Enter kind="zoom-in" frames={10}>
        <Topics />
      </Enter>
    </Sequence>
    <Sequence from={L(92.4)} durationInFrames={L(95.12) - L(92.4)} name="8c dados técnicos">
      <Enter kind="wipe-right" frames={12}>
        <Blueprint dur={L(95.12) - L(92.4)} />
      </Enter>
    </Sequence>
    <Grain opacity={0.05} />
  </AbsoluteFill>
);
