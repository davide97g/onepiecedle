export type FEATURE =
  | "gender"
  | "origin"
  | "devilFruitType"
  | "status"
  | "debutSaga"
  | "bounty"
  | "height"
  | "age";
// TODO: Add the following features
// | "affiliations"
// | "hakiType"

export type ValidationComparison = "greater" | "less" | "equal";
export interface GuessResult {
  id: string;
  order?: number;
  gender: {
    value: string;
    valid: boolean | undefined;
  };
  origin: {
    value: string;
    valid: boolean | undefined;
  };
  devilFruitType: {
    value: string;
    valid: boolean | undefined;
  };
  status: {
    value: string;
    valid: boolean | undefined;
  };
  debutSaga: {
    value: string;
    comparison: ValidationComparison | undefined;
  };
  bounty: {
    value: number;
    comparison: ValidationComparison | undefined;
  };
  height: {
    value: number;
    comparison: ValidationComparison | undefined;
  };
  age: {
    value: number;
    comparison: ValidationComparison | undefined;
  };
}

export interface NegativeFeatures {
  gender: string[];
  origin: string[];
  devilFruitType: string[];
  status: string[];
  debutSaga: {
    min: number;
    max: number;
  };
  bounty: {
    min: number;
    max: number;
  };
  height: {
    min: number;
    max: number;
  };
  age: {
    min: number;
    max: number;
  };
}
