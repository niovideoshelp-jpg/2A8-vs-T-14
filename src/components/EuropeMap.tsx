import React, { useMemo } from "react";
import { geoConicConformal, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { hexA } from "./Atmosphere";
import { LottieAsset } from "./LottieAsset";

const DE = "276";
const RU = "643";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const countries = (feature(topo, topo.objects.countries) as FeatureCollection<Geometry>).features;

// Mapa da Europa: países em linha fina, Alemanha e Rússia destacadas, arco Berlim ↔ Moscou
export const EuropeMap: React.FC<{
  width?: number;
  height?: number;
  revealAt?: number;
  highlightAt?: number;
  arcAt?: number;
}> = ({ width = 1920, height = 1080, revealAt = 0, highlightAt = 20, arcAt = 45 }) => {
  const frame = useCurrentFrame();

  const { paths, berlin, moscow } = useMemo(() => {
    const projection = geoConicConformal()
      .parallels([45, 62])
      .rotate([-28, 0])
      .center([0, 54])
      .scale(2050)
      .translate([width / 2, height / 2]);
    const path = geoPath(projection);
    const ps = countries
      .map((f: Feature<Geometry>) => ({ id: String(f.id), d: path(f) ?? "" }))
      .filter((p) => p.d.length > 0);
    return {
      paths: ps,
      berlin: projection([13.405, 52.52]) as [number, number],
      moscow: projection([37.6173, 55.7558]) as [number, number],
    };
  }, [width, height]);

  const reveal = interpolate(frame, [revealAt, revealAt + 30], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const hl = interpolate(frame, [highlightAt, highlightAt + 18], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const arc = interpolate(frame, [arcAt, arcAt + 40], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });

  const mx = (berlin[0] + moscow[0]) / 2;
  const my = Math.min(berlin[1], moscow[1]) - 170;
  const arcD = `M ${berlin[0]} ${berlin[1]} Q ${mx} ${my} ${moscow[0]} ${moscow[1]}`;
  const arcLen = 1200;

  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g opacity={reveal}>
          {paths.map((p) => {
            const isDe = p.id === DE;
            const isRu = p.id === RU;
            const accent = isDe ? C.de : isRu ? C.ru : null;
            return (
              <path
                key={p.id + p.d.length}
                d={p.d}
                fill={accent ? hexA(accent, 0.12 + 0.38 * hl) : "rgba(233,238,241,0.035)"}
                stroke={accent ? hexA(accent, 0.35 + 0.65 * hl) : "rgba(233,238,241,0.22)"}
                strokeWidth={accent ? 1.4 + 1.4 * hl : 0.8}
                filter={accent && hl > 0.5 ? "url(#glow)" : undefined}
              />
            );
          })}
        </g>
        <path
          d={arcD}
          fill="none"
          stroke={C.text}
          strokeWidth={3}
          strokeDasharray={`${arcLen}`}
          strokeDashoffset={arcLen * (1 - arc)}
          opacity={0.9}
        />
        <path d={arcD} fill="none" stroke={C.text} strokeWidth={1} strokeDasharray="6 10" opacity={0.35 * arc} />
      </svg>
      {[
        { p: berlin, name: "BERLIN", color: C.de, lottie: "pulse-gold", side: -1 },
        { p: moscow, name: "MOSCOW", color: C.ru, lottie: "pulse-red", side: 1 },
      ].map(({ p, name, color, lottie, side }) => (
        <React.Fragment key={name}>
          <div style={{ position: "absolute", left: p[0] - 90, top: p[1] - 90, width: 180, height: 180, opacity: hl }}>
            <LottieAsset name={lottie} loop />
          </div>
          <div
            style={{
              position: "absolute",
              left: side < 0 ? p[0] - 260 : p[0] + 40,
              width: 220,
              textAlign: side < 0 ? "right" : "left",
              top: p[1] + 18,
              fontFamily: FONT.mono,
              fontSize: 24,
              letterSpacing: 4,
              color,
              opacity: hl,
            }}
          >
            {name}
          </div>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
