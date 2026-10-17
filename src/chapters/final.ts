import speech from "../data/ch/speech_final.json";
import type { ChapterDef } from "../kit/types";

// FINAL — fontes, like/inscrição e comunidade MOBERISK (sem cartela de capítulo)
export const final: ChapterDef = {
  id: "Final",
  num: "",
  title: "",
  narration: "audio/ch_final.mp3",
  narrDur: 12.75,
  speech: speech as [number, number][],
  music: { src: "music/bed_b.mp3", offset: 60 },
  cardFor: 0.5,
  beats: [
    // "All the sources are in the description, so you can check the details."
    { kind: "sources", at: -0.5 },
    // "If you liked the video, leave a like and subscribe to the channel."
    { kind: "cta", at: 3.2, likeAt: 4.75, subAt: 5.5 },
    // "Oh, and come join our community at Moberisk. Head over to Moberisk.com..."
    { kind: "brand", at: 6.5, urlAt: 9.5 },
  ],
  sfx: [
    { src: "sfx/hud_1.mp3", at: 4.75, volume: 0.4 },
    { src: "sfx/hud_2.mp3", at: 5.5, volume: 0.36 },
    { src: "sfx/boom_2.mp3", at: 6.6, volume: 0.32 },
  ],
};
