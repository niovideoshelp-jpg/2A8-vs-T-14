import speech from "../data/ch/speech_1.json";
import type { ChapterDef } from "../kit/types";

// 01 · THE CONCEPT — projeto, tripulação e por que comparar os modelos certos
export const ch1: ChapterDef = {
  id: "Ch1",
  num: "01",
  title: "The Concept",
  narration: "audio/ch_1.mp3",
  narrDur: 112.59,
  speech: speech as [number, number][],
  music: { src: "music/bed_a.mp3", offset: 0 },
  beats: [
    // "...we need to understand the concept behind each machine."
    { kind: "stage", at: 1.2 },
    // "The Leopard 2A8,"
    { kind: "tank", at: 5.3, tank: "leo", title: true },
    // "built by KNDS Deutschland in partnership with Rheinmetall,"
    { kind: "photo", at: 6.75, src: "leo2a8_expo.jpg", label: "KNDS + Rheinmetall", grade: "warm", move: { fromScale: 1.04, toScale: 1.16, fromX: -1, toX: 1 } },
    // "...formally presented to the Bundeswehr ... in Munich"
    { kind: "map", at: 10.6, center: [10.4, 51.0], scale: 5600, countries: [{ id: "276", color: "de", at: 11.2 }], cities: [{ name: "Munich", lon: 11.58, lat: 48.14, side: "de", at: 15.0 }] },
    // "on November 19th, 2025"
    { kind: "number", at: 16.4, value: "2025", caption: "November 19", side: "de", src: "leo2a8_trophy_photo.jpg" },
    // "the first completely new tank built for the German army since 1992"
    { kind: "photo", at: 19.2, src: "hist_leo2a4.jpg", label: "Leopard 2", year: "1992", side: "de", grade: "mono" },
    // "the classic four-man crew - commander, gunner, human loader, and driver"
    {
      kind: "list",
      at: 27.6,
      title: "4 crew",
      img: "c1_crew.jpg",
      items: [
        { t: "Commander", at: 28.6, side: "de" },
        { t: "Gunner", at: 30.55, side: "de" },
        { t: "Loader", at: 31.25, side: "de" },
        { t: "Driver", at: 32.0, side: "de" },
      ],
    },
    // "but it digitizes the entire internal architecture,"
    { kind: "blueprint", at: 33.2, tank: "leo" },
    // "active protection against missiles and drones."
    { kind: "tank", at: 36.0, tank: "leo", callouts: [{ at: 37.2, title: "Trophy APS", fx: 0.754, fy: 0.27, dx: -110, dy: -215, align: "left" }] },
    // "differences between vehicles built for different customers. The Norwegian version,"
    {
      kind: "map",
      at: 40.4,
      center: [12, 57],
      scale: 2300,
      countries: [
        { id: "276", color: "de", at: 40.6 },
        { id: "578", color: "neutral", at: 44.0 },
      ],
      cities: [{ name: "Norway", lon: 10.75, lat: 61.5, side: "de", at: 44.1 }],
    },
    // "got its own communications and integration equipment,"
    { kind: "photo", at: 46.0, src: "c1_norway.jpg", label: "Norway", side: "de", grade: "cold" },
    // "...shouldn't automatically be assumed for every Leopard 2A8."
    { kind: "tank", at: 49.0, tank: "leo" },
    // "The T-14 Armata was developed by Uralvagonzavod,"
    { kind: "tank", at: 55.1, tank: "t14", title: true },
    // "part of the Russian state conglomerate Rostec."
    { kind: "map", at: 57.4, view: "wide", countries: [{ id: "643", color: "ru", at: 57.6 }], cities: [{ name: "Uralvagonzavod", lon: 59.97, lat: 57.92, side: "ru", at: 58.0 }] },
    // "first shown ... at the Victory Day Parade in Moscow in May 2015,"
    { kind: "photo", at: 61.1, src: "c1_t14_2015.jpg", label: "Moscow", year: "2015", side: "ru", grade: "cold" },
    // "which is 10 years before the Leopard 2A8."
    { kind: "versus", at: 65.7, de: { value: "2025" }, ru: { value: "2015" } },
    // "It broke with everything ... since the T-64."
    { kind: "photo", at: 69.0, src: "c1_t64.jpg", label: "T-64", side: "ru", grade: "mono" },
    // "three crew members squeezed on top of an ammunition carousel waiting to blow up,"
    { kind: "photo", at: 73.8, src: "c1_t72_turret.jpg", label: "T-72", side: "ru", grade: "neutral", move: { fromScale: 1.18, toScale: 1.04 } },
    // "the three soldiers sit isolated in an armored capsule at the front of the hull."
    { kind: "capsule", at: 78.7, crewAt: 80.4 },
    // "They operate the turret remotely ... and an autoloader feeds the gun."
    {
      kind: "tank",
      at: 82.75,
      tank: "t14",
      callouts: [
        { at: 83.4, title: "Unmanned turret", fx: 0.57, fy: 0.27, dx: 150, dy: -170, align: "right" },
        { at: 85.9, title: "Autoloader", fx: 0.5, fy: 0.5, dx: -170, dy: 330, align: "left" },
      ],
    },
    // "We also need to compare the right models."
    { kind: "stage", at: 87.6 },
    // "A Leopard 2A4 destroyed in Ukraine..."
    { kind: "photo", at: 90.3, src: "c1_leo2_ukraine.jpg", label: "Leopard 2A4", year: "Ukraine", side: "de", grade: "neutral" },
    // "but these are different versions, even though they're in the same family."
    { kind: "split", at: 99.2, same: "de", de: { src: "c1_leo2_ukraine.jpg", label: "2A4" }, ru: { src: "leo2a8_expo.jpg", label: "2A8" }, ruAt: 99.8 },
    // "an explosion involving a T-72 doesn't prove the Armata..."
    { kind: "photo", at: 103.3, src: "hist_t72.jpg", label: "T-72", side: "ru", grade: "neutral" },
    { kind: "tank", at: 107.4, tank: "t14" },
    // "The designs and configurations are different."
    { kind: "stage", at: 110.2 },
  ],
  sfx: [
    { src: "sfx/hud_3.mp3", at: 28.6, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 30.55, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 31.25, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 32.0, volume: 0.26 },
    { src: "sfx/hud_1.mp3", at: 37.2, volume: 0.24 },
    { src: "sfx/radar.mp3", at: 15.0, volume: 0.18 },
    { src: "sfx/radar.mp3", at: 58.0, volume: 0.18 },
    { src: "sfx/boom_2.mp3", at: 65.7, volume: 0.3 },
    { src: "sfx/hud_2.mp3", at: 80.4, volume: 0.28 },
    { src: "sfx/lockon.mp3", at: 83.2, volume: 0.14 },
    { src: "sfx/turret.mp3", at: 85.6, volume: 0.16 },
  ],
};
