# Leopard 2A8 × T-14 Armata — Intro (motion)

Intro de ~1 min 48 s do vídeo **Leopard 2A8 vs T-14 Armata**, editada em código com
[Remotion](https://www.remotion.dev), `@remotion/gsap` (timelines GSAP sincronizadas ao frame)
e `@remotion/lottie` (animações HUD). Trilha e efeitos sonoros gerados na Magnific.

- **Formato:** 1920×1080 · 30 fps · H.264 · áudio AAC 320 kbps · master em −14 LUFS
- **Composição:** `Intro` (3240 frames)

## Direção de arte

Documentário militar "tático": fundo quase preto, grade técnica, molduras de HUD, grão de filme e
vinheta. Cada lado tem sua cor — **dourado = Alemanha / Leopard 2A8**, **vermelho = Rússia / T-14** —
e as cenas de comparação usam essa divisão espacial (Leopard à esquerda, T-14 à direita).
Tipografia: Oswald (títulos), Barlow Condensed (rótulos) e JetBrains Mono (dados).

## Roteiro visual (tempos da narração)

| Narração | Cena | Visual |
|---|---|---|
| 0:00–0:14 | `S1ColdOpen` | Leopard em campo (letterbox), retícula Lottie + disparo, "triângulo de ferro" (fogo/proteção/mobilidade), infantaria |
| 0:14–0:27 | `S2Legacy` | Mapa animado Berlim ↔ Moscou, linha do tempo dupla 1940→2023 (T-34 … Leopard 2A8), tela dividida |
| 0:27–0:32 | `S3Philosophies` | "Duas filosofias opostas de guerra", bandeiras frente a frente, riser |
| 0:32–0:44 | `S4Leopard` | Revelação do Leopard 2A8, 44 anos de engenharia, ≈70 t, callouts (canhão, Trophy, motor) |
| 0:44–0:56 | `S5Armata` | Revelação do T-14, torre não tripulada, diagrama de compartimentos → cápsula blindada |
| 0:56–1:10 | `S6Hype` | Folheto e fórum (ilustrativos), balança "quase injusta", Leopard da Guerra Fria, T-14 "holográfico" |
| 1:10–1:17 | `S7Reality` | Música corta, folheto rasga: "o papel não vence batalhas" → título principal |
| 1:17–1:35 | `S8Method` | Marketing × física, índice dos 6 temas (logística em destaque), metodologia |
| 1:35–fim | `S9Outro` | Fontes na descrição, like animado, assinatura final no hit da música |

A narração entra 1 s após o início (abertura). Todos os tempos ficam em
[`src/timeline.ts`](src/timeline.ts) — `N(segundos)` converte um tempo da narração em frame.

## Áudio

- **Narração** normalizada para −16 LUFS (`public/audio/narracao.mp3`).
- **Trilha:** 3 cues (tensão → versus épico → resolução). O cue B é cortado seco em
  "Mas em combate real…" e o hit final do cue C cai em "…ajuda o canal".
- **Ducking automático:** `src/data/speech.json` (mapa de fala, gerado por detecção de silêncio)
  controla o volume — a trilha fica baixa sob a voz e "respira" nas pausas; os efeitos também
  abaixam ~3 dB durante a fala. Margem média voz/trilha na faixa da fala: ~18 dB.
- **SFX** em `public/sfx/` (whooshes, impactos, canhão, motor, HUD, riser, glitch, radar…).

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
Lottie), `npm run transcribe` (Whisper → `src/data/captions.json`).

## Créditos

Fotos, fontes e dados de mapa: veja [CREDITS.md](CREDITS.md).
