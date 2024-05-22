import { FEATURE, GuessResult } from "../../types/algorithm.model";
import { OnePieceModel } from "../../types/onepiece.model";

import { generateCombinations } from "./combinations";
import { CHARACTERS } from "./data";
import { filterOutByNegativeFeatures, updateInfo } from "./utils";

const countRemainingWithGuess = (
  validationGuess: Partial<GuessResult>,
  characterList: OnePieceModel[]
) => {
  const features = Object.keys(validationGuess) as FEATURE[];

  const filtered = characterList.filter((p) =>
    features.every((feature) => {
      const guess = validationGuess[feature] as {
        value: string | number;
        valid: boolean | undefined;
        comparison: "greater" | "less" | "equal" | undefined;
      };
      if (!guess) return true;
      if (guess.valid !== undefined) {
        if (guess.valid) return p[feature] === guess.value;
        return p[feature] !== guess.value;
      } else if (guess.comparison !== undefined) {
        if (guess.comparison === "equal") return p[feature] === guess.value;
        if (guess.comparison === "greater") return p[feature] > guess.value;
        if (guess.comparison === "less") return p[feature] < guess.value;
      }
      return true;
    })
  );

  return filtered.length;
};

const createGuessList = (
  character: OnePieceModel,
  remainingFeatures: FEATURE[]
): Partial<GuessResult>[] => {
  const templateGuess: Partial<GuessResult> = {};
  // template guess
  remainingFeatures.forEach((feature) => {
    templateGuess[feature] = {
      value: character[feature],
      valid: undefined,
      comparison: undefined,
    } as any;
  });

  const combs = generateCombinations(templateGuess);
  return combs;
};

// for a give Character simulate all the possibile scenarios with every features potentially guessed or not
const computeAvgScore = (
  character: OnePieceModel,
  remainingFeatures: FEATURE[],
  characterList: OnePieceModel[]
): number => {
  let totalScore = 0;
  let count = 0;

  const guessList = createGuessList(character, remainingFeatures);

  guessList.forEach((guess) => {
    const score = countRemainingWithGuess(guess, characterList);
    totalScore += score;
    if (score > 0) count++;
  });

  return totalScore / (count || 1);
};

const findOptimalCharacter = (
  characterList: OnePieceModel[],
  remainingFeatures: FEATURE[]
) => {
  const scores: { id: string; avg: number; name: string }[] = [];

  characterList.forEach((character) => {
    const avg = computeAvgScore(character, remainingFeatures, characterList);
    scores.push({ id: character.id, avg, name: character.name });
  });

  if (!scores.length) return null;

  const minScore = Math.min(...scores.map((p) => p.avg));
  const characterWithMinScore = scores.filter((p) => p.avg === minScore);

  const randomIndex = Math.floor(Math.random() * characterWithMinScore.length);
  const bestId = characterWithMinScore[randomIndex].id;

  return characterList.find((p) => p.id === bestId);
};

export const guessCharacter = (validationGuessHistory: GuessResult[]) => {
  // ? when it's the first guess => we already kwow the first optimal Character to guess based on the generation
  // if (!validationGuessHistory.length) return BEST_FIRST_GUESS;

  const guessedIds = validationGuessHistory.map((v) => v.id);
  // Filter out the pokemons that have been guessed
  const stillToGuess = CHARACTERS.filter((p) => !guessedIds.includes(p.id));

  const { guessedFeatures, guessedNegativeFeatures } = updateInfo(
    validationGuessHistory
  );

  //  Filter out the pokemons that have the guessed features
  const guessedFeaturesKeys = Object.keys(guessedFeatures) as FEATURE[];
  const withCorrectFeatures = stillToGuess.filter((p) =>
    guessedFeaturesKeys.every((key) => p[key] === guessedFeatures[key])
  );

  // ? filter out the pokemons that have the guessed negative features

  const remainingFeatures = Object.keys(guessedNegativeFeatures).filter(
    (k) => !guessedFeaturesKeys.includes(k as FEATURE)
  ) as FEATURE[];

  const filtered = filterOutByNegativeFeatures(
    withCorrectFeatures,
    guessedNegativeFeatures
  );

  const bestGuess = findOptimalCharacter(filtered, remainingFeatures);

  return bestGuess;
};

export const countRemainingFromHistory = (
  validationGuessHistory: GuessResult[]
) => {
  const guessedIds = validationGuessHistory.map((v) => v.id);
  // Filter out the characters that have been guessed
  const stillToGuess = CHARACTERS.filter((p) => !guessedIds.includes(p.id));

  const { guessedFeatures, guessedNegativeFeatures } = updateInfo(
    validationGuessHistory
  );

  //  Filter out the characters that have the guessed features
  const guessedFeaturesKeys = Object.keys(guessedFeatures) as FEATURE[];
  const withCorrectFeatures = stillToGuess.filter((p) =>
    guessedFeaturesKeys.every((key) => p[key] === guessedFeatures[key])
  );

  const filtered = filterOutByNegativeFeatures(
    withCorrectFeatures,
    guessedNegativeFeatures
  );

  return filtered.length;
};
