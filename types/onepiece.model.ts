export type DevilFruitType =
  | "Logia"
  | "Paramecia"
  | "Zoan"
  | "Unknown"
  | "None";
export interface DevilFruit {
  name: string;
  japaneseName: string;
  type: DevilFruitType;
  isMythical?: boolean;
  awakened?: boolean;
}

export interface OnePieceCharacterSummary {
  id: string;
  name: string;
  image?: string;
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

export type HakiColor = "Conqueror" | "Armament" | "Observation";

export interface HakiUser {
  userId: string;
  name: string;
  haki?: HakiColor[];
}

export interface Stats {
  officialEnglishName?: string;
  romanizedName?: string;
  japaneseName?: string;
  debut?: {
    manga: number;
    anime?: number;
    arch: string;
    saga: string;
  };
  affiliations?: string[];
  origin?: string | "unknown";
  status?: "ALIVE" | "DECEASED" | "UNKNOWN";
  age?: number | "unknown";
  /** Height in cm */
  height?: number | "unknown";
  bounty?: number | "unknown";
}

export type GenderType = "M" | "F" | "U";

export interface OnePieceCharacter extends Stats {
  id: string;
  name: string;
  url: string;
  gender: GenderType;
  imageURL?: string;
  devilFruit?: DevilFruit;
  haki?: HakiColor[];
}

export interface OnePieceModel {
  id: string;
  name: string;
  image?: string;
  // *** features ***
  gender: string;
  origin: string;
  devilFruitType: DevilFruitType;
  status: string;
  hakiType: string[]; // partial match
  affiliations: string[]; // partial match
  debutSaga: string; // order
  bounty: number; // order
  height: number; // order
  age: number; // order
}
