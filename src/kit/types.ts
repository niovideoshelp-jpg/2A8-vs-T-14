// Definição de capítulos: cada vídeo é uma lista de "beats" (planos) sincronizados com a narração.
// Todos os tempos (at) estão em segundos da narração do capítulo.

export type Side = "de" | "ru";
export type TankId = "leo" | "t14";
export type EnterKind = "whip-left" | "whip-right" | "zoom-in" | "zoom-out" | "rise" | "wipe-right" | "wipe-left" | "cut";

export type Move = { fromScale?: number; toScale?: number; fromX?: number; toX?: number; fromY?: number; toY?: number };

export type CalloutDef = {
  at: number;
  title: string;
  fx: number; // ponto no recorte (fração da largura)
  fy: number; // ponto no recorte (fração da altura)
  dx: number; // deslocamento até o texto (px)
  dy: number;
  align?: "left" | "right"; // lado do texto em relação ao fim da linha
};

export type Beat =
  | { kind: "photo"; at: number; src: string; grade?: "cold" | "warm" | "neutral" | "mono"; move?: Move; position?: string; label?: string; side?: Side; year?: string; letterbox?: boolean; enter?: EnterKind }
  | { kind: "tank"; at: number; tank: TankId; title?: boolean; callouts?: CalloutDef[]; enter?: EnterKind; scale?: number }
  | {
      kind: "versus";
      at: number;
      title?: string;
      de: { value: string; unit?: string; count?: number };
      ru: { value: string; unit?: string; count?: number };
      ruAt?: number; // quando o lado russo aparece (padrão: junto)
      enter?: EnterKind;
    }
  | { kind: "split"; at: number; de: { src: string; label?: string }; ru: { src: string; label?: string }; ruAt?: number; same?: Side; enter?: EnterKind }
  | { kind: "number"; at: number; value: string; unit?: string; side?: Side; count?: number; src?: string; caption?: string; enter?: EnterKind }
  | { kind: "list"; at: number; title?: string; img?: string; items: { t: string; at: number; img?: string; side?: Side }[]; enter?: EnterKind }
  | { kind: "capsule"; at: number; crewAt: number; turretAt?: number; label?: string; enter?: EnterKind }
  | { kind: "blueprint"; at: number; tank: TankId; enter?: EnterKind }
  | { kind: "map"; at: number; countries: { id: string; color: Side | "neutral"; at: number }[]; cities?: { name: string; lon: number; lat: number; side: Side; at: number }[]; view?: "europe" | "wide"; center?: [number, number]; scale?: number; enter?: EnterKind }
  | { kind: "bars"; at: number; title?: string; rows: { label: string; de: number; ru: number; deText: string; ruText: string; at: number }[]; enter?: EnterKind }
  | { kind: "stage"; at: number; focus?: Side | "both"; enter?: EnterKind }
  | { kind: "dates"; at: number; side: Side; items: { date: string; text?: string; at: number }[]; enter?: EnterKind }
  | { kind: "sources"; at: number; enter?: EnterKind }
  | { kind: "airburst"; at: number; fireAt: number; burstAt: number; label?: string; enter?: EnterKind };

export type Sfx = { src: string; at: number; volume: number };

export type ChapterDef = {
  id: string; // ID da composição
  num: string; // "01"
  title: string; // título do capítulo (inglês)
  narration: string; // arquivo em public/
  narrDur: number; // duração da narração (s)
  speech: [number, number][]; // mapa de fala (s)
  music: { src: string; offset?: number }; // trilha e ponto de entrada no arquivo (s)
  beats: Beat[];
  sfx?: Sfx[]; // efeitos extras (tempos da narração)
  cardFor?: number; // duração da cartela de abertura antes da narração (s)
  outro?: "fade" | "signature";
};
