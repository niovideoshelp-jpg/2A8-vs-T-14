import React, { useMemo } from "react";
import { useGsapTimeline } from "@remotion/gsap";
import { geoConicConformal, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { DarkStage, Letterbox, hexA } from "../components/Atmosphere";
import { FlagDE, FlagRU } from "../components/Flags";
import { Callout } from "../components/Hud";
import { LottieAsset } from "../components/LottieAsset";
import { handheld } from "../components/Motion";
import { Cutout, Photo } from "../components/Photo";
import { KineticTitle, Tag } from "../components/Type";
import { C, FONT, MIN_TEXT } from "../theme";
import { useBeatClock } from "./context";
import type { Beat, Side, TankId } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.16, 1, 0.3, 1);

export const TANKS: Record<TankId, { src: string; ratio: number; side: Side; name: [string, string] }> = {
  leo: { src: "leo2a8_cut.webp", ratio: 1193 / 2400, side: "de", name: ["Leopard", "2A8"] },
  t14: { src: "t14_cut.webp", ratio: 1098 / 2400, side: "ru", name: ["T-14", "Armata"] },
};
const sideColor = (s: Side) => (s === "de" ? C.de : C.ru);

// Texto grosso padrão (Oswald 700, nunca abaixo do mínimo)
const Big: React.FC<{ size: number; color?: string; style?: React.CSSProperties; children: React.ReactNode; className?: string }> = ({
  size,
  color = C.text,
  style,
  children,
  className,
}) => (
  <span
    className={className}
    style={{
      fontFamily: FONT.display,
      fontWeight: 700,
      fontSize: Math.max(MIN_TEXT, size),
      lineHeight: 1,
      color,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
      textShadow: "0 6px 30px rgba(0,0,0,0.7)",
      ...style,
    }}
  >
    {children}
  </span>
);

// ---------- Cartela de abertura do capítulo ----------
export const ChapterCard: React.FC<{ num: string; title: string }> = ({ num, title }) => {
  const frame = useCurrentFrame();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".num"), { scale: 1.6, opacity: 0, filter: "blur(18px)", duration: 0.6, ease: "expo.out" }, 0.05)
      .from(selector(".sil-l"), { x: -260, opacity: 0, duration: 1.4, ease: "expo.out" }, 0)
      .from(selector(".sil-r"), { x: 260, opacity: 0, duration: 1.4, ease: "expo.out" }, 0);
  });
  const push = interpolate(frame, [0, 90], [1, 1.06]);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.2} />
      <div ref={ref} style={{ position: "absolute", inset: 0, transform: `scale(${push})` }}>
        <Img
          className="sil-l"
          src={staticFile(`img/${TANKS.leo.src}`)}
          style={{ position: "absolute", left: -40, bottom: 40, width: 820, opacity: 0.55, filter: "brightness(0.1) drop-shadow(0 0 2px rgba(242,182,48,0.9)) drop-shadow(0 0 20px rgba(242,182,48,0.6))" }}
        />
        <Img
          className="sil-r"
          src={staticFile(`img/${TANKS.t14.src}`)}
          style={{ position: "absolute", right: -40, bottom: 50, width: 820, opacity: 0.55, filter: "brightness(0.1) drop-shadow(0 0 2px rgba(226,54,43,0.9)) drop-shadow(0 0 20px rgba(226,54,43,0.6))" }}
        />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
          <div className="num">
            <Big size={260} color={C.de} style={{ textShadow: `0 0 60px ${hexA(C.de, 0.5)}` }}>
              {num}
            </Big>
          </div>
          <KineticTitle text={title} size={150} delay={0.35} stagger={0.03} style={{ textShadow: "0 6px 30px rgba(0,0,0,0.8)" }} />
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Foto em tela cheia ----------
export const PhotoBeat: React.FC<{ b: Extract<Beat, { kind: "photo" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { dur } = useBeatClock();
  const k = interpolate(frame, [6, 18], [0, 1], { ...clamp, easing: E });
  const color = b.side ? sideColor(b.side) : C.text;
  return (
    <AbsoluteFill>
      <Photo src={b.src} dur={dur} grade={b.grade ?? "cold"} darken={0.18} position={b.position} move={b.move ?? { fromScale: 1.06, toScale: 1.16 }} />
      {b.label || b.year ? (
        <>
          <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(7,9,11,0.7) 0%, rgba(7,9,11,0) 38%)" }} />
          <div style={{ position: "absolute", left: 110, bottom: b.letterbox ? 160 : 100, display: "flex", alignItems: "baseline", gap: 36, opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}>
            {b.label ? <Big size={84} color={C.text}>{b.label}</Big> : null}
            {b.year ? <Big size={84} color={color}>{b.year}</Big> : null}
          </div>
        </>
      ) : null}
      {b.letterbox ? <Letterbox amount={1} /> : null}
    </AbsoluteFill>
  );
};

// ---------- Tanque em destaque (recorte) com indicações ----------
export const TankBeat: React.FC<{ b: Extract<Beat, { kind: "tank" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local, dur } = useBeatClock();
  const t = TANKS[b.tank];
  const color = sideColor(t.side);
  const withTitle = !!b.title;
  const W = (withTitle ? 1080 : 1400) * (b.scale ?? 1);
  const H = W * t.ratio;
  const left = withTitle ? (t.side === "de" ? 30 : 1920 - W - 30) : (1920 - W) / 2;
  const top = withTitle ? 540 - H / 2 + 40 : 560 - H / 2 + 40;
  const push = interpolate(frame, [0, dur], [1, 1.05]);
  const idIn = interpolate(frame, [8, 22], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill>
      <DarkStage left={color} right={color} glow={0.18} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 55%" }}>
        <div style={{ position: "absolute", left, top, width: W, transform: handheld(frame, 3, b.tank) }}>
          <Cutout src={t.src} width={W} glow={hexA(color, 0.22)} style={{ position: "relative" }} />
        </div>
        {(b.callouts ?? []).map((c) => (
          <Callout key={c.title} x={left + c.fx * W} y={top + c.fy * H} dx={c.dx} dy={c.dy} title={c.title} color={color} delay={local(c.at)} align={c.align ?? "left"} />
        ))}
      </AbsoluteFill>
      {withTitle ? (
        <div style={{ position: "absolute", top: 300, width: 720, left: t.side === "de" ? 1170 : 120, opacity: idIn }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22 }}>
            {t.side === "de" ? <FlagDE width={110} /> : <FlagRU width={110} />}
            <Tag text={t.side === "de" ? "Germany" : "Russia"} color={color} size={64} />
          </div>
          <KineticTitle text={t.name[0]} size={160} color={t.side === "de" ? C.text : C.ru} delay={0.15} stagger={0.03} />
          <KineticTitle text={t.name[1]} size={t.side === "de" ? 200 : 160} color={t.side === "de" ? C.de : C.text} delay={0.4} stagger={0.04} style={{ marginTop: -14 }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Leopard × T-14: um número de cada lado ----------
const Value: React.FC<{ v: { value: string; unit?: string; count?: number }; color: string; cls: string }> = ({ v, color, cls }) => (
  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 18 }}>
    <Big size={190} color={C.text} className={`${cls}-n`} style={{ fontVariantNumeric: "tabular-nums" }}>
      {v.value}
    </Big>
    {v.unit ? (
      <Big size={96} color={color}>
        {v.unit}
      </Big>
    ) : null}
  </div>
);

export const VersusBeat: React.FC<{ b: Extract<Beat, { kind: "versus" }> }> = ({ b }) => {
  const { sec } = useBeatClock();
  const ruT = b.ruAt !== undefined ? sec(b.ruAt) : 0.25;
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".col-de"), { opacity: 0, x: -80, duration: 0.6, ease: "expo.out" }, 0.05)
      .from(selector(".col-ru"), { opacity: 0, x: 80, duration: 0.6, ease: "expo.out" }, ruT)
      .from(selector(".ttl"), { opacity: 0, y: -24, duration: 0.5, ease: "expo.out" }, 0);
    if (b.de.count !== undefined) timeline.fromTo(selector(".de-n"), { textContent: 0 }, { textContent: b.de.count, duration: 0.9, ease: "power2.out", snap: { textContent: 1 } }, 0.1);
    if (b.ru.count !== undefined) timeline.fromTo(selector(".ru-n"), { textContent: 0 }, { textContent: b.ru.count, duration: 0.9, ease: "power2.out", snap: { textContent: 1 } }, ruT + 0.05);
  });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.24} />
      <div ref={ref} style={{ position: "absolute", inset: 0 }}>
        {b.title ? (
          <div className="ttl" style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center" }}>
            <Big size={80}>{b.title}</Big>
          </div>
        ) : null}
        {(["de", "ru"] as const).map((s) => {
          const t = s === "de" ? TANKS.leo : TANKS.t14;
          return (
            <div key={s} className={`col-${s}`} style={{ position: "absolute", top: b.title ? 220 : 130, width: 960, left: s === "de" ? 0 : 960, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Value v={s === "de" ? b.de : b.ru} color={sideColor(s)} cls={s} />
              <div style={{ marginTop: b.title ? 50 : 80, width: 860 }}>
                <Cutout src={t.src} width={860} glow={hexA(sideColor(s), 0.25)} style={{ position: "relative" }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Tela dividida (duas fotos) ----------
export const SplitBeat: React.FC<{ b: Extract<Beat, { kind: "split" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local, dur } = useBeatClock();
  const a = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: E });
  const r0 = b.ruAt !== undefined ? local(b.ruAt) : 0;
  const r = interpolate(frame, [r0, r0 + 14], [0, 1], { ...clamp, easing: E });
  const leftClip = `polygon(0 0, ${56 * a}% 0, ${44 * a}% 100%, 0 100%)`;
  const rightClip = `polygon(${100 - 44 * r}% 0, 100% 0, 100% 100%, ${100 - 56 * r}% 100%)`;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ clipPath: leftClip }}>
        <Photo src={b.de.src} dur={dur} grade="warm" darken={0.18} move={{ fromScale: 1.14, toScale: 1.04, fromX: -2, toX: 2 }} />
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(7,9,11,0.75) 0%, transparent 40%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: rightClip }}>
        <Photo src={b.ru.src} dur={dur} grade={b.same ? "warm" : "cold"} darken={0.18} move={{ fromScale: 1.04, toScale: 1.14, fromX: 2, toX: -2 }} />
        <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(7,9,11,0.75) 0%, transparent 40%)" }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={1920 * 0.56} y1={0} x2={1920 * 0.44} y2={1080} stroke={C.text} strokeWidth={4} opacity={Math.min(a, r)} />
      </svg>
      {b.de.label ? (
        <div style={{ position: "absolute", left: 110, bottom: 90, opacity: a }}>
          <Big size={72} color={b.same ? sideColor(b.same) : C.de}>{b.de.label}</Big>
        </div>
      ) : null}
      {b.ru.label ? (
        <div style={{ position: "absolute", right: 110, bottom: 90, opacity: r }}>
          <Big size={72} color={b.same ? sideColor(b.same) : C.ru}>{b.ru.label}</Big>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Número em destaque ----------
export const NumberBeat: React.FC<{ b: Extract<Beat, { kind: "number" }> }> = ({ b }) => {
  const { dur } = useBeatClock();
  const color = b.side ? sideColor(b.side) : C.de;
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline.from(selector(".blk"), { opacity: 0, y: 40, duration: 0.6, ease: "expo.out" }, 0.05);
    if (b.count !== undefined) timeline.fromTo(selector(".n"), { textContent: 0 }, { textContent: b.count, duration: 1.0, ease: "power2.out", snap: { textContent: 1 } }, 0.1);
    timeline.from(selector(".cap"), { opacity: 0, y: 20, duration: 0.5, ease: "expo.out" }, 0.45);
  });
  return (
    <AbsoluteFill>
      {b.src ? (
        <>
          <Photo src={b.src} dur={dur} grade="cold" darken={0.5} blur={2} move={{ fromScale: 1.08, toScale: 1.16 }} />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,9,11,0.9) 0%, rgba(7,9,11,0.5) 55%, rgba(7,9,11,0.2) 100%)" }} />
        </>
      ) : (
        <DarkStage left={color} right={color} glow={0.2} />
      )}
      <div ref={ref} style={{ position: "absolute", left: 150, top: 300 }}>
        <div className="blk" style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <Big size={280} className="n" style={{ fontVariantNumeric: "tabular-nums" }}>
            {b.value}
          </Big>
          {b.unit ? (
            <Big size={120} color={color}>
              {b.unit}
            </Big>
          ) : null}
        </div>
        {b.caption ? (
          <div className="cap" style={{ marginTop: 26 }}>
            <Big size={84} color={C.text}>{b.caption}</Big>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Lista de itens (com imagem do item ativo) ----------
export const ListBeat: React.FC<{ b: Extract<Beat, { kind: "list" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local } = useBeatClock();
  let active = -1;
  b.items.forEach((it, i) => {
    if (frame >= local(it.at)) active = i;
  });
  const hasImg = !!b.img || b.items.some((i) => i.img);
  const fixedIn = interpolate(frame, [4, 16], [0, 1], { ...clamp, easing: E });
  const titleIn = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.1} />
      {b.title ? (
        <div style={{ position: "absolute", left: 140, top: 120, opacity: titleIn }}>
          <Big size={84} color={C.muted}>{b.title}</Big>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 140, top: b.title ? 260 : 200, display: "flex", flexDirection: "column", gap: 26 }}>
        {b.items.map((it, i) => {
          const k = interpolate(frame, [local(it.at), local(it.at) + 10], [0, 1], { ...clamp, easing: E });
          const isActive = i === active;
          const color = it.side ? sideColor(it.side) : C.text;
          // cabe na largura disponível (ao lado da imagem, quando houver)
          const maxW = hasImg ? 900 : 1640;
          const fit = (base: number) => Math.max(MIN_TEXT, Math.min(base, Math.floor(maxW / (0.53 * it.t.length))));
          return (
            <div key={it.t} style={{ opacity: k * (isActive ? 1 : 0.55), transform: `translateX(${(1 - k) * -60}px)` }}>
              <Big size={fit(isActive ? 92 : 72)} color={color}>{it.t}</Big>
            </div>
          );
        })}
      </div>
      {hasImg ? (
        <div style={{ position: "absolute", left: 1120, top: 220, width: 660, height: 640, overflow: "hidden", background: C.bg2 }}>
          {b.img ? (
            <Img
              src={staticFile(`img/${b.img}`)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: fixedIn, transform: `scale(${interpolate(frame, [0, 240], [1.12, 1.0], clamp)})`, filter: "contrast(1.08) saturate(0.85)" }}
            />
          ) : null}
          {b.items.map((it, i) => {
            if (!it.img) return null;
            const k = interpolate(frame, [local(it.at), local(it.at) + 8], [0, 1], clamp);
            if (i > active || (i < active && frame > local(b.items[i + 1].at) + 8)) return null;
            const z = interpolate(frame, [local(it.at), local(it.at) + 150], [1.15, 1.02], { ...clamp, easing: E });
            return (
              <Img
                key={it.t}
                src={staticFile(`img/${it.img}`)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: k, transform: `scale(${z})`, filter: "contrast(1.08) saturate(0.85)", clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}
              />
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Desenho técnico (bordas do recorte + cotas) ----------
export const BlueprintBeat: React.FC<{ b: Extract<Beat, { kind: "blueprint" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { dur } = useBeatClock();
  const t = TANKS[b.tank];
  const W = 1300;
  const H = W * t.ratio;
  const L0 = 310;
  const T0 = 540 - H / 2 + 20;
  const drawIn = (start: number) => interpolate(frame, [start, start + 18], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const zoom = interpolate(frame, [0, dur], [1.0, 1.06]);
  const blue = "rgba(140, 200, 255, 0.95)";
  const dims: [number, number, number, number, number][] = [
    [L0, T0 - 35, L0 + W, T0 - 35, 4],
    [L0, T0 + H + 35, L0 + W * 0.62, T0 + H + 35, 14],
    [L0 + W + 50, T0 + H * 0.1, L0 + W + 50, T0 + H, 24],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#071420" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={`edges-${b.tank}`} colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feConvolveMatrix order={3} kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.78  0 0 0 0 1  2.2 2.2 2.2 0 0" />
        </filter>
      </svg>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img src={staticFile(`img/${t.src}`)} style={{ position: "absolute", left: L0, top: T0, width: W, filter: `url(#edges-${b.tank})`, opacity: 0.95 }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {dims.map(([x1, y1, x2, y2, s], i) => {
            const k = drawIn(s);
            const len = Math.hypot(x2 - x1, y2 - y1);
            const vertical = x1 === x2;
            const tick = (x: number, y: number) =>
              vertical ? <line x1={x - 14} y1={y} x2={x + 14} y2={y} stroke={blue} strokeWidth={2} /> : <line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke={blue} strokeWidth={2} />;
            return (
              <g key={i} opacity={k > 0 ? 1 : 0}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={blue} strokeWidth={2} strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
                {tick(x1, y1)}
                {k > 0.98 ? tick(x2, y2) : null}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 50%, rgba(2,8,14,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------- Mapa (países destacados e cidades, sem linhas de ligação) ----------
const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const COUNTRIES = (feature(topo, topo.objects.countries) as FeatureCollection<Geometry>).features;

export const MapBeat: React.FC<{ b: Extract<Beat, { kind: "map" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local, dur } = useBeatClock();
  const { paths, project } = useMemo(() => {
    const wide = b.view === "wide";
    const [clon, clat] = b.center ?? [wide ? 40 : 28, wide ? 52 : 54];
    const projection = geoConicConformal()
      .parallels([45, 62])
      .rotate([-clon, 0])
      .center([0, clat])
      .scale(b.scale ?? (wide ? 1250 : 2050))
      .translate([960, 540]);
    const path = geoPath(projection);
    return {
      paths: COUNTRIES.map((f: Feature<Geometry>) => ({ id: String(f.id), d: path(f) ?? "" })).filter((p) => p.d.length > 0),
      project: (lon: number, lat: number) => projection([lon, lat]) as [number, number],
    };
  }, [b.view, b.center, b.scale]);
  const reveal = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: E });
  const zoom = interpolate(frame, [0, dur], [1.0, 1.08]);
  const hl = (at: number) => interpolate(frame, [local(at), local(at) + 14], [0, 1], { ...clamp, easing: E });
  const colorOf = (c: Side | "neutral") => (c === "neutral" ? C.text : sideColor(c));
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.08} />
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: reveal }}>
          {paths.map((p) => {
            const h = b.countries.find((c) => c.id === p.id);
            const k = h ? hl(h.at) : 0;
            const col = h ? colorOf(h.color) : null;
            return (
              <path
                key={p.id + p.d.length}
                d={p.d}
                fill={col ? hexA(col, 0.08 + 0.45 * k) : "rgba(233,238,241,0.07)"}
                stroke={col ? hexA(col, 0.3 + 0.7 * k) : "rgba(233,238,241,0.34)"}
                strokeWidth={col ? 1 + 1.8 * k : 0.8}
              />
            );
          })}
        </svg>
        {(b.cities ?? []).map((c) => {
          const [x, y] = project(c.lon, c.lat);
          const k = hl(c.at);
          const col = sideColor(c.side);
          return (
            <React.Fragment key={c.name}>
              <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, opacity: k }}>
                <LottieAsset name={c.side === "de" ? "pulse-gold" : "pulse-red"} loop />
              </div>
              <div style={{ position: "absolute", left: x + 36, top: y - 40, opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
                <Big size={64} color="#fff" style={{ textShadow: `0 0 24px ${hexA(col, 0.9)}, 0 4px 18px rgba(0,0,0,0.9)` }}>
                  {c.name}
                </Big>
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Barras comparativas (Leopard à esquerda, T-14 à direita) ----------
export const BarsBeat: React.FC<{ b: Extract<Beat, { kind: "bars" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local } = useBeatClock();
  const rowH = 150;
  const top0 = b.title ? 300 : 230;
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.16} />
      {b.title ? (
        <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", opacity: interpolate(frame, [0, 12], [0, 1], clamp) }}>
          <Big size={84}>{b.title}</Big>
        </div>
      ) : null}
      {b.rows.map((r, i) => {
        const k = interpolate(frame, [local(r.at), local(r.at) + 26], [0, 1], { ...clamp, easing: E });
        const kt = interpolate(frame, [local(r.at) + 8, local(r.at) + 20], [0, 1], clamp);
        const y = top0 + i * (rowH + 40);
        const half = 620;
        return (
          <div key={r.label} style={{ position: "absolute", top: y, left: 0, right: 0, height: rowH }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", opacity: kt }}>
              <Big size={60} color={C.muted}>{r.label}</Big>
            </div>
            <div style={{ position: "absolute", top: 80, right: 960 + 20, width: half, height: 44, display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: `${r.de * 100 * k}%`, height: "100%", background: `linear-gradient(270deg, ${C.de}, ${C.deDeep})` }} />
            </div>
            <div style={{ position: "absolute", top: 80, left: 960 + 20, width: half, height: 44 }}>
              <div style={{ width: `${r.ru * 100 * k}%`, height: "100%", background: `linear-gradient(90deg, ${C.ru}, ${C.ruDeep})` }} />
            </div>
            <div style={{ position: "absolute", top: 68, right: 960 + 40 + half, opacity: kt }}>
              <Big size={64} color={C.de}>{r.deText}</Big>
            </div>
            <div style={{ position: "absolute", top: 68, left: 960 + 40 + half, opacity: kt }}>
              <Big size={64} color={C.ru}>{r.ruText}</Big>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Os dois tanques lado a lado (sem texto) ----------
export const StageBeat: React.FC<{ b: Extract<Beat, { kind: "stage" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { dur } = useBeatClock();
  const push = interpolate(frame, [0, dur], [1, 1.06]);
  const dim = (s: Side) => (b.focus && b.focus !== "both" && b.focus !== s ? 0.35 : 1);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.26} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", left: 50, top: 370, width: 900, filter: `brightness(${dim("de")})` }}>
          <Cutout src={TANKS.leo.src} width={900} glow={hexA(C.de, 0.3)} style={{ position: "relative" }} />
        </div>
        <div style={{ position: "absolute", left: 970, top: 400, width: 900, filter: `brightness(${dim("ru")})` }}>
          <Cutout src={TANKS.t14.src} width={900} glow={hexA(C.ru, 0.3)} style={{ position: "relative" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Diagrama de compartimentos do T-14: tripulação em cápsula blindada ----------
export const CapsuleBeat: React.FC<{ b: Extract<Beat, { kind: "capsule" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local, dur } = useBeatClock();
  const zoom = interpolate(frame, [0, dur], [1.0, 1.08], { easing: Easing.bezier(0.33, 0, 0.67, 1) });
  const box = (x0: number, x1: number, y0: number, y1: number) => ({ left: x0 * 1920, top: y0 * 1280 - 100, width: (x1 - x0) * 1920, height: (y1 - y0) * 1280 });
  const turret = box(0.25, 0.646, 0.338, 0.494);
  const crew = box(0.625, 0.933, 0.519, 0.675);
  const turretIn = b.turretAt !== undefined ? interpolate(frame, [local(b.turretAt), local(b.turretAt) + 10], [0, 1], { ...clamp, easing: E }) : 0;
  const crewIn = interpolate(frame, [local(b.crewAt), local(b.crewAt) + 12], [0, 1], { ...clamp, easing: E });
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.25);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f12" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "70% 55%" }}>
        <Img src={staticFile("img/t14_compartments.jpg")} style={{ width: 1920, height: 1280, objectFit: "cover", position: "absolute", top: -100, left: 0, filter: "grayscale(1) contrast(1.15) brightness(0.55)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 60% 55%, transparent 40%, rgba(5,8,10,0.8) 100%)" }} />
        <div style={{ position: "absolute", ...turret, border: `3px solid ${C.text}`, background: "rgba(233,238,241,0.08)", opacity: turretIn * (1 - 0.5 * crewIn) }} />
        <div style={{ position: "absolute", ...crew, border: `4px solid ${C.ru}`, background: hexA(C.ru, 0.14 + 0.18 * pulse * crewIn), boxShadow: `0 0 ${40 * crewIn}px ${hexA(C.ru, 0.7)}`, opacity: crewIn, transform: `scale(${0.9 + 0.1 * crewIn})` }}>
          <div style={{ position: "absolute", right: 0, top: -88, background: hexA("#07090B", 0.82), padding: "4px 18px" }}>
            <Big size={60} color="#fff">{b.label ?? "Armored crew capsule"}</Big>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Linha do tempo de anúncios (marcos datados alternando acima/abaixo do eixo) ----------
export const DatesBeat: React.FC<{ b: Extract<Beat, { kind: "dates" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local } = useBeatClock();
  const color = sideColor(b.side);
  const n = b.items.length;
  const step = Math.min(420, 1420 / Math.max(1, n - 1));
  const x0 = 960 - (step * (n - 1)) / 2;
  const axisY = 540;
  const axis = interpolate(frame, [0, 18], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill>
      <DarkStage left={color} right={color} glow={0.14} />
      <div style={{ position: "absolute", left: 60, right: 60, top: axisY - 1.5, height: 3, background: C.text, opacity: 0.55, transform: `scaleX(${axis})`, transformOrigin: "left center" }} />
      {b.items.map((it, i) => {
        const k = interpolate(frame, [local(it.at), local(it.at) + 12], [0, 1], { ...clamp, easing: E });
        const up = i % 2 === 0;
        const x = x0 + i * step;
        return (
          <React.Fragment key={it.date + i}>
            <div style={{ position: "absolute", left: x - 1.5, top: up ? axisY - 90 : axisY, width: 3, height: 90 * k, background: color, transform: up ? `translateY(${90 * (1 - k)}px)` : undefined }} />
            <div style={{ position: "absolute", left: x - 11, top: axisY - 11, width: 22, height: 22, borderRadius: 11, background: color, boxShadow: `0 0 18px ${hexA(color, 0.8)}`, transform: `scale(${k})` }} />
            <div
              style={{
                position: "absolute",
                left: x - 190,
                width: 380,
                top: up ? undefined : axisY + 110,
                bottom: up ? 1080 - axisY + 110 : undefined,
                textAlign: "center",
                opacity: k,
                transform: `translateY(${(1 - k) * (up ? -20 : 20)}px)`,
              }}
            >
              <Big size={84} color={color} style={{ display: "block" }}>{it.date}</Big>
              {it.text ? (
                <Big size={56} color={C.text} style={{ display: "block", marginTop: 14, whiteSpace: "normal", lineHeight: 1.1 }}>
                  {it.text}
                </Big>
              ) : null}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Fontes na descrição ----------
export const SourcesBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [2, 16], [0, 1], { ...clamp, easing: E });
  const arrow = Math.sin(frame * 0.2) * 10;
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.16} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, background: hexA("#0E1418", 0.85), border: `2px solid ${hexA(C.de, 0.6)}`, padding: "40px 64px" }}>
          <svg width={80} height={98} viewBox="0 0 64 78">
            <path d="M4 4 H42 L60 22 V74 H4 Z" fill="none" stroke={C.de} strokeWidth={4} />
            <path d="M42 4 V22 H60" fill="none" stroke={C.de} strokeWidth={4} />
            {[34, 46, 58].map((y) => (
              <line key={y} x1={14} y1={y} x2={50} y2={y} stroke={C.de} strokeWidth={4} />
            ))}
          </svg>
          <Big size={92}>Sources in the description</Big>
          <Big size={110} color={C.de} style={{ transform: `translateY(${arrow}px)`, display: "inline-block" }}>↓</Big>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Munição programável: trajetória e detonação no ponto escolhido ----------
export const AirburstBeat: React.FC<{ b: Extract<Beat, { kind: "airburst" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local } = useBeatClock();
  const f0 = local(b.fireAt);
  const f1 = local(b.burstAt);
  // trajetória: do cano (esquerda) até o ponto de detonação programado sobre o alvo (direita)
  const P0 = [430, 640];
  const PC = [980, 330];
  const P1 = [1430, 520];
  const p = interpolate(frame, [f0, f1], [0, 1], clamp);
  const q = (t: number) => [
    (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * PC[0] + t * t * P1[0],
    (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * PC[1] + t * t * P1[1],
  ];
  const pts = Array.from({ length: 41 }, (_, i) => q((i / 40) * p));
  const [px, py] = q(p);
  const burst = interpolate(frame, [f1, f1 + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const flash = interpolate(frame, [f1, f1 + 2, f1 + 10], [0, 1, 0], clamp);
  const marker = interpolate(frame, [f0 - 20, f0 - 6], [0, 1], { ...clamp, easing: E });
  const muzzle = interpolate(frame, [f0, f0 + 2, f0 + 8], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.12} />
      <div style={{ position: "absolute", left: -60, top: 520, width: 640 }}>
        <Img src={staticFile(`img/${TANKS.leo.src}`)} style={{ width: "100%", filter: "brightness(0.12) drop-shadow(0 0 2px rgba(242,182,48,0.9)) drop-shadow(0 0 18px rgba(242,182,48,0.5))" }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* ponto programado */}
        <g opacity={marker * (1 - burst * 0.6)}>
          <circle cx={P1[0]} cy={P1[1]} r={34} fill="none" stroke={C.de} strokeWidth={3} strokeDasharray="10 8" />
          <circle cx={P1[0]} cy={P1[1]} r={6} fill={C.de} />
        </g>
        {/* rastro */}
        {p > 0 ? <polyline points={pts.map((v) => v.join(",")).join(" ")} fill="none" stroke="rgba(255,226,168,0.75)" strokeWidth={4} strokeLinecap="round" /> : null}
        {p > 0 && p < 1 ? <circle cx={px} cy={py} r={9} fill="#fff" /> : null}
        <circle cx={P0[0]} cy={P0[1]} r={40 * muzzle} fill="#FFE2A8" opacity={muzzle} />
        {/* detonação e estilhaços */}
        {burst > 0 ? (
          <g>
            <circle cx={P1[0]} cy={P1[1]} r={30 + 170 * burst} fill="none" stroke="#FFE2A8" strokeWidth={6 * (1 - burst) + 1} opacity={1 - burst} />
            <circle cx={P1[0]} cy={P1[1]} r={90 * flash + 10} fill="#FFF3D6" opacity={flash} />
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2 + 0.2;
              const r1 = 40 + 260 * burst;
              return <line key={i} x1={P1[0] + Math.cos(a) * r1 * 0.7} y1={P1[1] + Math.sin(a) * r1 * 0.7} x2={P1[0] + Math.cos(a) * r1} y2={P1[1] + Math.sin(a) * r1} stroke="#FFE2A8" strokeWidth={3} opacity={1 - burst} />;
            })}
          </g>
        ) : null}
      </svg>
      {b.label ? (
        <div style={{ position: "absolute", left: 120, top: 110, opacity: marker }}>
          <Big size={120} color={C.de}>{b.label}</Big>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Hunter-killer: atirador travado num alvo enquanto o comandante procura o próximo ----------
export const HunterBeat: React.FC<{ b: Extract<Beat, { kind: "hunter" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local } = useBeatClock();
  const O = [520, 720]; // posição da torre
  const A = [1460, 700]; // alvo do atirador
  const B = [1340, 330]; // alvo encontrado pelo comandante
  const fFind = local(b.findAt);
  const intro = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: E });
  // ângulo do comandante: varre, trava em B por ~1,5 s e volta a varrer
  const angB = Math.atan2(B[1] - O[1], B[0] - O[0]);
  const sweep = (f: number) => -0.95 + 0.55 * Math.sin(f * 0.045);
  const lockK = interpolate(frame, [fFind - 10, fFind, fFind + 45, fFind + 60], [0, 1, 1, 0], clamp);
  const angC = sweep(frame) * (1 - lockK) + angB * lockK;
  const angA = Math.atan2(A[1] - O[1], A[0] - O[0]);
  const cone = (ang: number, spread: number, len: number) => {
    const p1 = [O[0] + Math.cos(ang - spread) * len, O[1] + Math.sin(ang - spread) * len];
    const p2 = [O[0] + Math.cos(ang + spread) * len, O[1] + Math.sin(ang + spread) * len];
    return `${O[0]},${O[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`;
  };
  const foundB = interpolate(frame, [fFind, fFind + 8], [0, 1], clamp);
  const title = interpolate(frame, [local(b.titleAt), local(b.titleAt) + 12], [0, 1], { ...clamp, easing: E });
  const sil = (x: number, y: number, k: number) => (
    <Img
      src={staticFile(`img/${TANKS.t14.src}`)}
      style={{ position: "absolute", left: x - 130, top: y - 60, width: 260, opacity: k, filter: "brightness(0.15) drop-shadow(0 0 2px rgba(226,54,43,0.9)) drop-shadow(0 0 14px rgba(226,54,43,0.5))" }}
    />
  );
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.12} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: intro }}>
        <defs>
          <linearGradient id="hk-g" x1="0" x2="1">
            <stop offset="0" stopColor={C.de} stopOpacity="0.55" />
            <stop offset="1" stopColor={C.de} stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="hk-c" x1="0" x2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <polygon points={cone(angA, 0.035, 1100)} fill="url(#hk-g)" />
        <polygon points={cone(angC, 0.13, 1000)} fill="url(#hk-c)" />
      </svg>
      {sil(A[0], A[1], intro)}
      {sil(B[0], B[1], 0.25 + 0.75 * foundB)}
      <div style={{ position: "absolute", left: A[0] - 130, top: A[1] - 130, width: 260, height: 260 }}>
        <LottieAsset name="reticle-red" />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={B[0] - 110} y={B[1] - 80} width={220} height={160} fill="none" stroke="#fff" strokeWidth={4} opacity={foundB} strokeDasharray="40 20" />
      </svg>
      <div style={{ position: "absolute", left: 60, top: 600, width: 620, opacity: intro }}>
        <Img src={staticFile(`img/${TANKS.leo.src}`)} style={{ width: "100%", filter: "brightness(0.85) saturate(0.85)" }} />
      </div>
      <div style={{ position: "absolute", left: A[0] - 180, top: A[1] + 120, width: 360, textAlign: "center", opacity: intro }}>
        <Big size={60} color={C.de}>Gunner</Big>
      </div>
      <div style={{ position: "absolute", left: B[0] - 220, top: B[1] - 170, width: 440, textAlign: "center", opacity: foundB }}>
        <Big size={60}>Commander</Big>
      </div>
      <div style={{ position: "absolute", left: 120, top: 110, opacity: title, transform: `translateY(${(1 - title) * -20}px)` }}>
        <Big size={120} color={C.de}>Hunter-killer</Big>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Proteção ativa: radar detecta a ameaça, lançador dispara e intercepta antes do impacto ----------
export const InterceptBeat: React.FC<{ b: Extract<Beat, { kind: "intercept" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local } = useBeatClock();
  const drone = b.threat === "drone";
  const fDet = local(b.detectAt);
  const fFire = local(b.fireAt);
  const fHit = fFire + 9; // contramedida encontra a ameaça
  const W = 980;
  const tankL = 140;
  const tankT = 600;
  const H = W * TANKS.leo.ratio;
  const launcher = [tankL + 0.754 * W, tankT + 0.27 * H];
  // ameaça: entra pela direita (míssil) ou desce do alto (drone) até o ponto de interceptação
  const start = drone ? [1500, -80] : [2050, 520];
  const meet = drone ? [1140, 360] : [1420, 560];
  const approachEnd = fHit;
  const p = interpolate(frame, [0, approachEnd], [0, 1], clamp);
  const tx = start[0] + (meet[0] - start[0]) * p;
  const ty = start[1] + (meet[1] - start[1]) * p;
  const det = interpolate(frame, [fDet, fDet + 10], [0, 1], { ...clamp, easing: E });
  const cm = interpolate(frame, [fFire, fHit], [0, 1], clamp);
  const cx = launcher[0] + (meet[0] - launcher[0]) * cm;
  const cy = launcher[1] + (meet[1] - launcher[1]) * cm;
  const boom = interpolate(frame, [fHit, fHit + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const alive = frame < fHit;
  const sweep = (frame * 0.06) % (Math.PI * 2);
  const radarR = 520;
  const label = interpolate(frame, [4, 16], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.14} />
      <div style={{ position: "absolute", left: tankL, top: tankT, width: W }}>
        <Cutout src={TANKS.leo.src} width={W} glow={hexA(C.de, 0.22)} style={{ position: "relative" }} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* cobertura do radar */}
        <g opacity={0.25 + 0.4 * det}>
          <circle cx={launcher[0]} cy={launcher[1]} r={radarR} fill="none" stroke={C.de} strokeWidth={2} strokeDasharray="6 12" />
          <path d={`M ${launcher[0]} ${launcher[1]} L ${launcher[0] + Math.cos(sweep) * radarR} ${launcher[1] + Math.sin(sweep) * radarR}`} stroke={C.de} strokeWidth={3} opacity={0.6} />
        </g>
        {/* trava na ameaça */}
        {alive ? <rect x={tx - 40} y={ty - 40} width={80} height={80} fill="none" stroke={C.ru} strokeWidth={4} opacity={det} /> : null}
        {/* ameaça */}
        {alive ? (
          drone ? (
            <g transform={`translate(${tx} ${ty})`}>
              <rect x={-14} y={-6} width={28} height={12} fill="#ddd" />
              {[-1, 1].map((s) => (
                <g key={s}>
                  <line x1={0} y1={0} x2={s * 34} y2={-12} stroke="#ddd" strokeWidth={4} />
                  <ellipse cx={s * 34} cy={-14} rx={16} ry={4} fill="#ddd" opacity={0.8} />
                </g>
              ))}
            </g>
          ) : (
            <g>
              <line x1={tx} y1={ty} x2={tx + 220} y2={ty - 10} stroke="rgba(255,255,255,0.35)" strokeWidth={8} strokeLinecap="round" />
              <polygon points={`${tx - 26},${ty} ${tx + 14},${ty - 9} ${tx + 14},${ty + 9}`} fill="#eee" />
              <circle cx={tx + 20} cy={ty} r={9} fill="#FFB347" />
            </g>
          )
        ) : null}
        {/* contramedida */}
        {cm > 0 && cm < 1 ? <line x1={launcher[0]} y1={launcher[1]} x2={cx} y2={cy} stroke="#FFE2A8" strokeWidth={5} strokeLinecap="round" /> : null}
        {/* interceptação */}
        {boom > 0 ? (
          <g>
            <circle cx={meet[0]} cy={meet[1]} r={20 + 150 * boom} fill="none" stroke="#FFE2A8" strokeWidth={6 * (1 - boom) + 1} opacity={1 - boom} />
            <circle cx={meet[0]} cy={meet[1]} r={70 * (1 - boom) + 10} fill="#FFF3D6" opacity={(1 - boom) * 0.9} />
          </g>
        ) : null}
      </svg>
      {b.label ? (
        <div style={{ position: "absolute", left: 120, top: 110, opacity: label }}>
          <Big size={120} color={C.de}>{b.label}</Big>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Campeão da comparação ----------
export const ChampionBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { dur } = useBeatClock();
  const ref = useGsapTimeline<HTMLDivElement>(({ timeline, selector }) => {
    timeline
      .from(selector(".tank"), { y: 120, opacity: 0, scale: 0.9, duration: 0.9, ease: "expo.out" }, 0)
      .from(selector(".ch"), { opacity: 0, scale: 1.5, filter: "blur(14px)", duration: 0.6, ease: "expo.out" }, 0.25);
  });
  const push = interpolate(frame, [0, dur], [1, 1.06]);
  const rays = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.de} glow={0.32} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 45% at 50% 62%, ${hexA(C.de, 0.28 * rays)} 0%, transparent 70%)` }} />
      <div ref={ref} style={{ position: "absolute", inset: 0, transform: `scale(${push})` }}>
        <div className="tank" style={{ position: "absolute", left: 960 - 650, top: 430, width: 1300 }}>
          <Cutout src={TANKS.leo.src} width={1300} glow={hexA(C.de, 0.45)} style={{ position: "relative" }} />
        </div>
        <div className="ch" style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}>
          <Big size={110} color={C.de} style={{ display: "block", letterSpacing: 8 }}>Champion</Big>
          <Big size={170} style={{ display: "block", marginTop: 10 }}>Leopard 2A8</Big>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Like + inscrição ----------
export const CtaBeat: React.FC<{ b: Extract<Beat, { kind: "cta" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local } = useBeatClock();
  const inK = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: E });
  const fl = local(b.likeAt);
  const fs = local(b.subAt);
  const liked = frame >= fl;
  const subbed = frame >= fs;
  const pop = (f0: number) => (frame >= f0 ? 1 + 0.18 * Math.max(0, Math.sin(Math.min(1, (frame - f0) / 10) * Math.PI)) : 1);
  const press = (f0: number) => interpolate(frame, [f0 - 6, f0], [1, 0.9], clamp) * pop(f0);
  return (
    <AbsoluteFill>
      <DarkStage left={C.de} right={C.ru} glow={0.18} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60, flexDirection: "row", opacity: inK, transform: `translateY(${(1 - inK) * 30}px)` }}>
        <div style={{ width: 240, height: 240, borderRadius: 120, border: `5px solid ${liked ? C.de : C.text}`, background: liked ? hexA(C.de, 0.2) : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${frame < fl ? press(fl) : pop(fl)})`, boxShadow: liked ? `0 0 50px ${hexA(C.de, 0.6)}` : "none" }}>
          <svg width={130} height={130} viewBox="0 0 24 24">
            <path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" fill={liked ? C.de : "none"} stroke={liked ? C.de : C.text} strokeWidth={0.6} />
          </svg>
        </div>
        <div style={{ padding: "34px 64px", background: subbed ? "#2A2F33" : C.ru, transform: `scale(${frame < fs ? press(fs) : pop(fs)})`, boxShadow: subbed ? "none" : `0 0 40px ${hexA(C.ru, 0.5)}` }}>
          <Big size={96} color="#fff">{subbed ? "Subscribed" : "Subscribe"}</Big>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Comunidade MOBERISK ----------
export const BrandBeat: React.FC<{ b: Extract<Beat, { kind: "brand" }> }> = ({ b }) => {
  const frame = useCurrentFrame();
  const { local } = useBeatClock();
  const k = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: E });
  const u = interpolate(frame, [local(b.urlAt), local(b.urlAt) + 14], [0, 1], { ...clamp, easing: E });
  return (
    <AbsoluteFill>
      <DarkStage left={C.ru} right={C.ru} glow={0.22} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, opacity: k, transform: `scale(${0.9 + 0.1 * k})` }}>
          <div style={{ width: 190, height: 190, background: "#E0281F", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Big size={150} color="#fff" style={{ textShadow: "none" }}>M</Big>
          </div>
          <Big size={200}>Moberisk</Big>
        </div>
        <div style={{ opacity: u, transform: `translateY(${(1 - u) * 20}px)` }}>
          <Big size={96} color={C.de} style={{ textTransform: "none" }}>moberisk.com</Big>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
