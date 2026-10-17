# Leopard 2A8 × T-14 Armata — Intro (motion)

Intro de ~1 min 48 s do vídeo **Leopard 2A8 vs T-14 Armata** (narração em inglês), editada em código com
[Remotion](https://www.remotion.dev), `@remotion/gsap` (timelines GSAP sincronizadas ao frame)
e `@remotion/lottie` (retícula de mira e marcadores do mapa). Trilha e efeitos sonoros gerados na Magnific.

- **Formato:** 1920×1080 · 30 fps · H.264 · áudio AAC 320 kbps · master em −14 LUFS
- **Composição:** `Intro` (3240 frames)

## Direção de arte

Documentário militar escuro e cinematográfico. Cada lado tem sua cor — **dourado = Alemanha /
Leopard 2A8**, **vermelho = Rússia / T-14** — e as cenas de comparação usam essa divisão espacial
(Leopard à esquerda, T-14 à direita). Tipografia: Oswald (títulos), Barlow Condensed (rótulos) e
JetBrains Mono (anos).

**Regra de texto:** a narração é em inglês e o texto na tela aparece só para identificar nomes,
lugares, datas, números importantes ou destacar uma informação essencial — nada de frases que
repetem a narração nem elementos decorativos sem função narrativa.

## Roteiro visual (tempos da narração)

| Narração | Cena | Visual |
|---|---|---|
| 0:00–0:14 | `S1ColdOpen` | Leopard em campo (letterbox), retícula Lottie trava no alvo + disparo, triângulo FIREPOWER / PROTECTION / MOBILITY, soldado à frente do tanque |
| 0:14–0:27 | `S2Legacy` | Mapa Berlin ↔ Moscow, linha do tempo dupla 1940→2023 (T-34 … Leopard 2A8), tela dividida |
| 0:27–0:32 | `S3Philosophies` | Silhuetas dos dois tanques avançando "head to head", bandeiras |
| 0:32–0:44 | `S4Leopard` | Leopard 2A8, 40+ years (1979–2023), ≈70 tons, 120 mm L55A1 / Trophy APS / 1,500 hp |
| 0:44–0:56 | `S5Armata` | T-14 Armata, unmanned turret (retícula), diagrama → armored crew capsule |
| 0:56–1:10 | `S6Hype` | Folheto e fórum ilustrativos, balança pendendo para o T-14, Leopard 2 1979 (filme antigo), T-14 "holográfico" 4th generation |
| 1:10–1:17 | `S7Reality` | Música corta; um projétil perfurante atravessa o folheto → título LEOPARD 2A8 VS T-14 ARMATA |
| 1:17–1:35 | `S8Method` | MARKETING × PHYSICS, os 6 temas (logística em destaque), desenho técnico com cotas |
| 1:35–fim | `S9Outro` | Sources in the description, like animado, assinatura final no hit da música |

A narração entra 1 s após o início (abertura). Todos os tempos ficam em
[`src/timeline.ts`](src/timeline.ts) — `N(segundos)` converte um tempo da narração em frame.

## Áudio

- **Narração** normalizada para −16 LUFS (`public/audio/narracao.mp3`).
- **Trilha:** 3 cues (tensão → versus épico → resolução). O cue B é cortado seco em
  "But on a real battlefield…" e o hit final do cue C cai em "…helps the channel".
- **Ducking automático:** `src/data/speech.json` (mapa de fala, gerado por detecção de silêncio)
  controla o volume — a trilha fica baixa sob a voz e "respira" nas pausas; os efeitos também
  abaixam ~3 dB durante a fala. Margem média voz/trilha na faixa da fala: ~18 dB.
- **SFX** em `public/sfx/` (whooshes, impactos, canhão, motor, bipes, riser, glitch, radar…).

## Editar

```bash
npm ci
npm run dev        # Remotion Studio em http://localhost:3000
```

Na nuvem: **Code → Codespaces → Create codespace** (o `.devcontainer` instala ffmpeg, Chrome e
dependências) e rode `npm run dev`; a porta 3000 abre o Studio no navegador.

## Renderizar

Local:

```bash
npm run build      # render + masterização → out/Intro_2A8_vs_T14.mp4
```

Na nuvem: cada push na `main` (ou **Actions → Renderizar vídeo → Run workflow**) renderiza no
GitHub Actions e publica o MP4 como artefato da execução.

Outros scripts: `npm run stills` (quadros de conferência), `npm run lottie` (regera os JSON
Lottie), `npm run transcribe` (Whisper em inglês → `src/data/captions.json`).

## Créditos

Fotos, fontes e dados de mapa: veja [CREDITS.md](CREDITS.md).
