import speech from "../data/ch/speech_5.json";
import type { ChapterDef } from "../kit/types";

// 05 · PROTECTION — cápsula, blindagem, Trophy × Afganit, drones
export const ch5: ChapterDef = {
  id: "Ch5",
  num: "05",
  title: "Protection",
  narration: "audio/ch_5.mp3",
  narrDur: 244.35,
  speech: speech as [number, number][],
  music: { src: "music/bed_b.mp3", offset: 15 },
  beats: [
    // "When it comes to protection, the T-14 stands out for its crew capsule."
    { kind: "capsule", at: 0.9, crewAt: 2.6 },
    // "The idea is to separate the crew from the weapon compartment and the ammunition."
    {
      kind: "tank",
      at: 4.2,
      tank: "t14",
      callouts: [
        { at: 4.9, title: "Crew", fx: 0.33, fy: 0.42, dx: -60, dy: 320, align: "left" },
        { at: 7.0, title: "Ammunition", fx: 0.55, fy: 0.55, dx: 120, dy: 260, align: "right" },
      ],
    },
    // "If a projectile gets through the armor and hits the ammunition ... far more severe."
    { kind: "photo", at: 8.5, src: "c1_t72_turret.jpg", grade: "neutral", move: { fromScale: 1.2, toScale: 1.05 } },
    // "In my assessment, that's the strongest argument in the Armata's favor."
    { kind: "tank", at: 17.6, tank: "t14", title: true },
    // "The separation has the potential to improve the crew's chances of survival..."
    { kind: "capsule", at: 21.5, crewAt: 22.2 },
    // "The program's limited track record doesn't erase the merit of that solution."
    { kind: "photo", at: 28.0, src: "t14_parade_a.jpg", grade: "cold" },
    // "The caution is about how much we can claim for it."
    { kind: "blueprint", at: 32.0, tank: "t14" },
    // "We don't have a public series of tests..."
    { kind: "photo", at: 34.9, src: "c1_t14_2015.jpg", grade: "mono" },
    // "...premature to treat it as a guarantee of survival from any hit."
    { kind: "tank", at: 42.5, tank: "t14" },
    // "We also have to separate crew survival from the ability to keep fighting."
    {
      kind: "list",
      at: 47.0,
      img: "c1_t72_turret.jpg",
      items: [
        { t: "Crew survival", at: 47.7, side: "ru" },
        { t: "Ability to keep fighting", at: 49.4, side: "ru" },
      ],
    },
    // "...while the tank loses its ability to move, observe, or fire."
    {
      kind: "list",
      at: 51.0,
      img: "c1_t72_turret.jpg",
      items: [
        { t: "Move", at: 53.6 },
        { t: "Observe", at: 55.8 },
        { t: "Fire", at: 56.6 },
      ],
    },
    // "The Leopard 2A8 got armor upgrades but keeps its crew in the turret."
    { kind: "tank", at: 57.4, tank: "leo", callouts: [{ at: 59.4, title: "Crew in the turret", fx: 0.42, fy: 0.2, dx: -120, dy: -180, align: "left" }] },
    // "Comparing the protection of the two runs into a limitation, though."
    { kind: "stage", at: 61.4 },
    // "We don't know their compositions and full protection levels in the detail we'd need."
    { kind: "versus", at: 64.7, title: "Armor composition", de: { value: "?" }, ru: { value: "?" } },
    // "And armor is more complicated than a single number suggests."
    { kind: "blueprint", at: 68.9, tank: "leo" },
    // "The materials, how they're layered, and the geometry of the protection..."
    {
      kind: "list",
      at: 72.5,
      img: "leo2a8_trophy_photo.jpg",
      items: [
        { t: "Materials", at: 72.6 },
        { t: "Layering", at: 73.3 },
        { t: "Geometry", at: 74.3 },
      ],
    },
    // "That's why comparing millimeters of steel equivalent..."
    { kind: "photo", at: 78.4, src: "c3_sabot.jpg", grade: "neutral", position: "50% 30%" },
    { kind: "photo", at: 83.0, src: "c3_apfsds.jpg", grade: "neutral" },
    // "Trophy adds another layer of protection to the Leopard."
    { kind: "tank", at: 87.8, tank: "leo", callouts: [{ at: 88.6, title: "Trophy APS", fx: 0.754, fy: 0.27, dx: -110, dy: -215, align: "left" }] },
    // "It tries to neutralize certain threats before they hit the armor ... radars ... fires a countermeasure."
    { kind: "intercept", at: 91.5, detectAt: 96.0, fireAt: 101.5, label: "Trophy" },
    // "...four radar sensors and two launchers."
    { kind: "number", at: 103.2, value: "4", unit: "radars", side: "de", src: "leo2a7_trophy.jpg" },
    { kind: "number", at: 106.6, value: "2", unit: "launchers", side: "de", src: "leo2a7_trophy.jpg" },
    // "Think of a goalkeeper intercepting the ball before it reaches the net."
    { kind: "photo", at: 108.4, src: "c5_goalkeeper.jpg", grade: "neutral", move: { fromScale: 1.04, toScale: 1.14 } },
    // "The image helps explain active protection, as long as we respect one limit."
    { kind: "tank", at: 112.2, tank: "leo" },
    // "Being able to intercept one category of threat doesn't mean being able to handle every other one."
    { kind: "photo", at: 116.3, src: "c3_9m112.jpg", grade: "neutral" },
    // "Trophy has a record of real-world use with Israeli forces."
    { kind: "photo", at: 121.6, src: "c5_trophy_op.jpg", label: "Trophy", year: "Israel", side: "de", grade: "warm" },
    // "The Bundeswehr itself cites that experience as one of the reasons it chose the system."
    { kind: "photo", at: 125.1, src: "leo2a7_trophy.jpg", grade: "cold" },
    // "But that history belongs to the protection system."
    { kind: "tank", at: 129.5, tank: "leo" },
    // "It isn't enough to present the Leopard 2A8 as a tank already tested in war."
    { kind: "photo", at: 132.4, src: "leo2_firing.jpg", grade: "mono" },
    // "On the Armata, the proposal combines the Afghanit active protection system with reactive armor and passive protection."
    {
      kind: "list",
      at: 137.9,
      img: "t14_side.jpg",
      items: [
        { t: "Afganit APS", at: 138.7, side: "ru" },
        { t: "Reactive armor", at: 141.4, side: "ru" },
        { t: "Passive protection", at: 143.0, side: "ru" },
      ],
    },
    // "Rostec makes very broad claims about what that package can do."
    { kind: "photo", at: 144.8, src: "t14_expo.jpg", grade: "neutral" },
    // "The broader the promise, the stronger the proof needs to be."
    { kind: "blueprint", at: 148.6, tank: "t14" },
    // "...no public base of testing and operational use for Afghanit comparable to Trophy's documented record."
    { kind: "split", at: 151.6, de: { src: "c5_trophy_op.jpg", label: "Trophy" }, ru: { src: "t14_side.jpg", label: "Afganit" }, ruAt: 154.5 },
    // "For our duel, there's one especially important distinction."
    { kind: "stage", at: 161.0 },
    // "Intercepting an anti-tank missile doesn't show that a system can stop a kinetic penetrator fired by another tank."
    {
      kind: "list",
      at: 164.9,
      img: "c3_sabot.jpg",
      items: [
        { t: "Anti-tank missile", at: 165.6 },
        { t: "Kinetic penetrator", at: 168.0 },
      ],
    },
    // "They're physically different threats..."
    { kind: "photo", at: 171.2, src: "c3_apfsds.jpg", grade: "neutral", move: { fromScale: 1.2, toScale: 1.06 } },
    // "So we can't count on Trophy as a guaranteed block against the T-14's shots."
    { kind: "stage", at: 175.8, focus: "ru" },
    // "The same caution applies to the idea that Afghanit would neutralize the Leopard's ammunition."
    { kind: "stage", at: 180.8, focus: "de" },
    // "With drones, we need to look closely at what's being advertised."
    { kind: "photo", at: 185.2, src: "c5_fpv_strike.jpg", grade: "neutral" },
    // "EuroTrophy promotes counter drone capabilities and coverage against top-down threats."
    { kind: "photo", at: 189.9, src: "leo2a7_trophy.jpg", label: "EuroTrophy", side: "de", grade: "cold" },
    // "So simply saying Trophy can't handle drones would also be wrong."
    { kind: "intercept", at: 194.8, detectAt: 195.4, fireAt: 197.6, threat: "drone" },
    // "But that claim has to be understood within its limits."
    { kind: "stage", at: 198.9 },
    // "The type of drone, the approach path, the system configuration, and the conditions of use..."
    {
      kind: "list",
      at: 202.0,
      img: "c5_fpv.jpg",
      items: [
        { t: "Drone type", at: 202.1 },
        { t: "Approach path", at: 203.45 },
        { t: "Configuration", at: 204.6 },
        { t: "Conditions of use", at: 205.9 },
      ],
    },
    // "Showing an interception against one particular threat doesn't prove protection against all the others."
    { kind: "stage", at: 208.9 },
    // "Defense depends on a combination of measures from the vehicle itself and from the unit operating with it."
    { kind: "photo", at: 216.0, src: "c1_norway_range.jpg", grade: "cold" },
    // "In the 2025 study ... researcher Léo Péria-Peigné of IFRI ..."
    { kind: "number", at: 221.4, value: "2025", caption: "IFRI study", side: "de", src: "c5_fpv_strike.jpg" },
    // "...looks at how the war in Ukraine has changed the way armor is used."
    { kind: "map", at: 227.0, center: [32, 49], scale: 3400, countries: [{ id: "804", color: "neutral", at: 229.0 }], cities: [{ name: "Ukraine", lon: 31.2, lat: 49.2, side: "de", at: 229.6 }] },
    // "Drones have raised the demands for protection and coordination."
    { kind: "photo", at: 233.9, src: "c5_fpv.jpg", grade: "neutral" },
    // "...tanks still perform roles that have to be assessed alongside the work of the other forces..."
    { kind: "photo", at: 237.2, src: "leo2_soldier.jpg", grade: "cold" },
  ],
  sfx: [
    { src: "sfx/hud_2.mp3", at: 2.6, volume: 0.26 },
    { src: "sfx/hud_1.mp3", at: 4.9, volume: 0.24 },
    { src: "sfx/hud_1.mp3", at: 7.0, volume: 0.24 },
    { src: "sfx/hud_2.mp3", at: 22.2, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 47.7, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 49.4, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 53.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 55.8, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 56.6, volume: 0.24 },
    { src: "sfx/hud_1.mp3", at: 59.4, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 72.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 73.3, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 74.3, volume: 0.24 },
    { src: "sfx/hud_1.mp3", at: 88.6, volume: 0.24 },
    { src: "sfx/radar.mp3", at: 96.0, volume: 0.2 },
    { src: "sfx/lockon.mp3", at: 97.0, volume: 0.14 },
    { src: "sfx/cannon_2.mp3", at: 101.5, volume: 0.18 },
    { src: "sfx/boom_2.mp3", at: 101.8, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 138.7, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 141.4, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 143.0, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 165.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 168.0, volume: 0.24 },
    { src: "sfx/radar.mp3", at: 195.4, volume: 0.18 },
    { src: "sfx/boom_2.mp3", at: 197.9, volume: 0.22 },
    { src: "sfx/hud_3.mp3", at: 202.1, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 203.45, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 204.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 205.9, volume: 0.24 },
    { src: "sfx/radar.mp3", at: 229.6, volume: 0.16 },
  ],
};
