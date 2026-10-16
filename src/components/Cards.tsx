import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "../theme";

// Folheto promocional (ilustrativo) com as promessas do T-14
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
    <div style={{ height: 300, position: "relative" }}>
      <Img src={staticFile("img/t14_expo.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.15) contrast(1.05)" }} />
      <div style={{ position: "absolute", left: 0, top: 26, background: C.ru, color: "#fff", fontFamily: FONT.display, fontWeight: 700, fontSize: 34, padding: "6px 22px", letterSpacing: 2 }}>
        T-14 ARMATA
      </div>
    </div>
    <div style={{ padding: "26px 38px" }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 16, color: "#7A776F", letterSpacing: 3 }}>FOLHETO PROMOCIONAL</div>
      <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 64, lineHeight: 1.02, textTransform: "uppercase", marginTop: 6 }}>
        O tanque
        <br />
        do futuro
      </div>
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
        {["Torre não tripulada", "Cápsula blindada", "Proteção ativa Afganit", "Radares AESA", "Canhão de 125 mm"].map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: FONT.label, fontWeight: 600, fontSize: 30 }}>
            <span style={{ width: 26, height: 26, background: C.ru, color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
            {t}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Cartão de fórum (ilustrativo, sem marca real)
export const ForumCard: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const posts = [
    { u: "tanker_88", t: "T-14 é simplesmente imbatível.", v: "2,4 mil" },
    { u: "blindado_br", t: "Nenhum tanque ocidental chega perto.", v: "1,8 mil" },
    { u: "steel_rain", t: "Leopard? Projeto dos anos 70...", v: "1,1 mil" },
  ];
  return (
    <div style={{ width: 660, background: "#12171B", border: `1px solid ${C.line}`, boxShadow: "0 40px 90px rgba(0,0,0,0.65)", ...style }}>
      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.line}`, fontFamily: FONT.mono, fontSize: 16, letterSpacing: 3, color: C.muted }}>
        FÓRUM · JOGOS DE GUERRA
      </div>
      <div style={{ padding: "18px 24px 6px", fontFamily: FONT.label, fontWeight: 700, fontSize: 34, color: C.text }}>
        T-14 x Leopard 2A8: alguém ainda duvida?
      </div>
      {posts.map((p) => (
        <div key={p.u} style={{ display: "flex", gap: 16, padding: "16px 24px", borderTop: `1px solid ${C.line}`, alignItems: "center" }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: C.steel, color: C.muted, fontFamily: FONT.mono, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {p.u.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 16, color: C.muted }}>@{p.u}</div>
            <div style={{ fontFamily: FONT.label, fontWeight: 600, fontSize: 28, color: C.text }}>{p.t}</div>
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 20, color: C.ru }}>▲ {p.v}</div>
        </div>
      ))}
    </div>
  );
};
