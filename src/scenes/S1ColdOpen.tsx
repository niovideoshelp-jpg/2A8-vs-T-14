import React from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Flash, Grain, Letterbox } from "../components/Atmosphere";
import { LottieAsset } from "../components/LottieAsset";
import { Enter, shakeAt } from "../components/Motion";
import { Photo } from "../components/Photo";
import { C, FONT } from "../theme";
import { N } from "../timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// "Triângulo de ferro": firepower, protection e mobility reunidos em um único veículo
const IronTriangle: React.FC = () => {
  const frame = useCurrentFrame();
  const t0 = N(7.0);
  const at = (n: number) => (N(n) - t0) / 30;
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .fromTo(selector(".edge"), { strokeDashoffset: 760 }, { strokeDashoffset: 0, duration: 0.9, ease: "power3.inOut", stagger: 0.12 }, 0.05)
      .from(selector(".v0"), { scale: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(3)" }, at(7.7))
      .from(selector(".l0"), { y: 30, opacity: 0, duration: 0.5, ease: "expo.out" }, at(7.7))
      .from(selector(".v1"), { scale: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(3)" }, at(8.4))
      .from(selector(".l1"), { x: -30, opacity: 0, duration: 0.5, ease: "expo.out" }, at(8.4))
      .from(selector(".v2"), { scale: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "back.out(3)" }, at(9.4))
      .from(selector(".l2"), { x: 30, opacity: 0, duration: 0.5, ease: "expo.out" }, at(9.4))
      .from(selector(".tank"), { scale: 0.4, opacity: 0, y: 40, duration: 0.8, ease: "expo.out" }, at(10.3))
      .to(selector(".tri"), { scale: 1.08, duration: 3.5, ease: "none" }, 0.4);
  });
  const fillPulse = interpolate(frame, [N(10.3) - t0, N(10.3) - t0 + 20], [0, 1], clamp);
  const P = [
    [960, 250],
    [610, 820],
    [1310, 820],
  ];
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.12} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        <div className="tri" style={{ position: "absolute", inset: 0 }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <polygon points={P.map((p) => p.join(",")).join(" ")} fill={`rgba(242,182,48,${0.07 * fillPulse})`} stroke="none" />
            {[0, 1, 2].map((i) => {
              const a = P[i];
              const b = P[(i + 1) % 3];
              return <line key={i} className="edge" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.text} strokeWidth={3} strokeDasharray={760} />;
            })}
            {P.map((p, i) => (
              <g key={i} className={`v${i}`}>
                <circle cx={p[0]} cy={p[1]} r={22} fill={C.bg} stroke={C.de} strokeWidth={4} />
                <circle cx={p[0]} cy={p[1]} r={8} fill={C.de} />
              </g>
            ))}
          </svg>
          <div className="l0" style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center" }}>
            <Label text="Firepower" />
          </div>
          <div className="l1" style={{ position: "absolute", top: 860, left: 330, width: 560, textAlign: "center" }}>
            <Label text="Protection" />
          </div>
          <div className="l2" style={{ position: "absolute", top: 860, left: 1030, width: 560, textAlign: "center" }}>
            <Label text="Mobility" />
          </div>
          <div className="tank" style={{ position: "absolute", left: 960 - 200, top: 520, width: 400 }}>
            <Img
              src={staticFile("img/leo2a8_cut.webp")}
              style={{ width: "100%", filter: "brightness(0.12) contrast(1.4) drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 18px rgba(242,182,48,0.55))" }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string }> = ({ text }) => (
  <span style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 64, letterSpacing: 3, textTransform: "uppercase", color: C.text }}>{text}</span>
);

export const S1ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  // barras de cinema nos planos fotográficos iniciais; recolhem para o gráfico
  const lb = interpolate(frame, [0, 18, N(6.9), N(7.2)], [1.6, 1, 1, 0], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const openFade = interpolate(frame, [0, 20], [0, 1], clamp);
  const cannon = N(6.86);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 1a — tanque abrindo caminho */}
      <Sequence durationInFrames={N(3.45) + 2} name="1a leopard avançando">
        <AbsoluteFill style={{ opacity: openFade }}>
          <Photo src="leo2_move.jpg" dur={N(3.45)} grade="cold" darken={0.2} move={{ fromScale: 1.18, toScale: 1.06, fromX: 2, toX: -1 }} />
        </AbsoluteFill>
      </Sequence>

      {/* 1b — enfrentar outros blindados: retícula trava no alvo, disparo */}
      <Sequence from={N(3.45)} durationInFrames={N(7.0) - N(3.45) + 2} name="1b disparo">
        <Enter kind="whip-left" frames={9}>
          <AbsoluteFill style={{ transform: shakeAt(frame, [{ at: cannon, dur: 16, amp: 22 }]) }}>
            <Photo src="leo2_firing.jpg" dur={N(7.0) - N(3.45)} grade="cold" darken={0.15} position="50% 60%" move={{ fromScale: 1.12, toScale: 1.28, fromX: -2, toX: -5, fromY: 1, toY: 2 }} />
          </AbsoluteFill>
          <Sequence from={N(5.0) - N(3.45)} layout="none">
            <div style={{ position: "absolute", left: 1088 - 210, top: 520 - 210, width: 420, height: 420, opacity: 0.9 }}>
              <LottieAsset name="reticle-white" />
            </div>
          </Sequence>
        </Enter>
      </Sequence>
      <Flash at={cannon} length={9} color="#FFE2A8" peak={0.7} />

      {/* 1c — firepower, protection, mobility */}
      <Sequence from={N(7.0)} durationInFrames={N(11.3) - N(7.0) + 2} name="1c triângulo">
        <Enter kind="zoom-in" frames={12}>
          <IronTriangle />
        </Enter>
      </Sequence>

      {/* 1d — apoiando os soldados que avançam a pé */}
      <Sequence from={N(11.3)} durationInFrames={N(14.0) - N(11.3)} name="1d soldados">
        <Enter kind="whip-right" frames={9}>
          <Photo src="leo2_soldier.jpg" dur={N(14.0) - N(11.3)} grade="cold" darken={0.15} position="50% 40%" move={{ fromScale: 1.08, toScale: 1.24 }} />
        </Enter>
      </Sequence>

      <Letterbox amount={lb} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
