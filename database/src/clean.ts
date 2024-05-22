import { readdirSync, readFileSync, writeFileSync } from "fs";
import { OnePieceCharacter } from "../../types/onepiece.model";

const fixProblems = (character: OnePieceCharacter): OnePieceCharacter => {
  // check for problems
  if (character.bounty === undefined) character.bounty = "unknown";
  if (character.age === undefined) character.age = "unknown";
  if (character.height === undefined) character.height = "unknown";
  if (character.status === undefined) character.status = "UNKNOWN";
  if (character.affiliations === undefined) character.affiliations = [];
  if (character.origin === undefined) character.origin = "unknown";
  if (character.debut === undefined)
    character.debut = { manga: 0, anime: 0, arch: "unknown", saga: "unknown" };

  character.id = crypto.randomUUID();

  return character;
};

export const clean = () => {
  // read all the json data from "../data/characters"
  const files = readdirSync("./data/characters");
  // iterate over the files
  for (const file of files) {
    // read the file
    const data = readFileSync(`./data/characters/${file}`).toString();
    // clean the data
    const characterData = JSON.parse(data) as OnePieceCharacter;
    // check for problems
    const fixedCharacterData = fixProblems(characterData);
    // stringify the cleaned data
    const cleanedData = JSON.stringify(fixedCharacterData);
    // save the cleaned data
    writeFileSync(`./data/characters/${file}`, cleanedData);
  }
};

clean();
