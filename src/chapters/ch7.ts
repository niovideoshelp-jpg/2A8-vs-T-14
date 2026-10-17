import speech from "../data/ch/speech_7.json";
import type { ChapterDef } from "../kit/types";

// 07 · THE VERDICT — escolha final
export const ch7: ChapterDef = {
  id: "Ch7",
  num: "07",
  title: "The Verdict",
  narration: "audio/ch_7.mp3",
  narrDur: 104.52,
  speech: speech as [number, number][],
  music: { src: "music/bed_a.mp3", offset: 45 },
  beats: [
    // "So if we put the two head to head, who would win?"
    { kind: "stage", at: 0.9 },
    // "We don't have enough data to call the outcome of that fight."
    { kind: "versus", at: 3.2, title: "Winner", de: { value: "?" }, ru: { value: "?" } },
    // "...who spotted the other first, each tank's position, the ammunition on hand, and the terrain."
    {
      kind: "list",
      at: 6.0,
      img: "leo2_forest.jpg",
      items: [
        { t: "Who spots first", at: 8.2 },
        { t: "Position", at: 10.8 },
        { t: "Ammunition", at: 12.2 },
        { t: "Terrain", at: 13.3 },
      ],
    },
    // "Still, we can pick which of the two makes the more convincing package..."
    { kind: "stage", at: 14.6 },
    // "And on that score, my champion is the Leopard 2A8."
    { kind: "champion", at: 21.5 },
    // "...it rests on a foundation that already exists."
    { kind: "photo", at: 24.5, src: "leo2a8_trophy_photo.jpg", grade: "warm" },
    // "Its gun has a documented history of qualification and integration, and its ammunition options are identified."
    {
      kind: "list",
      at: 30.0,
      img: "c3_gun_leo2e.jpg",
      items: [
        { t: "Qualified gun", at: 30.1, side: "de" },
        { t: "Identified ammunition", at: 33.8, side: "de" },
      ],
    },
    // "Trophy adds active protection with real combat experience..."
    { kind: "photo", at: 36.2, src: "c5_trophy_op.jpg", label: "Trophy", side: "de", grade: "warm" },
    // "The deliveries, support contracts, and industrial investments..."
    {
      kind: "list",
      at: 42.2,
      img: "leo2a7_rail.jpg",
      items: [
        { t: "Deliveries", at: 42.3, side: "de" },
        { t: "Support contracts", at: 43.1, side: "de" },
        { t: "Industrial investments", at: 44.0, side: "de" },
      ],
    },
    // "The Armata stands out for the ambition of its crew protection design."
    { kind: "tank", at: 50.6, tank: "t14", title: true },
    // "The remote turret, the separate capsule, and the autoloader..."
    { kind: "capsule", at: 54.3, turretAt: 54.4, crewAt: 55.3 },
    // "What's still missing is enough public proof..."
    { kind: "blueprint", at: 60.2, tank: "t14" },
    // "So some questions remain without a proven winner."
    { kind: "stage", at: 68.0 },
    // "We can't say which has greater penetration, how each one's armor would hold up ..., or who would come out on top..."
    {
      kind: "list",
      at: 70.9,
      img: "c3_apfsds.jpg",
      items: [
        { t: "Penetration?", at: 71.0 },
        { t: "Armor vs ammunition?", at: 73.1 },
        { t: "One-on-one duel?", at: 76.7 },
      ],
    },
    // "My preference for the Leopard comes from ... qualified weaponry, documented active protection, and a support structure."
    {
      kind: "list",
      at: 79.5,
      img: "leo2a8_trophy_photo.jpg",
      items: [
        { t: "Qualified weaponry", at: 81.0, side: "de" },
        { t: "Documented active protection", at: 83.5, side: "de" },
        { t: "Support structure", at: 85.2, side: "de" },
      ],
    },
    // "That's the package I'd trust most based on the evidence gathered in this research."
    { kind: "tank", at: 86.7, tank: "leo" },
    // "If the T-14 shows regular operation, availability, and verifiable results ... reason to revisit this pick."
    {
      kind: "list",
      at: 90.8,
      img: "t14_parade_a.jpg",
      items: [
        { t: "Regular operation", at: 91.6, side: "ru" },
        { t: "Availability", at: 93.3, side: "ru" },
        { t: "Verifiable results", at: 94.1, side: "ru" },
      ],
    },
    // "Until then, I consider the Leopard 2A8 the most defensible champion of this comparison."
    { kind: "champion", at: 99.2 },
  ],
  sfx: [
    { src: "sfx/boom_2.mp3", at: 3.2, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 8.2, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 10.8, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 12.2, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 13.3, volume: 0.24 },
    { src: "sfx/riser.mp3", at: 17.6, volume: 0.22 },
    { src: "sfx/boom_1.mp3", at: 21.6, volume: 0.45 },
    { src: "sfx/hud_3.mp3", at: 30.1, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 33.8, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 42.3, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 43.1, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 44.0, volume: 0.24 },
    { src: "sfx/hud_2.mp3", at: 55.3, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 71.0, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 73.1, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 76.7, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 81.0, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 83.5, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 85.2, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 91.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 93.3, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 94.1, volume: 0.24 },
    { src: "sfx/boom_1.mp3", at: 99.3, volume: 0.45 },
  ],
};
