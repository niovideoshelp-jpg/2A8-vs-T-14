import speech from "../data/ch/speech_4.json";
import type { ChapterDef } from "../kit/types";

// 04 · CREW & SENSORS — autocarregador, divisão de tarefas, sensores e rede
export const ch4: ChapterDef = {
  id: "Ch4",
  num: "04",
  title: "Crew & Sensors",
  narration: "audio/ch_4.mp3",
  narrDur: 223.56,
  speech: speech as [number, number][],
  music: { src: "music/bed_a.mp3", offset: 20 },
  beats: [
    // "The T-14's autoloader deserves a closer look."
    { kind: "tank", at: 0.8, tank: "t14", callouts: [{ at: 1.6, title: "Autoloader", fx: 0.5, fy: 0.5, dx: -170, dy: 330, align: "left" }] },
    // "It takes over a job that, in the Leopard, falls to a crew member, loading the gun."
    { kind: "split", at: 3.1, de: { src: "c1_crew.jpg", label: "Loader" }, ru: { src: "t14_top.jpg", label: "Autoloader" }, ruAt: 6.8 },
    // "That lets you shrink the crew,"
    { kind: "versus", at: 8.0, title: "Crew", de: { value: "4", count: 4 }, ru: { value: "3", count: 3 } },
    // "...the loading cycle doesn't depend directly on one person's physical effort."
    { kind: "photo", at: 9.5, src: "c3_leo_ammo.jpg", grade: "neutral", position: "50% 40%" },
    // "It's also part of what makes an unmanned turret possible on the Armata."
    { kind: "tank", at: 14.0, tank: "t14", callouts: [{ at: 15.0, title: "Unmanned turret", fx: 0.57, fy: 0.27, dx: 150, dy: -170, align: "right" }] },
    // "The Leopard's fourth crew member ... can pitch in on all kinds of tasks..."
    { kind: "photo", at: 17.8, src: "c1_crew.jpg", grade: "cold" },
    // "There's watch duty, resupply, and maintenance to share."
    {
      kind: "list",
      at: 23.4,
      img: "c4_maintenance.jpg",
      items: [
        { t: "Watch duty", at: 23.6, side: "de" },
        { t: "Resupply", at: 24.65, side: "de" },
        { t: "Maintenance", at: 25.2, side: "de" },
      ],
    },
    // "And that work still exists even when a machine handles the loading."
    { kind: "photo", at: 26.9, src: "c4_maintenance.jpg", grade: "cold" },
    // "So, automating that function is a trade-off."
    { kind: "stage", at: 30.3 },
    // "You need fewer people inside the tank, but ... fewer people to split the work..."
    { kind: "photo", at: 33.0, src: "c1_norway_range.jpg", grade: "cold" },
    // "The best solution depends on how the unit is organized and what support it gets."
    { kind: "photo", at: 38.8, src: "leo2_forest.jpg", grade: "cold" },
    // "I also wouldn't settle this debate with a promotional rate of fire."
    { kind: "photo", at: 42.8, src: "t14_expo.jpg", grade: "neutral" },
    // "In a demo, a tank can show it loads and fires quickly."
    { kind: "photo", at: 47.1, src: "leo2_firing.jpg", grade: "cold" },
    // "...the crew has to find the next target, figure out what they're looking at, and pick the right ammunition."
    {
      kind: "list",
      at: 50.3,
      img: "leo2_forest.jpg",
      items: [
        { t: "Find", at: 51.7 },
        { t: "Identify", at: 53.9 },
        { t: "Pick ammunition", at: 55.35 },
      ],
    },
    // "Only then can that loading speed make a difference."
    { kind: "tank", at: 57.0, tank: "t14" },
    // "That's why we also need to look at the tank's eyes."
    { kind: "photo", at: 59.8, src: "c4_peri.jpg", grade: "neutral", move: { fromScale: 1.0, toScale: 1.18 } },
    // "...stabilized observation equipment, thermal imaging, and a split of duties between commander and gunner."
    {
      kind: "list",
      at: 62.8,
      img: "c4_peri.jpg",
      items: [
        { t: "Stabilized optics", at: 63.3, side: "de" },
        { t: "Thermal imaging", at: 67.0, side: "de" },
        { t: "Commander + gunner", at: 68.1, side: "de" },
      ],
    },
    // "While the gunner deals with one target, the commander can look for the next one ... hunter-killer"
    { kind: "hunter", at: 70.8, findAt: 72.9, titleAt: 74.6 },
    // "Stabilization helps compensate for the vehicle's movement..."
    { kind: "photo", at: 85.1, src: "leo2_move.jpg", grade: "cold", move: { fromScale: 1.12, toScale: 1.12, fromX: -3, toX: 3 } },
    // "The thermal camera ... builds an image from differences in infrared radiation, so you can see at night, too."
    { kind: "photo", at: 91.3, src: "leo2_move.jpg", grade: "thermal", move: { fromScale: 1.12, toScale: 1.2 } },
    // "How well it performs depends on conditions and on the contrast ... It can't see through just any obstacle."
    { kind: "photo", at: 97.6, src: "c1_norway.jpg", grade: "thermal", move: { fromScale: 1.06, toScale: 1.18 } },
    // "The Armata was also designed with cameras, thermal equipment, and a highly automated fire control system."
    {
      kind: "list",
      at: 105.2,
      img: "t14_top.jpg",
      items: [
        { t: "Cameras", at: 105.9, side: "ru" },
        { t: "Thermal equipment", at: 107.6, side: "ru" },
        { t: "Automated fire control", at: 108.6, side: "ru" },
      ],
    },
    // "Rostec presents that integration as one of the project's core features,"
    { kind: "photo", at: 111.2, src: "t14_expo.jpg", grade: "neutral" },
    // "...which tank would spot a hard to see target first."
    { kind: "stage", at: 115.0 },
    // "...compare image quality, identification capability, and processing power, along with how well the crews perform..."
    {
      kind: "list",
      at: 120.4,
      items: [
        { t: "Image quality", at: 121.4 },
        { t: "Identification", at: 123.3 },
        { t: "Processing power", at: 124.9 },
        { t: "Crew performance", at: 126.4 },
      ],
    },
    // "On the T-14, the unmanned turret makes the sensors and the systems that relay the crew's commands especially important."
    { kind: "capsule", at: 129.6, turretAt: 131.1, crewAt: 133.6 },
    // "If any of them is damaged, the consequences depend on what redundancies are available."
    { kind: "blueprint", at: 137.2, tank: "t14" },
    // "Saying that a single damaged camera leaves the whole tank blind would be an oversimplification."
    { kind: "tank", at: 141.6, tank: "t14" },
    // "The Leopard also depends on electronics and external equipment."
    { kind: "blueprint", at: 147.7, tank: "leo" },
    // "For both designs, we need to ask how much combat capability remains when something fails."
    { kind: "stage", at: 151.0 },
    // "This comparison also has to include communication with other units."
    { kind: "photo", at: 156.6, src: "c1_norway_range.jpg", grade: "cold" },
    // "In the Norwegian Leopard configuration, digital integration lets the tank share information..."
    { kind: "photo", at: 161.2, src: "c1_norway.jpg", label: "Norway", side: "de", grade: "cold" },
    // "KNDS points to Kongsberg's ICS/Cortex as a differentiator for this version."
    { kind: "photo", at: 169.7, src: "c1_norway_range.jpg", label: "Kongsberg Cortex", side: "de", grade: "cold", move: { fromScale: 1.2, toScale: 1.08 } },
    // "According to Rostec's documentation, the Armata was also designed to operate in a network,"
    { kind: "tank", at: 175.6, tank: "t14" },
    // "Think of a cell phone. The features of the device matter,"
    { kind: "photo", at: 184.0, src: "c4_phone.jpg", grade: "neutral" },
    // "but communication also depends on the connection and on who's on the other end."
    { kind: "photo", at: 187.7, src: "c4_tower.jpg", grade: "cold", position: "50% 30%" },
    // "For a tank, the usefulness of the network depends on the infrastructure and the other units taking part in it."
    { kind: "photo", at: 192.8, src: "leo2_firing.jpg", grade: "cold" },
    // "...getting reliable information from other units can help the crew better understand what's happening around them."
    { kind: "photo", at: 198.3, src: "c1_crew.jpg", grade: "cold", move: { fromScale: 1.2, toScale: 1.06 } },
    // "But the comparison has to give both sides similar conditions."
    { kind: "stage", at: 205.8 },
    // "...hand the Leopard the whole NATO network and then judge the Armata as if it were out there alone."
    { kind: "split", at: 209.0, de: { src: "leo2_forest.jpg", label: "NATO" }, ru: { src: "c1_t14_2015.jpg" }, ruAt: 211.4 },
    // "We need to compare the vehicles with equivalent support, and separately, look at what integration each country has..."
    { kind: "stage", at: 214.9 },
  ],
  sfx: [
    { src: "sfx/turret.mp3", at: 1.4, volume: 0.15 },
    { src: "sfx/boom_2.mp3", at: 8.0, volume: 0.28 },
    { src: "sfx/hud_1.mp3", at: 15.0, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 23.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 24.65, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 25.2, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 51.7, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 53.9, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 55.35, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 63.3, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 67.0, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 68.1, volume: 0.24 },
    { src: "sfx/lockon.mp3", at: 71.0, volume: 0.14 },
    { src: "sfx/radar.mp3", at: 72.6, volume: 0.18 },
    { src: "sfx/hud_2.mp3", at: 74.6, volume: 0.26 },
    { src: "sfx/glitch_2.mp3", at: 91.3, volume: 0.14 },
    { src: "sfx/hud_3.mp3", at: 105.9, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 107.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 108.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 121.4, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 123.3, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 124.9, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 126.4, volume: 0.24 },
    { src: "sfx/hud_2.mp3", at: 133.6, volume: 0.26 },
  ],
};
