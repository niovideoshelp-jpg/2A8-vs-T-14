import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";
import speech from "../data/speech.json";
import { FPS } from "../theme";
import { MUSIC, N, NARR_OFFSET, SFX, TOTAL_FRAMES } from "../timeline";

const SEGMENTS = speech as [number, number][];

// Ganho geral (-6 dB): deixa folga para os impactos somados à voz — o volume final vem da masterização
const MASTER = 0.5;
const NARR_END = SEGMENTS[SEGMENTS.length - 1][1];

// Ganho de "respiro" da trilha: 0 durante a fala, sobe até 1 nas pausas longas
const breath = (tNarr: number) => {
  if (tNarr < 0 || tNarr > NARR_END + 0.1) return 1;
  let prevEnd = 0;
  for (const [a, b] of SEGMENTS) {
    if (tNarr >= a - 0.12 && tNarr <= b + 0.08) return 0;
    if (tNarr < a) {
      const gap = a - prevEnd;
      if (gap < 0.55) return 0;
      const dIn = tNarr - prevEnd; // desde o fim da fala anterior
      const dOut = a - tNarr; // até a próxima fala
      const up = interpolate(dIn, [0.12, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const down = interpolate(dOut, [0.12, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return Math.min(up, down) * Math.min(1, (gap - 0.4) / 0.4);
    }
    prevEnd = b;
  }
  return interpolate(tNarr - NARR_END, [0.05, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const MusicCue: React.FC<{
  cue: (typeof MUSIC)[keyof typeof MUSIC];
  under: number;
  open: number;
  fadeIn?: number;
}> = ({ cue, under, open, fadeIn = 0 }) => {
  const duration = cue.to - cue.from;
  return (
    <Sequence from={cue.from} durationInFrames={duration} name={cue.src}>
      <Audio
        src={staticFile(cue.src)}
        volume={(f) => {
          const abs = cue.from + f;
          const tNarr = abs / FPS - NARR_OFFSET;
          const level = under + (open - under) * breath(tNarr);
          const fadeOut = interpolate(f, [duration - cue.fadeOutFrames, duration], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const fi = fadeIn > 0 ? interpolate(f, [0, fadeIn], [0, 1], { extrapolateRight: "clamp" }) : 1;
          return MASTER * level * fadeOut * fi;
        }}
      />
    </Sequence>
  );
};

const Ambience: React.FC<{ from: number; to: number; volume: number }> = ({ from, to, volume }) => (
  <Sequence from={from} durationInFrames={to - from} name="ambience">
    <Audio
      src={staticFile("sfx/ambience.mp3")}
      loop
      volume={(f) =>
        MASTER *
        volume *
        interpolate(f, [0, 20, to - from - 25, to - from], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  </Sequence>
);

// --props='{"stem":"voice"}' ou '{"stem":"bed"}' renderiza só a voz ou só trilha+efeitos (conferência da mixagem)
export const Soundtrack: React.FC<{ stem?: "voice" | "bed" | "all" }> = ({ stem = "all" }) => (
  <>
    {/* Narração (normalizada a -16 LUFS), entra após 1 s */}
    {stem !== "bed" ? (
      <Sequence from={N(0)} name="narração">
        <Audio src={staticFile("audio/narracao.mp3")} volume={MASTER} />
      </Sequence>
    ) : null}

    {stem !== "voice" ? (
      <>
        {/* Trilha com ducking automático guiado pelo mapa de fala */}
        <MusicCue cue={MUSIC.a} under={0.2} open={0.62} />
        <MusicCue cue={MUSIC.b} under={0.15} open={0.5} />
        <MusicCue cue={MUSIC.c} under={0.2} open={0.62} fadeIn={6} />

        {/* Ambiência de campo de batalha */}
        <Ambience from={0} to={N(14.2)} volume={0.14} />
        <Ambience from={N(27.0)} to={N(32.7)} volume={0.12} />
        <Ambience from={N(70.2)} to={N(74.4)} volume={0.2} />

        {/* Efeitos também abaixam ~3 dB enquanto há fala, para nunca cobrir a narração */}
        {SFX.map((s, i) => (
          <Sequence key={`${s.src}-${i}`} from={s.at} durationInFrames={Math.min(TOTAL_FRAMES - s.at, 10 * FPS)} name={s.src}>
            <Audio
              src={staticFile(s.src)}
              volume={(f) => MASTER * s.volume * (0.7 + 0.3 * breath((s.at + f) / FPS - NARR_OFFSET))}
            />
          </Sequence>
        ))}
      </>
    ) : null}
  </>
);
