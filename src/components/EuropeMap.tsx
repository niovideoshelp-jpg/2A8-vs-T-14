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

// Mapa da Europa: países em linha fina, Alemanha e Rússia destacadas, capitais marcadas
export const EuropeMap: React.FC<{
  width?: number;
  height?: number;
  revealAt?: number;
  deAt?: number;
  ruAt?: number;
}> = ({ width = 1920, height = 1080, revealAt = 0, deAt = 20, ruAt = 30 }) => {
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
  const hlDe = interpolate(frame, [deAt, deAt + 14], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const hlRu = interpolate(frame, [ruAt, ruAt + 14], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });

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
            const hl = isDe ? hlDe : isRu ? hlRu : 0;
            return (
              <path
                key={p.id + p.d.length}
                d={p.d}
                fill={accent ? hexA(accent, 0.1 + 0.45 * hl) : "rgba(233,238,241,0.035)"}
                stroke={accent ? hexA(accent, 0.3 + 0.7 * hl) : "rgba(233,238,241,0.22)"}
                strokeWidth={accent ? 1.4 + 1.6 * hl : 0.8}
                filter={accent && hl > 0.5 ? "url(#glow)" : undefined}
              />
            );
          })}
        </g>
      </svg>
      {[
        { p: berlin, name: "Berlin", color: C.de, lottie: "pulse-gold", k: hlDe, dx: -40, align: "right" as const },
        { p: moscow, name: "Moscow", color: C.ru, lottie: "pulse-red", k: hlRu, dx: 40, align: "left" as const },
      ].map(({ p, name, color, lottie, k, dx, align }) => (
        <React.Fragment key={name}>
          <div style={{ position: "absolute", left: p[0] - 90, top: p[1] - 90, width: 180, height: 180, opacity: k }}>
            <LottieAsset name={lottie} loop />
          </div>
          <div
            style={{
              position: "absolute",
              top: p[1] - 40,
              left: align === "left" ? p[0] + dx : undefined,
              right: align === "right" ? width - p[0] - dx : undefined,
              fontFamily: FONT.display,
              fontWeight: 700,
              fontSize: 64,
              lineHeight: 1.2,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#fff",
              textShadow: `0 0 24px ${hexA(color, 0.9)}, 0 4px 18px rgba(0,0,0,0.9)`,
              opacity: k,
              transform: `translateY(${(1 - k) * 14}px)`,
            }}
          >
            {name}
          </div>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
