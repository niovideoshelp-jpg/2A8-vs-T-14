import speech from "../data/ch/speech_6.json";
import type { ChapterDef } from "../kit/types";

// Operadores europeus do Leopard 2 (códigos ISO numéricos), acendendo em sequência
const LEOPARD_USERS = ["276", "040", "208", "246", "300", "528", "578", "616", "620", "724", "752", "756", "203", "348", "703", "440", "792", "804"];

// 06 · MOBILITY & SUPPORT — motor, peso, logística, sustentação e custo
export const ch6: ChapterDef = {
  id: "Ch6",
  num: "06",
  title: "Mobility & Support",
  narration: "audio/ch_6.mp3",
  narrDur: 226.12,
  speech: speech as [number, number][],
  music: { src: "music/bed_c.mp3", offset: 25 },
  beats: [
    // "On mobility, catalog numbers help, but they need context."
    { kind: "photo", at: 0.9, src: "leo2_move.jpg", grade: "cold" },
    // "KNDS presents the Leopard 2A8 with a 1,500-horsepower engine"
    { kind: "number", at: 4.5, value: "1,500", unit: "hp", side: "de", src: "c4_maintenance.jpg" },
    // "...reference speeds of 60 km/h forward and 28 km/h in reverse, depending on the transmission."
    { kind: "number", at: 11.3, value: "60", unit: "km/h", caption: "Forward", side: "de", src: "leo2_move.jpg" },
    { kind: "number", at: 13.0, value: "28", unit: "km/h", caption: "Reverse", side: "de", src: "leo2_move.jpg" },
    // "Before applying those figures to any given 2A8, we need to check the configuration each buyer ordered."
    { kind: "photo", at: 16.0, src: "c1_norway_range.jpg", grade: "cold" },
    // "For the T-14, a technical description published ... in 2016 pointed to 55 tons and 1,500 horsepower."
    { kind: "tank", at: 21.7, tank: "t14" },
    { kind: "number", at: 26.8, value: "2016", side: "ru", src: "c1_t14_2015.jpg" },
    { kind: "number", at: 28.5, value: "55", unit: "tons", side: "ru", src: "t14_side.jpg" },
    // "Those numbers describe the design as it was disclosed at the time."
    { kind: "versus", at: 31.9, title: "Engine", de: { value: "1,500", unit: "hp" }, ru: { value: "1,500", unit: "hp" } },
    // "They aren't an independent measurement of a current operational configuration."
    { kind: "blueprint", at: 35.3, tank: "t14" },
    // "I wouldn't use those two spec sheets to declare an absolute winner in mobility."
    { kind: "stage", at: 39.3 },
    // "Think of a truck. It might reach a good speed on the highway..."
    { kind: "photo", at: 46.2, src: "c6_truck.jpg", grade: "neutral" },
    // "...and still struggle to climb a hill when it's loaded."
    { kind: "photo", at: 50.6, src: "c6_truck_hill.jpg", grade: "neutral", move: { fromScale: 1.04, toScale: 1.18 } },
    // "With a tank, we also need to understand how the power is put to use."
    { kind: "photo", at: 52.8, src: "leo2_move.jpg", grade: "cold", move: { fromScale: 1.2, toScale: 1.06 } },
    // "Acceleration, transmission, terrain, and reliability all shape the result."
    {
      kind: "list",
      at: 56.8,
      img: "leo2_forest.jpg",
      items: [
        { t: "Acceleration", at: 56.9 },
        { t: "Transmission", at: 57.75 },
        { t: "Terrain", at: 58.65 },
        { t: "Reliability", at: 59.4 },
      ],
    },
    // "Reverse speed deserves attention because it lets a tank back away without turning the whole vehicle around."
    { kind: "number", at: 61.9, value: "28", unit: "km/h", caption: "Reverse", side: "de", src: "c1_norway.jpg" },
    // "Weight has consequences too. It affects transport, which bridges can be used, and the work needed to recover..."
    {
      kind: "list",
      at: 67.4,
      img: "c6_bridge.jpg",
      items: [
        { t: "Transport", at: 69.1 },
        { t: "Bridges", at: 70.6 },
        { t: "Recovery", at: 71.8 },
      ],
    },
    // "All of this affects the ability to keep the vehicle in operation."
    { kind: "photo", at: 74.8, src: "c4_maintenance.jpg", grade: "cold" },
    // "Top Speed alone says little about how it'll do in that day-to-day grind."
    { kind: "photo", at: 78.3, src: "c6_wetgap.jpg", grade: "cold" },
    // "That's where the case for the Leopard gets stronger."
    { kind: "tank", at: 82.0, tank: "leo", title: true },
    // "The support needed to keep these tanks running."
    { kind: "photo", at: 85.1, src: "leo2a7_rail.jpg", grade: "warm" },
    // "The Leopard 2 family has an international community of operators, suppliers, and training structures."
    {
      kind: "map",
      at: 87.7,
      center: [16, 53],
      scale: 1500,
      countries: LEOPARD_USERS.map((id, i) => ({ id, color: id === "276" ? ("de" as const) : ("neutral" as const), at: 88.0 + i * 0.22 })),
    },
    // "That gives you accumulated experience for introducing a new version..."
    { kind: "photo", at: 93.3, src: "c1_crew.jpg", grade: "cold" },
    // "There are also investments specific to the 2A8."
    { kind: "tank", at: 99.9, tank: "leo" },
    // "In April 2026, KNDS and Rheintech announced a new facility in Norway..."
    { kind: "number", at: 103.1, value: "2026", caption: "New facility in Norway", side: "de", src: "c1_norway_range.jpg" },
    // "The plan is to build 37 of Norway's 54 tanks there."
    { kind: "number", at: 110.3, value: "37", count: 37, unit: "of 54", caption: "Built in Norway", side: "de", src: "c1_norway_range.jpg" },
    // "...Rheinmetall announced in December 2025 a new German order for 120-millimeter rounds ... purchases through 2030."
    {
      kind: "dates",
      at: 114.4,
      side: "de",
      items: [
        { date: "Dec 2025", text: "New 120 mm order", at: 116.7 },
        { date: "2030", text: "Purchases allowed", at: 123.6 },
      ],
    },
    // "These announcements show how the program is organizing its production and support over time."
    { kind: "photo", at: 124.4, src: "c3_leo_ammo.jpg", grade: "neutral" },
    // "They don't guarantee that every tank will always be available, but they're concrete evidence..."
    { kind: "photo", at: 129.2, src: "leo2a7_rail.jpg", grade: "cold", move: { fromScale: 1.2, toScale: 1.05 } },
    // "With the T-14, there's no equivalent transparency about fleet availability, maintenance, or regular supply at scale."
    {
      kind: "list",
      at: 135.8,
      img: "t14_column.jpg",
      items: [
        { t: "Fleet availability?", at: 139.0, side: "ru" },
        { t: "Maintenance?", at: 141.4, side: "ru" },
        { t: "Supply at scale?", at: 142.0, side: "ru" },
      ],
    },
    // "The existence of prototypes or batches or statements about entering service doesn't settle those questions on its own."
    { kind: "photo", at: 143.6, src: "c1_t14_2015.jpg", grade: "cold" },
    // "The Leopard has problems that belong in this assessment, too."
    { kind: "tank", at: 150.6, tank: "leo" },
    // "The IFRI study documents maintenance difficulties with Western tanks in Ukraine..."
    { kind: "photo", at: 154.3, src: "c1_leo2_ukraine.jpg", label: "Ukraine", side: "de", grade: "neutral" },
    // "That experience refers to the models used in that conflict, not the 2A8."
    { kind: "split", at: 164.0, same: "de", de: { src: "c1_leo2_ukraine.jpg", label: "2A4" }, ru: { src: "leo2a8_trophy_photo.jpg", label: "2A8" }, ruAt: 166.3 },
    // "...how hard it can be to turn a large industrial base into support that's actually available at the front."
    { kind: "photo", at: 169.0, src: "leo2a7_rail.jpg", grade: "mono" },
    // "And then there's cost."
    { kind: "versus", at: 176.0, title: "Cost", de: { value: "?" }, ru: { value: "?" } },
    // "The public prices for the two programs aren't comparable enough..."
    { kind: "stage", at: 178.4 },
    // "A contract might include ammunition, simulators, spare parts, and years of support."
    {
      kind: "list",
      at: 184.5,
      img: "c3_leo_ammo.jpg",
      items: [
        { t: "Ammunition", at: 185.2 },
        { t: "Simulators", at: 187.3 },
        { t: "Spare parts", at: 188.2 },
        { t: "Years of support", at: 189.2 },
      ],
    },
    // "Another published figure might cover only the vehicle, or even be an old estimate."
    { kind: "tank", at: 190.9, tank: "leo" },
    // "It's like comparing the price of a machine by itself with a package..."
    { kind: "photo", at: 195.1, src: "c4_maintenance.jpg", grade: "cold" },
    // "...dividing a contract's total value by the number of tanks doesn't necessarily reveal the price of each vehicle."
    { kind: "photo", at: 203.2, src: "c1_norway_range.jpg", grade: "cold" },
    // "In my assessment, the Leopard has the edge thanks to better documented sustainment and fewer technical unknowns."
    { kind: "stage", at: 210.0, focus: "de" },
    // "But the operator still has to turn that structure into training, stockpiles, and maintenance."
    {
      kind: "list",
      at: 217.2,
      img: "c1_crew.jpg",
      items: [
        { t: "Training", at: 218.9, side: "de" },
        { t: "Stockpiles", at: 220.6, side: "de" },
        { t: "Maintenance", at: 221.3, side: "de" },
      ],
    },
    // "Buying the tank is only one part of the work it takes"
    { kind: "photo", at: 222.4, src: "leo2_move.jpg", grade: "cold" },
  ],
  sfx: [
    { src: "sfx/tank_drive.mp3", at: 1.0, volume: 0.12 },
    { src: "sfx/boom_2.mp3", at: 4.5, volume: 0.26 },
    { src: "sfx/hud_2.mp3", at: 11.3, volume: 0.24 },
    { src: "sfx/hud_2.mp3", at: 13.0, volume: 0.24 },
    { src: "sfx/hud_2.mp3", at: 28.5, volume: 0.24 },
    { src: "sfx/boom_2.mp3", at: 31.9, volume: 0.26 },
    { src: "sfx/hud_3.mp3", at: 56.9, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 57.75, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 58.65, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 59.4, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 69.1, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 70.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 71.8, volume: 0.24 },
    { src: "sfx/radar.mp3", at: 88.0, volume: 0.16 },
    { src: "sfx/boom_2.mp3", at: 110.3, volume: 0.26 },
    { src: "sfx/hud_2.mp3", at: 116.7, volume: 0.24 },
    { src: "sfx/hud_2.mp3", at: 123.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 139.0, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 141.4, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 142.0, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 185.2, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 187.3, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 188.2, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 189.2, volume: 0.24 },
    { src: "sfx/boom_2.mp3", at: 210.1, volume: 0.28 },
    { src: "sfx/hud_3.mp3", at: 218.9, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 220.6, volume: 0.24 },
    { src: "sfx/hud_3.mp3", at: 221.3, volume: 0.24 },
  ],
};
