import dotenv from "dotenv";
import express from "express";
import { countRemainingFromHistory, guessCharacter } from "./solver";
import cors from "cors";
import { GuessResult } from "../../types/algorithm.model";
import {
  CHARACTER_TO_GUESS,
  testGuess,
  getNewCharacterToSolve,
} from "./player";
import { CHARACTERS } from "./data";
import { OnePieceCharacterSummary } from "../../types/onepiece.model";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://onepiecedle97.vercel.app",
      "https://onepiecedle.online",
    ],
  })
);
const port = process.env.PORT;

app.get("/", (_: any, res: any) => {
  res.send("Onepiecedle Server");
});

app.post("/status/", express.json(), (req: any, res: any) => {
  const validationGuessHistory = req.body as GuessResult[];
  const remaining = countRemainingFromHistory(validationGuessHistory);

  res.send({
    characterToGuess: CHARACTER_TO_GUESS,
    remaining,
  });
});

app.get("/characters/all/", (req: any, res: any) => {
  const summary: OnePieceCharacterSummary[] = CHARACTERS.map((character) => {
    return {
      id: character.id,
      name: character.name,
      image: character.image,
    };
  });
  res.send(summary);
});

app.post("/new-character/", express.json(), (req: any, res: any) => {
  const character = getNewCharacterToSolve();
  res.send({ character });
});

app.post(
  "/guess-character/:characterId/",
  express.json(),
  (req: any, res: any) => {
    const characterId = req.params.characterId;
    const validationGuessHistory = req.body as GuessResult[];
    const validation = testGuess(characterId);
    const remaining = countRemainingFromHistory(validationGuessHistory);
    res.send({ validation, remaining });
  }
);

app.post("/best-guess/", express.json(), (req: any, res: any) => {
  const validationGuessHistory = req.body as GuessResult[];
  const character = guessCharacter(validationGuessHistory);
  res.send({ character });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
