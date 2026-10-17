import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DarkStage, Grain, hexA } from "../components/Atmosphere";
import { EuropeMap } from "../components/EuropeMap";
import { FlagDE, FlagRU } from "../components/Flags";
import { Enter } from "../components/Motion";
import { Photo } from "../components/Photo";
import { Tag } from "../components/Type";
import { C, FONT } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.legacy.from;
const L = (t: number) => N(t) - S0;

// ---------- Linha do tempo dupla (Alemanha em cima, URSS/Rússia embaixo) ----------
const X = (year: number) => 300 + (year - 1940) * 38;
const CARD_W = 440;
const CARD_H = 360;
const AXIS_Y = 540;
const GAP_DE = 80; // distância cartão (acima) → eixo
const GAP_RU = 100; // eixo → cartão (abaixo); abriga a escala de anos
const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030];
// no fim do movimento: T-90, T-14 e 2A8 inteiros; Leopard 2 já fora do quadro
const PAN_END = -2236;

type Item = {
  year: number;
  name: string;
  img: string;
  side: "de" | "ru";
  pop: number;
  latest?: boolean;
};
const ITEMS: Item[] = [
  { year: 1940, name: "T-34", img: "hist_t34.jpg", side: "ru", pop: 16.9 },
  {
    year: 1965,
    name: "Leopard 1",
    img: "hist_leo1.jpg",
    side: "de",
    pop: 17.9,
  },
  { year: 1973, name: "T-72", img: "hist_t72.jpg", side: "ru", pop: 18.6 },
  {
    year: 1979,
    name: "Leopard 2",
    img: "hist_leo2a4.jpg",
    side: "de",
    pop: 19.3,
  },
  { year: 1992, name: "T-90", img: "hist_t90.jpg", side: "ru", pop: 20.3 },
  {
    year: 2015,
    name: "T-14",
    img: "t14_street.jpg",
    side: "ru",
    pop: 21.3,
    latest: true,
  },
  {
    year: 2023,
    name: "2A8",
    img: "leo2a8_expo.jpg",
    side: "de",
    pop: 22.1,
    latest: true,
  },
];

const DualTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(16.56);
  const sec = (narr: number) => (N(narr) - t0) / 30;
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline.fromTo(
      selector(".world"),
      { x: 0 },
      { x: PAN_END, duration: sec(22.6) - sec(16.75), ease: "power1.inOut" },
      sec(16.75),
    );
    timeline.fromTo(
      selector(".axis"),
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: "expo.out" },
      0,
    );
    ITEMS.forEach((it, i) => {
      timeline.from(
        selector(`.card-${i}`),
        {
          opacity: 0,
          y: it.side === "de" ? -60 : 60,
          scale: 0.85,
          duration: 0.6,
          ease: "expo.out",
        },
        sec(it.pop),
      );
      timeline.from(
        selector(`.stem-${i}`),
        { scaleY: 0, duration: 0.4, ease: "power3.out" },
        sec(it.pop),
      );
      timeline.from(
        selector(`.dot-${i}`),
        { scale: 0, duration: 0.35, ease: "back.out(3)" },
        sec(it.pop),
      );
    });
    timeline.from(selector(".scale"), { opacity: 0, duration: 0.6 }, 0.3);
  });
  // "each in its own way": os dois modelos atuais ganham destaque
  const glow = interpolate(frame, [N(22.9) - t0, N(23.4) - t0], [0, 1], clamp);
  const flags = interpolate(frame, [4, 18], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.14} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div
          className="world"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 4200,
            height: 1080,
          }}
        >
          <div
            className="axis"
            style={{
              position: "absolute",
              left: 0,
              top: AXIS_Y - 1,
              width: 4200,
              height: 3,
              background: C.text,
              opacity: 0.6,
              transformOrigin: "left center",
            }}
          />
          {/* escala de anos (décadas) */}
          {DECADES.map((y) => (
            <div
              key={y}
              className="scale"
              style={{
                position: "absolute",
                left: X(y) - 80,
                top: AXIS_Y - 9,
                width: 160,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: 3, height: 18, background: C.muted }} />
              <div
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 600,
                  fontSize: 52,
                  lineHeight: 1.15,
                  color: C.muted,
                  marginTop: 4,
                }}
              >
                {y}
              </div>
            </div>
          ))}
          {ITEMS.map((it, i) => {
            const color = it.side === "de" ? C.de : C.ru;
            const g = it.latest ? glow : 0;
            return (
              <React.Fragment key={it.name}>
                {/* conector cartão ↔ eixo e marcador do ano exato */}
                <div
                  className={`stem-${i}`}
                  style={{
                    position: "absolute",
                    left: X(it.year) - 1.5,
                    top: it.side === "de" ? AXIS_Y - GAP_DE : AXIS_Y,
                    width: 3,
                    height: it.side === "de" ? GAP_DE : GAP_RU,
                    background: color,
                    transformOrigin: it.side === "de" ? "bottom" : "top",
                  }}
                />
                <div
                  className={`dot-${i}`}
                  style={{
                    position: "absolute",
                    left: X(it.year) - 10,
                    top: AXIS_Y - 10,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    background: color,
                    boxShadow: `0 0 16px ${hexA(color, 0.8)}`,
                  }}
                />
                <div
                  className={`card-${i}`}
                  style={{
                    position: "absolute",
                    left: X(it.year),
                    top:
                      it.side === "de"
                        ? AXIS_Y - GAP_DE - CARD_H
                        : AXIS_Y + GAP_RU,
                    width: CARD_W,
                    height: CARD_H,
                    background: C.bg2,
                    boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 0 ${3 + 3 * g}px ${hexA(color, 0.55 + 0.45 * g)}, 0 0 ${60 * g}px ${hexA(color, 0.6 * g)}`,
                    transform: `scale(${1 + 0.05 * g})`,
                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={staticFile(`img/${it.img}`)}
                    style={{
                      width: "100%",
                      height: CARD_H - 110,
                      objectFit: "cover",
                      display: "block",
                      filter: it.latest
                        ? "contrast(1.08) saturate(0.85)"
                        : "grayscale(0.85) contrast(1.15) sepia(0.2)",
                    }}
                  />
                  <div
                    style={{
                      height: 110,
                      padding: "0 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT.display,
                        fontWeight: 700,
                        fontSize: 56,
                        color: C.text,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {it.name}
                    </span>
                    <span
                      style={{
                        fontFamily: FONT.display,
                        fontWeight: 700,
                        fontSize: 56,
                        color,
                      }}
                    >
                      {it.year}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          {/* bandeiras identificam as faixas e rolam junto com a linha do tempo */}
          <div
            style={{
              position: "absolute",
              left: 80,
              top: AXIS_Y - GAP_DE - CARD_H,
              opacity: flags,
              transform: `translateX(${(1 - flags) * -40}px)`,
            }}
          >
            <FlagDE width={150} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 80,
              top: AXIS_Y + GAP_RU,
              opacity: flags,
              transform: `translateX(${(1 - flags) * -40}px)`,
            }}
          >
            <FlagRU width={150} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Tela dividida: as máquinas de cada lado ----------
const SplitLines: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 14], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const leftClip = `polygon(0 0, ${56 * open}% 0, ${44 * open}% 100%, 0 100%)`;
  const rightClip = `polygon(${100 - 44 * open}% 0, 100% 0, 100% 100%, ${100 - 56 * open}% 100%)`;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ clipPath: leftClip }}>
        <Photo
          src="leo2a7_rail.jpg"
          dur={dur}
          grade="warm"
          darken={0.2}
          move={{ fromScale: 1.15, toScale: 1.05, fromX: -3, toX: 2 }}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(0deg, rgba(7,9,11,0.75) 0%, transparent 40%)`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: rightClip }}>
        <Photo
          src="t14_column.jpg"
          dur={dur}
          grade="cold"
          darken={0.2}
          move={{ fromScale: 1.05, toScale: 1.15, fromX: 3, toX: -2 }}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(0deg, rgba(7,9,11,0.75) 0%, transparent 40%)`,
          }}
        />
      </AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
      >
        <line
          x1={1920 * 0.56}
          y1={0}
          x2={1920 * 0.44}
          y2={1080}
          stroke={C.text}
          strokeWidth={4}
          opacity={open}
        />
      </svg>
      <div
        style={{ position: "absolute", left: 110, bottom: 90, opacity: open }}
      >
        <Tag text="Germany" color={C.de} size={72} />
      </div>
      <div
        style={{ position: "absolute", right: 110, bottom: 90, opacity: open }}
      >
        <Tag text="Russia" color={C.ru} size={72} />
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
            <EuropeMap revealAt={0} deAt={L(14.1)} ruAt={L(14.6)} />
          </AbsoluteFill>
        </Enter>
      </Sequence>
      <Sequence
        from={L(16.56)}
        durationInFrames={L(24.1) - L(16.56) + 2}
        name="2b linha do tempo"
      >
        <Enter kind="wipe-right" frames={12}>
          <DualTimeline />
        </Enter>
      </Sequence>
      <Sequence
        from={L(24.1)}
        durationInFrames={L(27.12) - L(24.1)}
        name="2c tela dividida"
      >
        <SplitLines dur={L(27.12) - L(24.1)} />
      </Sequence>
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
