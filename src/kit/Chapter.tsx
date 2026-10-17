import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Flash, Grain, Vignette } from "../components/Atmosphere";
import { Enter } from "../components/Motion";
import { C, FPS } from "../theme";
import { ClockCtx, narrFrame } from "./context";
import { AirburstBeat, BarsBeat, BrandBeat, ChampionBeat, CtaBeat, HunterBeat, InterceptBeat, BlueprintBeat, CapsuleBeat, ChapterCard, DatesBeat, SourcesBeat, ListBeat, MapBeat, NumberBeat, PhotoBeat, SplitBeat, StageBeat, TankBeat, VersusBeat } from "./Beats";
import type { Beat, ChapterDef, Sfx } from "./types";

export const TAIL = 1.2; // segundos após a última fala
export const MASTER = 0.5; // folga de -6 dB (o volume final vem da masterização)

export const chapterOffset = (def: ChapterDef) => def.cardFor ?? 1.6;
export const chapterFrames = (def: ChapterDef) => Math.round((chapterOffset(def) + def.narrDur + TAIL) * FPS);

const renderBeat = (b: Beat) => {
  switch (b.kind) {
    case "photo":
      return <PhotoBeat b={b} />;
    case "tank":
      return <TankBeat b={b} />;
    case "versus":
      return <VersusBeat b={b} />;
    case "split":
      return <SplitBeat b={b} />;
    case "number":
      return <NumberBeat b={b} />;
    case "list":
      return <ListBeat b={b} />;
    case "blueprint":
      return <BlueprintBeat b={b} />;
    case "map":
      return <MapBeat b={b} />;
    case "bars":
      return <BarsBeat b={b} />;
    case "stage":
      return <StageBeat b={b} />;
    case "capsule":
      return <CapsuleBeat b={b} />;
    case "dates":
      return <DatesBeat b={b} />;
    case "sources":
      return <SourcesBeat />;
    case "airburst":
      return <AirburstBeat b={b} />;
    case "hunter":
      return <HunterBeat b={b} />;
    case "intercept":
      return <InterceptBeat b={b} />;
    case "champion":
      return <ChampionBeat />;
    case "cta":
      return <CtaBeat b={b} />;
    case "brand":
      return <BrandBeat b={b} />;
  }
};

const defaultEnter = (b: Beat, i: number) => {
  if (b.enter) return b.enter;
  if (b.kind === "photo") return i % 2 === 0 ? "whip-left" : "whip-right";
  if (b.kind === "map" || b.kind === "blueprint") return "wipe-right";
  return "zoom-in";
};

// Ganho de "respiro" da trilha: 0 durante a fala, sobe até 1 nas pausas longas
const makeBreath = (segments: [number, number][], end: number) => (t: number) => {
  if (t < 0 || t > end + 0.1) return 1;
  let prevEnd = 0;
  for (const [a, b] of segments) {
    if (t >= a - 0.12 && t <= b + 0.08) return 0;
    if (t < a) {
      const gap = a - prevEnd;
      if (gap < 0.55) return 0;
      const up = interpolate(t - prevEnd, [0.12, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const down = interpolate(a - t, [0.12, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return Math.min(up, down) * Math.min(1, (gap - 0.4) / 0.4);
    }
    prevEnd = b;
  }
  return interpolate(t - end, [0.05, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const WHOOSH = ["sfx/whoosh_1.mp3", "sfx/whoosh_2.mp3", "sfx/whoosh_3.mp3"];

export const Chapter: React.FC<{ def: ChapterDef }> = ({ def }) => {
  const frame = useCurrentFrame();
  const offset = chapterOffset(def);
  const total = chapterFrames(def);
  const N = (narr: number) => narrFrame(offset, narr);
  const breath = makeBreath(def.speech, def.narrDur);
  const starts = def.beats.map((b) => N(b.at));
  const firstStart = starts[0] ?? total;

  // efeitos: impacto na cartela, um whoosh discreto em cada corte e os extras do capítulo
  const sfx: Sfx[] = [
    ...(def.num ? [{ src: "sfx/boom_1.mp3", at: -offset + 0.03, volume: 0.5 }] : []),
    ...def.beats.slice(1).map((b, i) => ({ src: WHOOSH[i % 3], at: b.at - 0.08, volume: 0.2 })),
    ...(def.sfx ?? []),
  ];
  const fadeOut = interpolate(frame, [total - 12, total - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {def.num ? (
          <Sequence durationInFrames={firstStart + 2} name="cartela">
            <ChapterCard num={def.num} title={def.title} />
          </Sequence>
        ) : null}
        {def.beats.map((b, i) => {
          const from = starts[i];
          const to = i + 1 < starts.length ? starts[i + 1] + 2 : total;
          return (
            <Sequence key={`${b.kind}-${i}`} from={from} durationInFrames={Math.max(1, to - from)} name={`${i + 1} ${b.kind}`} premountFor={30}>
              <ClockCtx.Provider value={{ offset, beatStartFrame: from, beatDur: to - from }}>
                <Enter kind={defaultEnter(b, i)} frames={10}>
                  {renderBeat(b)}
                </Enter>
              </ClockCtx.Provider>
            </Sequence>
          );
        })}
        {def.num ? <Flash at={firstStart} length={7} peak={0.55} /> : null}
        <Vignette strength={0.55} />
        <Grain opacity={0.05} />
      </AbsoluteFill>

      {/* Narração */}
      <Sequence from={N(0)} name="narração">
        <Audio src={staticFile(def.narration)} volume={MASTER} />
      </Sequence>

      {/* Trilha com ducking guiado pelo mapa de fala */}
      <Audio
        src={staticFile(def.music.src)}
        trimBefore={Math.round((def.music.offset ?? 0) * FPS)}
        volume={(f) => {
          const t = f / FPS - offset;
          const level = 0.2 + (0.58 - 0.2) * breath(t);
          const fin = interpolate(f, [0, 12], [0.6, 1], { extrapolateRight: "clamp" });
          const fo = interpolate(f, [total - 45, total - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return MASTER * level * fin * fo;
        }}
      />

      {sfx.map((s, i) => {
        const at = N(s.at);
        if (at < 0 || at >= total) return null;
        return (
          <Sequence key={`${s.src}-${i}`} from={at} durationInFrames={Math.min(total - at, 8 * FPS)} name={s.src}>
            <Audio src={staticFile(s.src)} volume={(f) => MASTER * s.volume * (0.7 + 0.3 * breath((at + f) / FPS - offset))} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
