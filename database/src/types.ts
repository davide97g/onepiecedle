export type DevilFruitType = "Logia" | "Paramecia" | "Zoan" | "Unknown";
export interface DevilFruit {
  name: string;
  japaneseName: string;
  type: DevilFruitType;
  isMythical?: boolean;
  awakened?: boolean;
}

export interface Stats {
  officialEnglishName?: string;
  romanizedName?: string;
  japaneseName?: string;
  debut?: {
    manga: number;
    anime: number;
    arch: string;
    saga: string;
  };
  affiliations?: string[];
  origin?: string; // TODO: could be an enum
  status?: "ALIVE" | "DECEASED";
  age?: number;
  /** Height in cm */
  height?: number;
  weight?: number;
  bounty?: number;
}

export interface OnePieceCharacter extends Stats {
  id: string;
  name: string;
  imageURL?: string;
  devilFruit?: DevilFruit;
}

export interface RangeStats {
  volumes: {
    start: number;
    end: number;
  };
  chapters: {
    start: number;
    end: number;
  };
  episodes: {
    start: number;
    end: number;
  };
}

export interface OnePieceArc extends RangeStats {
  id: string;
  url: string;
  name: string;
  imageURL?: string;
  order: number;
  sagaId: string;
}

export interface OnePieceSaga extends RangeStats {
  id: string;
  url: string;
  name: string;
  imageURL?: string;
  order: number;
  arcLinkList: string[];
}
