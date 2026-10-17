import speech from "../data/ch/speech_3.json";
import type { ChapterDef } from "../kit/types";

// 03 · FIREPOWER — 120 mm × 125 mm, munições, alcance
export const ch3: ChapterDef = {
  id: "Ch3",
  num: "03",
  title: "Firepower",
  narration: "audio/ch_3.mp3",
  narrDur: 164.13,
  speech: speech as [number, number][],
  music: { src: "music/bed_c.mp3", offset: 0 },
  beats: [
    // "The Leopard 2A8 uses the Rheinmetall L55A1,"
    { kind: "tank", at: 0.9, tank: "leo", callouts: [{ at: 2.0, title: "Rheinmetall L55A1", fx: 0.975, fy: 0.05, dx: -10, dy: -160, align: "left" }] },
    // "a 120mm gun."
    { kind: "number", at: 4.2, value: "120", unit: "mm", side: "de", src: "c3_gun_leo2e.jpg" },
    // "The T-14 is presented with the 2A82-1M,"
    { kind: "tank", at: 6.5, tank: "t14", callouts: [{ at: 7.4, title: "2A82-1M", fx: 0.057, fy: 0.04, dx: 40, dy: -170, align: "right" }] },
    // "a 125mm gun."
    { kind: "number", at: 10.1, value: "125", unit: "mm", side: "ru", src: "c3_125_apfsds.jpg" },
    // "The difference is 5mm of caliber."
    { kind: "versus", at: 11.85, de: { value: "120", unit: "mm" }, ru: { value: "125", unit: "mm" } },
    // "On its own, that doesn't settle the argument."
    { kind: "stage", at: 15.0 },
    // "Think of a hammer and a nail."
    { kind: "photo", at: 18.1, src: "c3_hammer_nails.jpg", grade: "neutral", move: { fromScale: 1.04, toScale: 1.14 } },
    // "...depends on the energy of the blow, the nail's shape and strength, and how hard the wood is."
    { kind: "photo", at: 23.3, src: "c3_hammering.jpg", grade: "neutral" },
    // "Tanks work in a similar way."
    { kind: "photo", at: 31.1, src: "leo2_firing.jpg", grade: "cold" },
    // "Five extra millimeters of caliber ... don't guarantee more penetration."
    { kind: "number", at: 33.2, value: "+5", unit: "mm", side: "ru", src: "c3_gun_muzzle.jpg" },
    // "A modern armor-piercing round of the APFSDS type uses a long, narrow penetrator..."
    { kind: "photo", at: 37.6, src: "c3_apfsds.jpg", label: "APFSDS", side: "de", grade: "neutral", move: { fromScale: 1.1, toScale: 1.22, fromY: 2, toY: -2 } },
    // "...fired at high velocity."
    { kind: "photo", at: 41.7, src: "c3_sabot.jpg", grade: "neutral", position: "50% 35%" },
    // "Its performance depends on the material, the geometry, the impact velocity, and the armor it hits."
    {
      kind: "list",
      at: 44.8,
      img: "c3_apfsds.jpg",
      items: [
        { t: "Material", at: 45.6 },
        { t: "Geometry", at: 47.7 },
        { t: "Impact velocity", at: 48.45 },
        { t: "Target armor", at: 49.95 },
      ],
    },
    // "The gun's caliber is just one piece of that puzzle."
    { kind: "blueprint", at: 51.4, tank: "t14" },
    // "The L55A1 has a concrete advantage in the available documentation."
    { kind: "photo", at: 54.7, src: "c3_gun_leo2e.jpg", label: "L55A1", side: "de", grade: "neutral" },
    // "...qualified in late 2017 and ... installed on vehicles in user countries in 2018."
    {
      kind: "dates",
      at: 59.3,
      side: "de",
      items: [
        { date: "2017", text: "Qualified", at: 60.6 },
        { date: "2018", text: "Delivered and installed", at: 63.6 },
      ],
    },
    // "So the 2A8 gets a weapon whose development and integration started before the tank itself."
    { kind: "tank", at: 67.3, tank: "leo" },
    // "The Bundeswehr lists the DM73 ... and the DM11, a programmable high explosive round"
    {
      kind: "list",
      at: 72.9,
      img: "c3_leo_ammo.jpg",
      items: [
        { t: "DM73", at: 73.5, side: "de" },
        { t: "DM11", at: 78.0, side: "de" },
      ],
    },
    // "The DM11 widens the options ... programmed to detonate at exactly the right point along its flight path."
    { kind: "airburst", at: 83.7, label: "DM11", fireAt: 86.0, burstAt: 89.6 },
    // "Think of it like a timer, except here the control has to work under the extreme conditions..."
    { kind: "photo", at: 92.3, src: "c3_gun_muzzle.jpg", grade: "neutral", move: { fromScale: 1.0, toScale: 1.3 } },
    // "...a tank also supports infantry and takes on fortified positions or lighter vehicles."
    { kind: "photo", at: 98.4, src: "leo2_soldier.jpg", grade: "cold" },
    // "How useful it is depends on the ammunition available for each mission."
    { kind: "photo", at: 104.6, src: "c3_tank_fire.jpg", grade: "neutral" },
    // "On the Armata, the 125mm gun, the autoloader, and ... different types of ammunition..."
    {
      kind: "tank",
      at: 108.9,
      tank: "t14",
      callouts: [
        { at: 109.9, title: "125 mm", fx: 0.057, fy: 0.04, dx: 40, dy: -170, align: "right" },
        { at: 111.6, title: "Autoloader", fx: 0.5, fy: 0.5, dx: -170, dy: 330, align: "left" },
      ],
    },
    { kind: "photo", at: 114.3, src: "c3_125_apfsds.jpg", grade: "neutral", position: "50% 30%" },
    // "Rostec also advertises the use of guided munitions."
    { kind: "photo", at: 117.7, src: "c3_9m112.jpg", label: "Guided munitions", side: "ru", grade: "neutral", move: { fromScale: 1.08, toScale: 1.2, fromX: 2, toX: -2 } },
    // "...turn that description into an exact scorecard of superiority."
    { kind: "stage", at: 121.5 },
    // "...don't offer a reliable comparative test ... under the same conditions."
    { kind: "versus", at: 126.5, title: "Penetration", de: { value: "?" }, ru: { value: "?" } },
    // "...we can't claim that one of them punches through the other's front at a given distance."
    { kind: "stage", at: 135.2 },
    // "...we'd need information that hasn't been publicly demonstrated."
    { kind: "blueprint", at: 139.5, tank: "leo" },
    // "Even the word range needs care."
    { kind: "photo", at: 144.6, src: "leo2_move.jpg", grade: "cold" },
    // "...a maximum engagement distance of up to five kilometers for the 2A8's weapon."
    { kind: "number", at: 147.0, value: "5", unit: "km", side: "de", src: "leo2_firing.jpg" },
    // "That doesn't mean any target can be spotted, hit, and destroyed at that distance..."
    {
      kind: "list",
      at: 153.5,
      img: "leo2_forest.jpg",
      items: [
        { t: "Spotted", at: 154.0 },
        { t: "Hit", at: 156.0 },
        { t: "Destroyed", at: 156.5 },
      ],
    },
    // "Range, hit probability, and penetration capability are different measures."
    {
      kind: "list",
      at: 159.6,
      img: "leo2_firing.jpg",
      items: [
        { t: "Range", at: 159.7, side: "de" },
        { t: "Hit probability", at: 160.1, side: "de" },
        { t: "Penetration", at: 161.2, side: "de" },
      ],
    },
  ],
  sfx: [
    { src: "sfx/hud_1.mp3", at: 2.0, volume: 0.24 },
    { src: "sfx/hud_1.mp3", at: 7.4, volume: 0.24 },
    { src: "sfx/boom_2.mp3", at: 11.9, volume: 0.3 },
    { src: "sfx/hud_3.mp3", at: 45.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 47.7, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 48.45, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 49.95, volume: 0.24 },
    { src: "sfx/hud_2.mp3", at: 60.6, volume: 0.26 },
    { src: "sfx/hud_2.mp3", at: 63.6, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 73.5, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 78.0, volume: 0.26 },
    { src: "sfx/cannon_2.mp3", at: 86.0, volume: 0.22 },
    { src: "sfx/boom_2.mp3", at: 89.6, volume: 0.24 },
    { src: "sfx/hud_1.mp3", at: 109.9, volume: 0.24 },
    { src: "sfx/turret.mp3", at: 111.4, volume: 0.15 },
    { src: "sfx/boom_2.mp3", at: 147.0, volume: 0.26 },
  ],
};
