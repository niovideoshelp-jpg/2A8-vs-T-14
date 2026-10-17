// Gera as animações Lottie (HUD militar) usadas no vídeo em public/lottie/
// Uso: node scripts/make-lottie.mjs
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public", "lottie");
fs.mkdirSync(OUT, { recursive: true });

const FR = 30;

const hex = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
};

const ease = { i: { x: [0.2], y: [1] }, o: { x: [0.6], y: [0] } };
const easeN = (n) => ({
  i: { x: Array(n).fill(0.2), y: Array(n).fill(1) },
  o: { x: Array(n).fill(0.6), y: Array(n).fill(0) },
});

const still = (k) => ({ a: 0, k });
const anim = (frames) => ({
  a: 1,
  k: frames.map(([t, s], i) =>
    i === frames.length - 1
      ? { t, s: Array.isArray(s) ? s : [s] }
      : { t, s: Array.isArray(s) ? s : [s], ...(Array.isArray(s) ? easeN(s.length) : ease) },
  ),
});

const tr = (extra = {}) => ({
  ty: "tr",
  p: still([0, 0]),
  a: still([0, 0]),
  s: still([100, 100]),
  r: still(0),
  o: still(100),
  ...extra,
});

const stroke = (color, w, extra = {}) => ({
  ty: "st",
  c: still(hex(color)),
  o: still(100),
  w: still(w),
  lc: 2,
  lj: 2,
  ...extra,
});

const fill = (color, o = 100) => ({ ty: "fl", c: still(hex(color)), o: still(o), r: 1 });

const ellipse = (size) => ({ ty: "el", p: still([0, 0]), s: still([size, size]), d: 1 });

const line = (a, b) => ({
  ty: "sh",
  ks: still({ i: [[0, 0], [0, 0]], o: [[0, 0], [0, 0]], v: [a, b], c: false }),
});

const polyline = (pts, closed = false) => ({
  ty: "sh",
  ks: still({
    i: pts.map(() => [0, 0]),
    o: pts.map(() => [0, 0]),
    v: pts,
    c: closed,
  }),
});

const trim = (startFrames, endFrames) => ({
  ty: "tm",
  s: startFrames ? anim(startFrames) : still(0),
  e: endFrames ? anim(endFrames) : still(100),
  o: still(0),
  m: 1,
});

const group = (items, transform = {}) => ({ ty: "gr", it: [...items, tr(transform)] });

const layer = (ind, nm, shapes, ks = {}, op) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm,
  sr: 1,
  ks: {
    o: still(100),
    r: still(0),
    p: still([256, 256, 0]),
    a: still([0, 0, 0]),
    s: still([100, 100, 100]),
    ...ks,
  },
  ao: 0,
  shapes,
  ip: 0,
  op,
  st: 0,
  bm: 0,
});

const comp = (nm, op, layers, w = 512, h = 512) => ({
  v: "5.7.4",
  fr: FR,
  ip: 0,
  op,
  w,
  h,
  nm,
  ddd: 0,
  assets: [],
  layers,
});

// 1) Retícula de mira: anéis tracejados girando, cruz e cantos que travam no alvo
const reticle = (color, name) => {
  const op = 120;
  const L = [];
  L.push(
    layer(1, "outer-dashed", [
      group([
        ellipse(420),
        stroke(color, 3, {
          d: [
            { n: "d", nm: "dash", v: still(36) },
            { n: "g", nm: "gap", v: still(18) },
          ],
        }),
        trim(null, [[0, 0], [24, 100]]),
      ]),
    ], {
      r: anim([[0, -90], [op, 90]]),
      o: anim([[0, 0], [10, 70]]),
    }, op),
  );
  L.push(
    layer(2, "inner-ring", [
      group([ellipse(250), stroke(color, 5), trim([[6, 50]], [[6, 50], [30, 100]])]),
      group([ellipse(250), stroke(color, 5), trim([[6, 50], [30, 0]], [[6, 50]])]),
    ], { r: anim([[0, 0], [op, -45]]) }, op),
  );
  const ticks = [];
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const r1 = 140;
    const r2 = 230;
    ticks.push(line([Math.cos(a) * r1, Math.sin(a) * r1], [Math.cos(a) * r2, Math.sin(a) * r2]));
  }
  L.push(
    layer(3, "cross", [group([...ticks, stroke(color, 4), trim(null, [[8, 0], [28, 100]])])], {}, op),
  );
  const c = 150;
  const k = 46;
  const corners = [
    [[-c, -c + k], [-c, -c], [-c + k, -c]],
    [[c - k, -c], [c, -c], [c, -c + k]],
    [[c, c - k], [c, c], [c - k, c]],
    [[-c + k, c], [-c, c], [-c, c - k]],
  ].map((p) => polyline(p));
  L.push(
    layer(4, "corners", [group([...corners, stroke(color, 6)])], {
      s: anim([[10, [190, 190, 100]], [34, [100, 100, 100]], [40, [92, 92, 100]], [48, [100, 100, 100]]]),
      o: anim([[10, 0], [16, 100]]),
      r: anim([[10, 45], [34, 0]]),
    }, op),
  );
  L.push(
    layer(5, "center-dot", [group([ellipse(14), fill(color)])], {
      s: anim([[34, [0, 0, 100]], [42, [140, 140, 100]], [48, [100, 100, 100]]]),
    }, op),
  );
  return comp(name, op, L.reverse());
};

// 2) Radar: anéis concêntricos, varredura girando e "blips" que aparecem
const radar = (color, name) => {
  const op = 150;
  const L = [];
  const rings = [460, 340, 220, 100].map((s) => ellipse(s));
  L.push(
    layer(1, "rings", [group([...rings, stroke(color, 2, { o: still(45) })])], {
      s: anim([[0, [60, 60, 100]], [20, [100, 100, 100]]]),
      o: anim([[0, 0], [12, 100]]),
    }, op),
  );
  L.push(
    layer(2, "axes", [
      group([line([-240, 0], [240, 0]), line([0, -240], [0, 240]), stroke(color, 1.5, { o: still(35) })]),
    ], {}, op),
  );
  // rastro da varredura: fatias com opacidade decrescente
  const trail = [];
  for (let i = 0; i < 14; i++) {
    const a0 = (-i * 3 * Math.PI) / 180;
    const a1 = (-(i + 1) * 3 * Math.PI) / 180;
    const R = 230;
    trail.push(
      group([
        polyline([[0, 0], [Math.cos(a0) * R, Math.sin(a0) * R], [Math.cos(a1) * R, Math.sin(a1) * R]], true),
        fill(color, Math.max(0, 55 - i * 4)),
      ]),
    );
  }
  L.push(
    layer(3, "sweep", [
      group([line([0, 0], [230, 0]), stroke(color, 3)]),
      ...trail,
    ], { r: anim([[0, 0], [op, 720]]) }, op),
  );
  const blips = [
    [120, -60, 30],
    [-80, 140, 70],
    [-150, -90, 100],
  ];
  blips.forEach(([x, y, t], i) => {
    L.push(
      layer(10 + i, `blip-${i}`, [group([ellipse(16), fill(color)]), group([ellipse(16), stroke(color, 2)], { s: anim([[t, [100, 100]], [t + 24, [380, 380]]]), o: anim([[t, 100], [t + 24, 0]]) })], {
        p: still([256 + x, 256 + y, 0]),
        o: anim([[t, 0], [t + 2, 100], [t + 40, 25]]),
      }, op),
    );
  });
  return comp(name, op, L.reverse());
};

// 3) Pulso: três ondas concêntricas expandindo (marcador de mapa / impacto)
const pulse = (color, name) => {
  const op = 60;
  const L = [];
  [0, 12, 24].forEach((d, i) => {
    L.push(
      layer(i + 1, `wave-${i}`, [group([ellipse(120), stroke(color, 4)])], {
        s: anim([[d, [20, 20, 100]], [d + 36, [400, 400, 100]]]),
        o: anim([[d, 100], [d + 36, 0]]),
      }, op),
    );
  });
  L.push(layer(9, "core", [group([ellipse(40), fill(color)])], { s: anim([[0, [0, 0, 100]], [8, [120, 120, 100]], [14, [100, 100, 100]]]) }, op));
  return comp(name, op, L.reverse());
};

// 4) Barras de carregamento/scan (cabeçalho HUD): 5 barras que sobem em cascata
const bars = (color, name) => {
  const op = 60;
  const L = [];
  for (let i = 0; i < 5; i++) {
    const x = -120 + i * 60;
    L.push(
      layer(i + 1, `bar-${i}`, [
        group([{ ty: "rc", p: still([0, 0]), s: still([36, 200]), r: still(2) }, fill(color)]),
      ], {
        p: still([256 + x, 356, 0]),
        a: still([0, 100, 0]),
        s: anim([[i * 4, [100, 0, 100]], [i * 4 + 16, [100, 100 - i * 12, 100]], [i * 4 + 30, [100, 40 + i * 9, 100]], [i * 4 + 46, [100, 100 - i * 6, 100]]]),
      }, op),
    );
  }
  return comp(name, op, L);
};

const palette = { gold: "#F2B630", red: "#E2362B", white: "#E9EEF1" };

// apenas as animações usadas no vídeo (radar() e bars() ficam disponíveis para outros capítulos)
const outputs = [
  ["reticle-white", reticle(palette.white, "reticle-white")],
  ["reticle-red", reticle(palette.red, "reticle-red")],
  ["pulse-gold", pulse(palette.gold, "pulse-gold")],
  ["pulse-red", pulse(palette.red, "pulse-red")],
];
for (const f of fs.readdirSync(OUT)) fs.unlinkSync(path.join(OUT, f));
for (const [name, data] of outputs) fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(data));
console.log(fs.readdirSync(OUT).join("\n"));
