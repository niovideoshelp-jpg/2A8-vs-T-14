import React from "react";
import { useCurrentFrame } from "remotion";

// Bandeira com ondulação suave (faixas horizontais), desenhada em SVG
const WavingFlag: React.FC<{
  stripes: string[];
  width: number;
  height: number;
  amp?: number;
  style?: React.CSSProperties;
}> = ({ stripes, width, height, amp = 6, style }) => {
  const frame = useCurrentFrame();
  const cols = 24;
  const sh = height / stripes.length;
  const cw = width / cols;
  return (
    <svg width={width} height={height + amp * 2} style={{ overflow: "visible", ...style }}>
      {Array.from({ length: cols }).map((_, i) => {
        const ph = i / cols;
        const dy = Math.sin(ph * Math.PI * 2 - frame * 0.12) * amp * ph;
        const shade = 0.82 + 0.18 * Math.cos(ph * Math.PI * 2 - frame * 0.12);
        return (
          <g key={i} transform={`translate(${i * cw}, ${amp + dy})`} opacity={shade}>
            {stripes.map((c, s) => (
              <rect key={s} x={0} y={s * sh} width={cw + 0.8} height={sh + 0.5} fill={c} />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export const FlagDE: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 180, style }) => (
  <WavingFlag stripes={["#000000", "#DD0000", "#FFCE00"]} width={width} height={width * 0.6} style={style} />
);

export const FlagRU: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 180, style }) => (
  <WavingFlag stripes={["#FFFFFF", "#0039A6", "#D52B1E"]} width={width} height={width * (2 / 3)} style={style} />
);
