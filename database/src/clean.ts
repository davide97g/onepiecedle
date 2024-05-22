import { readdirSync, readFileSync, writeFileSync } from "fs";
import { OnePieceCharacter } from "./types";
import characterLinks from "../data/charactersLinks.json";

const fixProblems = (character: OnePieceCharacter): OnePieceCharacter => {
  // check for problems

  return character;
};

export const clean = () => {
  // read all the json data from "../data/characters"
  const files = readdirSync("../data/characters");
  // iterate over the files
  for (const file of files) {
    // read the file
    const data = readFileSync(`../data/characters/${file}`).toString();
    // clean the data
    const characterData = JSON.parse(data) as OnePieceCharacter;
    // check for problems
    const fixedCharacterData = fixProblems(characterData);
    // stringify the cleaned data
    const cleanedData = JSON.stringify(fixedCharacterData);
    // save the cleaned data
    writeFileSync(`../data/cleaned/${file}`, cleanedData);
  }
};

// clean();

console.info(characterLinks.findIndex((cLink) => cLink.includes("Sanji")));
