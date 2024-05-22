import { GuessResult } from "../../../types/algorithm.model";
import {
  OnePieceModel,
  OnePieceCharacterSummary,
} from "../../../types/onepiece.model";

const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? "http://localhost:3000";

export const API = {
  getStatus: async (guessFeedbackHistory: GuessResult[]) => {
    return fetch(`${BACKEND_URL}/status/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guessFeedbackHistory),
    })
      .then((res) => res.json())
      .then(
        (res) =>
          res as {
            remaining: number;
            characterToGuess: OnePieceModel;
          }
      )
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  getBestSuggestion: async (guessValidationHistory: GuessResult[]) => {
    return fetch(`${BACKEND_URL}/best-guess/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guessValidationHistory),
    })
      .then((res) => res.json())
      .then((res) => res.character as OnePieceModel)
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  newCharacter: async () => {
    return fetch(`${BACKEND_URL}/new-character/`, {
      method: "POST",
    });
  },
  getCharacters: async () => {
    return fetch(`${BACKEND_URL}/characters/all/`)
      .then((res) => res.json())
      .then((res) => res as OnePieceCharacterSummary[])
      .catch((err) => {
        console.info(err);
        return null;
      });
  },
  sendGuessCharacterId: async (
    characterId: string,
    guessValidationHistory: GuessResult[]
  ) => {
    return fetch(`${BACKEND_URL}/guess-character/${characterId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guessValidationHistory),
    })
      .then((res) => res.json())
      .then(
        (res) =>
          res as {
            validation: GuessResult;
            remaining: number;
          }
      );
  },
};
