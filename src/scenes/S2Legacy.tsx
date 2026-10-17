import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Grain, hexA } from "../components/Atmosphere";
import { EuropeMap } from "../components/EuropeMap";
import { Enter } from "../components/Motion";
import { Photo } from "../components/Photo";
import { Tag } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.legacy.from;
const L = (t: number) => N(t) - S0;

// ---------- Linha do tempo dupla (Alemanha em cima, URSS/Rússia embaixo) ----------
const X = (year: number) => 160 + (year - 1940) * 34;
const CARD_W = 340;

type Item = { year: number; name: string; img: string; side: "de" | "ru"; pop: number; latest?: boolean };
const ITEMS: Item[] = [
  { year: 1940, name: "T-34", img: "hist_t34.jpg", side: "ru", pop: 16.9 },
  { year: 1965, name: "Leopard 1", img: "hist_leo1.jpg", side: "de", pop: 17.9 },
  { year: 1973, name: "T-72", img: "hist_t72.jpg", side: "ru", pop: 18.6 },
  { year: 1979, name: "Leopard 2", img: "hist_leo2a4.jpg", side: "de", pop: 19.3 },
  { year: 1992, name: "T-90", img: "hist_t90.jpg", side: "ru", pop: 20.3 },
  { year: 2015, name: "T-14 Armata", img: "t14_street.jpg", side: "ru", pop: 21.3, latest: true },
  { year: 2023, name: "Leopard 2A8", img: "leo2a8_expo.jpg", side: "de", pop: 22.1, latest: true },
];

const DualTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(16.56);
  const sec = (narr: number) => (N(narr) - t0) / 30;
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline.fromTo(selector(".world"), { x: 0 }, { x: -1522, duration: sec(22.5) - sec(16.75), ease: "power1.inOut" }, sec(16.75));
    timeline.fromTo(selector(".axis"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.out" }, 0);
    ITEMS.forEach((it, i) => {
      timeline.from(selector(`.card-${i}`), { opacity: 0, y: it.side === "de" ? -50 : 50, scale: 0.85, duration: 0.6, ease: "expo.out" }, sec(it.pop));
      timeline.from(selector(`.stem-${i}`), { scaleY: 0, duration: 0.4, ease: "power3.out" }, sec(it.pop));
    });
  });
  // "each in its own way": os dois modelos atuais ganham destaque
  const glow = interpolate(frame, [N(22.9) - t0, N(23.4) - t0], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.14} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="world" style={{ position: "absolute", left: 0, top: 0, width: 3600, height: 1080 }}>
          <div className="axis" style={{ position: "absolute", left: 80, top: 560, width: 3400, height: 2, background: C.text, opacity: 0.6, transformOrigin: "left center" }} />
          {Array.from({ length: 10 }).map((_, k) => {
            const y = 1940 + k * 10;
            return (
              <div key={y} style={{ position: "absolute", left: X(y) - 40, top: 572, width: 80, textAlign: "center", fontFamily: FONT.mono, fontSize: 20, color: C.muted }}>
                <div style={{ width: 2, height: 12, background: C.muted, margin: "-18px auto 6px" }} />
                {y}
              </div>
            );
          })}
          {ITEMS.map((it, i) => {
            const color = it.side === "de" ? C.de : C.ru;
            const top = it.side === "de" ? 196 : 640;
            const g = it.latest ? glow : 0;
            return (
              <React.Fragment key={it.name}>
                <div
                  className={`stem-${i}`}
                  style={{ position: "absolute", left: X(it.year), top: it.side === "de" ? 470 : 561, width: 2, height: 90, background: color, transformOrigin: it.side === "de" ? "bottom" : "top" }}
                />
                <div style={{ position: "absolute", left: X(it.year) - 6, top: 554, width: 14, height: 14, borderRadius: 7, background: color }} />
                <div
                  className={`card-${i}`}
                  style={{
                    position: "absolute",
                    left: X(it.year),
                    top,
                    width: CARD_W,
                    background: C.bg2,
                    borderTop: `4px solid ${color}`,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 ${60 * g}px ${hexA(color, 0.6 * g)}`,
                    transform: `scale(${1 + 0.06 * g})`,
                  }}
                >
                  <Img
                    src={staticFile(`img/${it.img}`)}
                    style={{ width: "100%", height: 196, objectFit: "cover", display: "block", filter: it.latest ? "contrast(1.08) saturate(0.85)" : "grayscale(0.85) contrast(1.15) sepia(0.2)" }}
                  />
                  <div style={{ padding: "10px 14px 12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 32, color: C.text, textTransform: "uppercase", letterSpacing: 1 }}>{it.name}</span>
                    <span style={{ fontFamily: FONT.mono, fontSize: 22, color }}>{it.year}</span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      {/* identificação das faixas */}
      <div style={{ position: "absolute", left: 110, top: 130 }}>
        <Tag text="Germany" color={C.de} />
      </div>
      <div style={{ position: "absolute", left: 110, bottom: 110 }}>
        <Tag text="USSR / Russia" color={C.ru} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Tela dividida: as máquinas de cada lado ----------
const SplitLines: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const leftClip = `polygon(0 0, ${56 * open}% 0, ${44 * open}% 100%, 0 100%)`;
  const rightClip = `polygon(${100 - 44 * open}% 0, 100% 0, 100% 100%, ${100 - 56 * open}% 100%)`;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ clipPath: leftClip }}>
        <Photo src="leo2a7_rail.jpg" dur={dur} grade="warm" darken={0.2} move={{ fromScale: 1.15, toScale: 1.05, fromX: -3, toX: 2 }} />
        <AbsoluteFill style={{ background: `linear-gradient(90deg, ${hexA(C.de, 0.18)}, transparent 60%)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: rightClip }}>
        <Photo src="t14_column.jpg" dur={dur} grade="cold" darken={0.2} move={{ fromScale: 1.05, toScale: 1.15, fromX: 3, toX: -2 }} />
        <AbsoluteFill style={{ background: `linear-gradient(270deg, ${hexA(C.ru, 0.18)}, transparent 60%)` }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={1920 * 0.56} y1={0} x2={1920 * 0.44} y2={1080} stroke={C.text} strokeWidth={3} opacity={open} />
      </svg>
      <div style={{ position: "absolute", left: 120, bottom: 110, opacity: open }}>
        <Tag text="Germany" color={C.de} />
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 110, opacity: open }}>
        <Tag text="Russia" color={C.ru} />
      </div>
    </AbsoluteFill>
  );
};

export const S2Legacy: React.FC = () => {
  const frame = useCurrentFrame();
  const mapZoom = interpolate(frame, [0, L(16.6)], [1.0, 1.1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Sequence durationInFrames={L(16.56) + 2} name="2a mapa">
        <Enter kind="zoom-out" frames={14}>
          <DarkStage left={C.de} right={C.ru} glow={0.1} />
          <AbsoluteFill style={{ transform: `scale(${mapZoom})` }}>
            <EuropeMap revealAt={0} highlightAt={L(14.15)} arcAt={L(15.2)} />
          </AbsoluteFill>
        </Enter>
      </Sequence>
      <Sequence from={L(16.56)} durationInFrames={L(24.1) - L(16.56) + 2} name="2b linha do tempo">
        <Enter kind="wipe-right" frames={12}>
          <DualTimeline />
        </Enter>
      </Sequence>
      <Sequence from={L(24.1)} durationInFrames={L(27.12) - L(24.1)} name="2c tela dividida">
        <SplitLines dur={L(27.12) - L(24.1)} />
      </Sequence>
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
