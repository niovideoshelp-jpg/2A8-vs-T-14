import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Soundtrack } from "./audio/Soundtrack";
import { Vignette } from "./components/Atmosphere";
import { S1ColdOpen } from "./scenes/S1ColdOpen";
import { S2Legacy } from "./scenes/S2Legacy";
import { S3Philosophies } from "./scenes/S3Philosophies";
import { S4Leopard } from "./scenes/S4Leopard";
import { S5Armata } from "./scenes/S5Armata";
import { S6Hype } from "./scenes/S6Hype";
import { S7Reality } from "./scenes/S7Reality";
import { S8Method } from "./scenes/S8Method";
import { S9Outro } from "./scenes/S9Outro";
import { C } from "./theme";
import { SCENES } from "./timeline";

const scene = (key: keyof typeof SCENES, El: React.FC) => {
  const { from, to } = SCENES[key];
  return (
    <Sequence key={key} from={from} durationInFrames={to - from} name={key} premountFor={30}>
      <El />
    </Sequence>
  );
};

export type IntroProps = { stem?: "voice" | "bed" | "all" };

export const Intro: React.FC<IntroProps> = ({ stem = "all" }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    {scene("open", S1ColdOpen)}
    {scene("legacy", S2Legacy)}
    {scene("philosophies", S3Philosophies)}
    {scene("leopard", S4Leopard)}
    {scene("armata", S5Armata)}
    {scene("hype", S6Hype)}
    {scene("reality", S7Reality)}
    {scene("method", S8Method)}
    {scene("outro", S9Outro)}
    <Vignette strength={0.55} />
    <Soundtrack stem={stem} />
  </AbsoluteFill>
);
