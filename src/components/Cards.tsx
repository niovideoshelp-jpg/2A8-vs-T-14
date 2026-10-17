import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../theme";

// Linhas abstratas no lugar de texto corrido (o objeto é reconhecível sem precisar ser lido)
const Lines: React.FC<{ widths: number[]; color: string; h?: number; gap?: number }> = ({ widths, color, h = 12, gap = 12 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {widths.map((w, i) => (
      <div key={i} style={{ width: `${w}%`, height: h, background: color, borderRadius: 2 }} />
    ))}
  </div>
);

// Folheto promocional ilustrativo do T-14 (somente o nome é legível)
export const Brochure: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      width: 640,
      height: 820,
      background: "#ECE7DD",
      color: "#14181B",
      boxShadow: "0 40px 90px rgba(0,0,0,0.65)",
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ height: 360, position: "relative" }}>
      <Img src={staticFile("img/t14_expo.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.15) contrast(1.05)" }} />
      <div style={{ position: "absolute", left: 0, top: 26, background: C.ru, color: "#fff", fontFamily: FONT.display, fontWeight: 700, fontSize: 38, padding: "6px 24px", letterSpacing: 2 }}>
        T-14 ARMATA
      </div>
    </div>
    <div style={{ padding: "34px 40px" }}>
      <Lines widths={[82, 64]} color="#1d2226" h={30} gap={14} />
      <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
        {[70, 58, 76, 52, 64].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 26, height: 26, background: C.ru, color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
            <div style={{ width: `${w}%`, height: 12, background: "#9a958c", borderRadius: 2 }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Cartão de fórum ilustrativo (sem marca nem texto real)
export const ForumCard: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ width: 660, background: "#12171B", border: `1px solid ${C.line}`, boxShadow: "0 40px 90px rgba(0,0,0,0.65)", ...style }}>
    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.line}` }}>
      <Lines widths={[78]} color="rgba(233,238,241,0.8)" h={22} />
    </div>
    {[
      [72, 48],
      [84, 36],
      [66, 54],
    ].map(([a, b], i) => (
      <div key={i} style={{ display: "flex", gap: 18, padding: "20px 24px", borderTop: i ? `1px solid ${C.line}` : undefined, alignItems: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 24, background: C.steel, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <Lines widths={[a, b]} color="rgba(233,238,241,0.35)" h={12} gap={10} />
        </div>
        <div style={{ fontFamily: FONT.display, fontSize: 34, color: C.ru, lineHeight: 1 }}>▲</div>
      </div>
    ))}
  </div>
);
