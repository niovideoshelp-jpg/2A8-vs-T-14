import speech from "../data/ch/speech_2.json";
import type { ChapterDef } from "../kit/types";

// 02 · TRACK RECORD — entregas documentadas do 2A8 e as incertezas do programa T-14
const T14_CLAIMS = (extra: boolean) => [
  { date: "2015", text: "Unveiled", at: 42.9 },
  { date: "Dec 2020", text: "Deliveries in 2021", at: 49.6 },
  { date: "Jul 2023", text: "Ukraine, unconfirmed", at: 54.4 },
  ...(extra
    ? [
        { date: "Mar 2024", text: "Too expensive", at: 70.6 },
        { date: "Apr 2024", text: "Service by late 2024?", at: 84.0 },
      ]
    : []),
];

export const ch2: ChapterDef = {
  id: "Ch2",
  num: "02",
  title: "Track Record",
  narration: "audio/ch_2.mp3",
  narrDur: 125.15,
  speech: speech as [number, number][],
  music: { src: "music/bed_b.mp3", offset: 0 },
  beats: [
    // "KNDS presented the first Leopard 2A8s from the new production line in November 2025."
    { kind: "photo", at: 0.9, src: "leo2a8_trophy_photo.jpg", label: "Leopard 2A8", year: "2025", side: "de", grade: "warm" },
    // "On April 30th, 2026,"
    { kind: "number", at: 6.0, value: "2026", caption: "April 30", side: "de", src: "c1_norway_range.jpg" },
    // "...two vehicles had arrived at the Rena Garrison."
    { kind: "map", at: 8.3, center: [11.5, 61.5], scale: 4200, countries: [{ id: "578", color: "neutral", at: 8.5 }], cities: [{ name: "Rena", lon: 11.37, lat: 61.13, side: "de", at: 10.2 }] },
    { kind: "number", at: 11.0, value: "2", unit: "tanks", side: "de", src: "c1_norway.jpg" },
    // "The first vehicles would be used to train instructors and crews,"
    { kind: "photo", at: 16.4, src: "c1_crew.jpg", grade: "cold" },
    // "...first squadron-level unit ... expected in the second half of 2027."
    { kind: "number", at: 19.3, value: "2027", caption: "First squadron", side: "de", src: "c1_norway_range.jpg" },
    // "So there are documented deliveries,"
    { kind: "tank", at: 25.5, tank: "leo" },
    // "...doesn't let us present the 2A8 as a war veteran."
    { kind: "photo", at: 28.2, src: "leo2_firing.jpg", grade: "mono" },
    // "The experience built up by the Leopard family helps reduce risk,"
    { kind: "split", at: 31.9, same: "de", de: { src: "hist_leo1.jpg", label: "Leopard 1" }, ru: { src: "hist_leo2a4.jpg", label: "Leopard 2" }, ruAt: 32.6 },
    // "...the new configuration still has to prove it works as a complete system."
    { kind: "blueprint", at: 35.5, tank: "leo" },
    // "With the Armata, the public track record is harder to follow."
    { kind: "tank", at: 39.7, tank: "t14" },
    // "Unveiled in 2015 ... one forecast after another ... In December 2020 ... In July 2023 ..."
    { kind: "dates", at: 42.7, side: "ru", items: T14_CLAIMS(false) },
    // "That came from anonymous sources ... no official confirmation of that deployment."
    { kind: "photo", at: 59.7, src: "t14_column.jpg", grade: "mono" },
    // "In March 2024 ... too expensive ... The following month ... by the end of 2024 ..."
    { kind: "dates", at: 66.9, side: "ru", items: T14_CLAIMS(true) },
    // "...how many T-14s are available, in which units, or at what level of readiness."
    {
      kind: "list",
      at: 88.8,
      img: "t14_parade_b.jpg",
      items: [
        { t: "How many?", at: 89.5, side: "ru" },
        { t: "Which units?", at: 93.9, side: "ru" },
        { t: "Readiness?", at: 95.1, side: "ru" },
      ],
    },
    // "They also don't give us a verifiable record of sustained combat use."
    { kind: "photo", at: 97.0, src: "c1_t14_2015.jpg", grade: "mono" },
    // "...I couldn't find enough public documentation to fill in those gaps."
    { kind: "blueprint", at: 100.7, tank: "t14" },
    // "...without declaring that the program was canceled or that the vehicle can't fight."
    { kind: "tank", at: 106.4, tank: "t14" },
    // "...check the sources I leave in the description."
    { kind: "sources", at: 113.5 },
    // "I'd give the Leopard 2A8 a slight lead..."
    { kind: "stage", at: 117.1, focus: "de" },
  ],
  sfx: [
    { src: "sfx/radar.mp3", at: 10.2, volume: 0.18 },
    { src: "sfx/boom_2.mp3", at: 11.0, volume: 0.26 },
    { src: "sfx/hud_2.mp3", at: 42.9, volume: 0.26 },
    { src: "sfx/hud_2.mp3", at: 49.6, volume: 0.26 },
    { src: "sfx/hud_2.mp3", at: 54.4, volume: 0.26 },
    { src: "sfx/hud_2.mp3", at: 70.6, volume: 0.26 },
    { src: "sfx/hud_2.mp3", at: 84.0, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 89.5, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 93.9, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 95.1, volume: 0.26 },
    { src: "sfx/boom_2.mp3", at: 117.2, volume: 0.3 },
  ],
};
