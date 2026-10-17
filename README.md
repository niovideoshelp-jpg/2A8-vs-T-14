# Leopard 2A8 × T-14 Armata (motion)

Vídeo **Leopard 2A8 vs T-14 Armata** (narração em inglês) em 9 partes — a Intro, 7 capítulos e o
encerramento — editado em código com [Remotion](https://www.remotion.dev), `@remotion/gsap`
(timelines GSAP sincronizadas ao frame) e `@remotion/lottie` (retícula de mira e marcadores do mapa).
Trilha e efeitos sonoros gerados na Magnific. Cada parte é renderizada como um vídeo separado,
para juntar na montagem final.

- **Formato:** 1920×1080 · 30 fps · H.264 · áudio AAC 320 kbps · master em −14 LUFS
- **Composições:** `Intro` (3240 frames) e, na pasta `Capitulos`, `Ch1` … `Ch7` e `Final`

## Capítulos

Os capítulos usam um kit orientado a dados ([`src/kit/`](src/kit)): cada capítulo em
[`src/chapters/`](src/chapters) é uma lista de *beats* (foto, tanque com callouts, versus, número,
lista, mapa, datas, cápsula, desenho técnico…) marcados nos segundos da narração. O kit cuida dos
cortes, whooshes, ducking da trilha e da cartela de abertura (número + título).

| Composição | Título | Narração | Trilha |
|---|---|---|---|
| `Ch1` | 01 · The Concept | 1:53 | A |
| `Ch2` | 02 · Track Record | 2:05 | B |
| `Ch3` | 03 · Firepower | 2:44 | C |
| `Ch4` | 04 · Crew & Sensors | 3:44 | A |
| `Ch5` | 05 · Protection | 4:04 | B |
| `Ch6` | 06 · Mobility & Support | 3:46 | C |
| `Ch7` | 07 · The Verdict | 1:45 | A |
| `Final` | Fontes, like/inscrição, comunidade | 0:13 | B |

As três trilhas (`public/music/bed_a|b|c.mp3`) alternam entre os capítulos para dar estrutura
de assunto sem repetir a mesma música em sequência. Para renderizar e masterizar todos:

```bash
bash scripts/render-chapters.sh          # ou: bash scripts/render-chapters.sh Ch3 Ch5
```

## Direção de arte

Documentário militar escuro e cinematográfico. Cada lado tem sua cor — **dourado = Alemanha /
Leopard 2A8**, **vermelho = Rússia / T-14** — e as cenas de comparação usam essa divisão espacial
(Leopard à esquerda, T-14 à direita). Tipografia: **Oswald** em pesos grossos (600/700), carregada do Google Fonts via
`@remotion/google-fonts`, com tamanho mínimo de 52 px — nada de letras ou números pequenos.

**Regra de texto:** a narração é em inglês e o texto na tela aparece só para identificar nomes,
lugares, datas, números importantes ou destacar uma informação essencial — nada de frases que
repetem a narração, traços/sublinhados junto ao texto ou elementos decorativos sem função narrativa.

## Roteiro visual (tempos da narração)

| Narração | Cena | Visual |
|---|---|---|
| 0:00–0:14 | `S1ColdOpen` | Leopard em campo (letterbox), retícula Lottie trava no alvo + disparo, triângulo FIREPOWER / PROTECTION / MOBILITY, soldado à frente do tanque |
| 0:14–0:27 | `S2Legacy` | Mapa com Alemanha e Rússia acendendo (Berlin, Moscow), linha do tempo dupla 1940–2023 (T-34 … Leopard 2A8), tela dividida |
| 0:27–0:32 | `S3Philosophies` | Silhuetas dos dois tanques avançando "head to head", bandeiras |
| 0:32–0:44 | `S4Leopard` | Leopard 2A8, 40+ years (1979–2023), ≈70 tons, 120 mm L55A1 / Trophy APS / 1,500 hp |
| 0:44–0:56 | `S5Armata` | T-14 Armata, unmanned turret (retícula), diagrama → armored crew capsule |
| 0:56–1:10 | `S6Hype` | Folheto e fórum ilustrativos, desproporção "no papel" (T-14 cresce, Leopard encolhe), Leopard 2 1979 (filme antigo), T-14 "holográfico" 4th generation |
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

Na nuvem: cada push na `main` renderiza a Intro no GitHub Actions. Em **Actions → Renderizar vídeo →
Run workflow** dá para escolher qualquer parte (`Ch1` … `Final`) ou **Todos** — as partes rodam em
paralelo e cada MP4 sai como artefato da execução.

Outros scripts: `npm run stills` (quadros de conferência), `npm run lottie` (regera os JSON
Lottie), `npm run transcribe` (Whisper em inglês → `src/data/captions.json`).

## Créditos

Fotos, fontes e dados de mapa: veja [CREDITS.md](CREDITS.md). Os recortes dos tanques são limpos com
`tools/clean-cutout.mjs` (fora deste repositório): remove resíduos do fundo e suaviza a borda.
