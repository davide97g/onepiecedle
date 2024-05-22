import { GuessResult } from "../../types/algorithm.model";
import { OnePieceModel } from "../../types/onepiece.model";
import { CHARACTERS, SAGAS } from "./data";

const getRandomCharacter = (): OnePieceModel => {
  const randomId = Math.floor(Math.random() * CHARACTERS.length);
  return CHARACTERS[randomId];
};

export let CHARACTER_TO_GUESS = getRandomCharacter();

export const getNewCharacterToSolve = () => {
  CHARACTER_TO_GUESS = getRandomCharacter();
  return CHARACTER_TO_GUESS;
};

const computeComparisonSaga = (value?: string, guess?: string) => {
  if (!value || !guess) {
    return "equal";
  }
  const sageGuessed = SAGAS.find((s) => s.name === guess);
  const sagaToGuess = SAGAS.find((s) => s.name === value);
  if (!sageGuessed || !sagaToGuess) {
    return "equal";
  }

  if (sagaToGuess.order > sageGuessed.order) {
    return "greater";
  } else if (sagaToGuess.order < sageGuessed.order) {
    return "less";
  } else {
    return "equal";
  }
};

const computeComparison = (
  value?: number,
  guess?: number
): "greater" | "less" | "equal" => {
  if (!value || !guess) {
    return "equal";
  }

  if (value > guess) {
    return "greater";
  } else if (value < guess) {
    return "less";
  } else {
    return "equal";
  }
};

export const testGuess = (guessId: string): GuessResult => {
  const characterGuess = CHARACTERS.find((p) => p.id === guessId);
  if (!characterGuess) {
    throw new Error("Character not found");
  }
  return {
    id: characterGuess.id,
    gender: {
      value: characterGuess.gender,
      valid: characterGuess.gender === CHARACTER_TO_GUESS?.gender,
    },
    origin: {
      value: characterGuess.origin,
      valid: characterGuess.origin === CHARACTER_TO_GUESS?.origin,
    },
    devilFruitType: {
      value: characterGuess.devilFruitType,
      valid:
        characterGuess.devilFruitType === CHARACTER_TO_GUESS?.devilFruitType,
    },
    status: {
      value: characterGuess.status,
      valid: characterGuess.status === CHARACTER_TO_GUESS?.status,
    },
    debutSaga: {
      value: characterGuess.debutSaga,
      comparison: computeComparisonSaga(
        CHARACTER_TO_GUESS?.debutSaga,
        characterGuess?.debutSaga
      ),
    },
    bounty: {
      value: characterGuess.bounty,
      comparison: computeComparison(
        CHARACTER_TO_GUESS?.bounty,
        characterGuess?.bounty
      ),
    },
    height: {
      value: characterGuess.height,
      comparison: computeComparison(
        CHARACTER_TO_GUESS?.height,
        characterGuess?.height
      ),
    },
    age: {
      value: characterGuess.age,
      comparison: computeComparison(
        CHARACTER_TO_GUESS?.age,
        characterGuess?.age
      ),
    },
  };
};
