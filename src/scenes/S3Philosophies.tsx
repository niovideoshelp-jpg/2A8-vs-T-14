import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Flash, Grain } from "../components/Atmosphere";
import { FlagDE, FlagRU } from "../components/Flags";
import { Tag } from "../components/Type";
import { C } from "../theme";
import { N, SCENES } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S0 = SCENES.philosophies.from;
const L = (t: number) => N(t) - S0;
const E = Easing.bezier(0.16, 1, 0.3, 1);

// Silhueta com luz de contorno na cor do país
const Silhouette: React.FC<{ src: string; color: string; width: number }> = ({ src, color, width }) => (
  <Img
    src={staticFile(`img/${src}`)}
    style={{
      width,
      filter: `brightness(0.09) contrast(1.3) drop-shadow(0 0 1.5px ${color}) drop-shadow(0 0 22px ${color})`,
    }}
  />
);

// "Two completely opposite philosophies of war going head to head"
export const S3Philosophies: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = SCENES.philosophies.to - S0;
  const lights = interpolate(frame, [0, L(28.4)], [0, 1], { ...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1) });
  // entrada lenta pelas laterais durante "two completely opposite philosophies"
  const approach = interpolate(frame, [L(28.3), L(31.2)], [0, 1], { ...clamp, easing: E });
  // "head to head": avanço final e corte
  const clash = interpolate(frame, [L(31.25), L(31.9)], [0, 1], { ...clamp, easing: Easing.bezier(0.7, 0, 0.84, 0) });
  const ids = interpolate(frame, [L(31.3), L(31.7)], [0, 1], { ...clamp, easing: E });
  const leftX = -900 + 820 * approach + 90 * clash;
  const rightX = 1920 - 960 * approach - 90 * clash;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ opacity: lights }}>
        <DarkStage left={C.de} right={C.ru} glow={0.12 + 0.2 * approach} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: leftX, top: 470 }}>
        <Silhouette src="leo2a8_cut.webp" color="rgba(242,182,48,0.85)" width={860} />
      </div>
      <div style={{ position: "absolute", left: rightX, top: 490 }}>
        <Silhouette src="t14_cut.webp" color="rgba(226,54,43,0.85)" width={860} />
      </div>
      {/* identificação: bandeiras e países */}
      <div style={{ position: "absolute", left: 420 - 200, width: 400, top: 200, opacity: ids, transform: `translateY(${(1 - ids) * 20}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <FlagDE width={170} />
        <Tag text="Germany" color={C.de} size={64} />
      </div>
      <div style={{ position: "absolute", left: 1500 - 200, width: 400, top: 200, opacity: ids, transform: `translateY(${(1 - ids) * 20}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <FlagRU width={170} />
        <Tag text="Russia" color={C.ru} size={64} />
      </div>
      <Flash at={dur - 3} length={6} peak={0.9} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
