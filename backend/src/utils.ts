import { GuessResult, NegativeFeatures } from "../../types/algorithm.model";
import { OnePieceModel } from "../../types/onepiece.model";
import { SAGAS } from "./data";

const getSagaOrder = (sagaName?: string) =>
  SAGAS.find((s) => s.name === sagaName)?.order;

export const updateInfo = (validationGuessHistory: Partial<GuessResult>[]) => {
  const guessedFeatures: Partial<OnePieceModel> = {};
  const guessedNegativeFeatures: Partial<NegativeFeatures> = {
    gender: [],
    origin: [],
    devilFruitType: [],
    status: [],
    debutSaga: { min: 0, max: Infinity },
    bounty: { min: 0, max: Infinity },
    height: { min: 0, max: Infinity },
    age: { min: 0, max: Infinity },
  };
  validationGuessHistory.forEach((validationGuess) => {
    // *** Positive Features ***
    if (validationGuess.gender?.valid)
      guessedFeatures.gender = validationGuess.gender?.value;
    if (validationGuess.origin?.valid)
      guessedFeatures.origin = validationGuess.origin?.value;
    if (validationGuess.origin?.valid)
      guessedFeatures.origin = validationGuess.origin?.value;
    if (validationGuess.status?.valid)
      guessedFeatures.status = validationGuess.status?.value;
    if (validationGuess.debutSaga?.comparison === "equal")
      guessedFeatures.debutSaga = validationGuess.debutSaga?.value;
    if (validationGuess.bounty?.comparison === "equal")
      guessedFeatures.bounty = validationGuess.bounty?.value;
    if (validationGuess.height?.comparison === "equal")
      guessedFeatures.height = validationGuess.height?.value;
    if (validationGuess.age?.comparison === "equal")
      guessedFeatures.age = validationGuess.age?.value;

    // *** Negative Features ***
    guessedNegativeFeatures.gender = guessedNegativeFeatures.gender || [];
    guessedNegativeFeatures.origin = guessedNegativeFeatures.origin || [];
    guessedNegativeFeatures.status = guessedNegativeFeatures.status || [];
    guessedNegativeFeatures.devilFruitType =
      guessedNegativeFeatures.devilFruitType || [];
    guessedNegativeFeatures.debutSaga = guessedNegativeFeatures.debutSaga || {
      min: 0,
      max: Infinity,
    };
    guessedNegativeFeatures.bounty = guessedNegativeFeatures.bounty || {
      min: 0,
      max: Infinity,
    };
    guessedNegativeFeatures.height = guessedNegativeFeatures.height || {
      min: 0,
      max: Infinity,
    };
    guessedNegativeFeatures.age = guessedNegativeFeatures.age || {
      min: 0,
      max: Infinity,
    };

    if (!validationGuess.gender?.valid)
      guessedNegativeFeatures.gender = [
        ...new Set([
          ...guessedNegativeFeatures.gender,
          validationGuess.gender?.value as string,
        ]),
      ];

    if (!validationGuess.origin?.valid)
      guessedNegativeFeatures.origin = [
        ...new Set([
          ...guessedNegativeFeatures.origin,
          validationGuess.origin?.value as string,
        ]),
      ];

    if (!validationGuess.status?.valid)
      guessedNegativeFeatures.status = [
        ...new Set([
          ...guessedNegativeFeatures.status,
          validationGuess.status?.value as string,
        ]),
      ];

    if (!validationGuess.devilFruitType?.valid)
      guessedNegativeFeatures.devilFruitType = [
        ...new Set([
          ...guessedNegativeFeatures.devilFruitType,
          validationGuess.devilFruitType?.value as string,
        ]),
      ];

    if (validationGuess.debutSaga?.comparison !== "equal") {
      const value = getSagaOrder(validationGuess.debutSaga?.value);
      if (validationGuess.debutSaga?.comparison === "greater")
        guessedNegativeFeatures.debutSaga.min = Math.max(
          guessedNegativeFeatures.debutSaga.min,
          value ?? 0
        );
      else
        guessedNegativeFeatures.debutSaga.max = Math.min(
          guessedNegativeFeatures.debutSaga.max,
          value ?? Infinity
        );
    }

    if (validationGuess.bounty?.comparison !== "equal") {
      const value = validationGuess.bounty?.value as number;
      if (validationGuess.bounty?.comparison === "greater")
        guessedNegativeFeatures.bounty.min = Math.max(
          guessedNegativeFeatures.bounty.min,
          value
        );
      else
        guessedNegativeFeatures.bounty.max = Math.min(
          guessedNegativeFeatures.bounty.max,
          value
        );
    }

    if (validationGuess.height?.comparison !== "equal") {
      const value = validationGuess.height?.value as number;
      if (validationGuess.height?.comparison === "greater")
        guessedNegativeFeatures.height.min = Math.max(
          guessedNegativeFeatures.height.min,
          value
        );
      else
        guessedNegativeFeatures.height.max = Math.min(
          guessedNegativeFeatures.height.max,
          value
        );
    }

    if (validationGuess.age?.comparison !== "equal") {
      const value = validationGuess.age?.value as number;
      if (validationGuess.age?.comparison === "greater")
        guessedNegativeFeatures.age.min = Math.max(
          guessedNegativeFeatures.age.min,
          value
        );
      else
        guessedNegativeFeatures.age.max = Math.min(
          guessedNegativeFeatures.age.max,
          value
        );
    }
  });
  return { guessedFeatures, guessedNegativeFeatures };
};

export const filterOutByNegativeFeatures = (
  characterList: OnePieceModel[],
  guessedNegativeFeatures: Partial<NegativeFeatures>
): OnePieceModel[] => {
  return characterList.filter((p) => {
    if (
      guessedNegativeFeatures.gender &&
      guessedNegativeFeatures.gender.includes(p.gender)
    )
      return false;
    if (
      guessedNegativeFeatures.origin &&
      guessedNegativeFeatures.origin.includes(p.origin)
    )
      return false;

    if (
      guessedNegativeFeatures.status &&
      guessedNegativeFeatures.status.includes(p.status)
    )
      return false;

    if (
      guessedNegativeFeatures.devilFruitType &&
      guessedNegativeFeatures.devilFruitType.includes(p.devilFruitType)
    )
      return false;

    if (
      guessedNegativeFeatures.debutSaga &&
      (getSagaOrder(p.debutSaga)! < guessedNegativeFeatures.debutSaga.min ||
        getSagaOrder(p.debutSaga)! > guessedNegativeFeatures.debutSaga.max)
    )
      return false;

    if (
      guessedNegativeFeatures.bounty &&
      (p.bounty < guessedNegativeFeatures.bounty.min ||
        p.bounty > guessedNegativeFeatures.bounty.max)
    )
      return false;

    if (
      guessedNegativeFeatures.height &&
      (p.height < guessedNegativeFeatures.height.min ||
        p.height > guessedNegativeFeatures.height.max)
    )
      return false;

    if (
      guessedNegativeFeatures.age &&
      (p.age < guessedNegativeFeatures.age.min ||
        p.age > guessedNegativeFeatures.age.max)
    )
      return false;

    return true;
  });
};
