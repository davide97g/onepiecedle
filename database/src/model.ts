import { readdirSync, readFileSync, writeFileSync } from "fs";
import { OnePieceCharacter, OnePieceModel } from "../../types/onepiece.model";

export const model = () => {
  // read all the json data from "../data/characters"
  const files = readdirSync("./data/characters");
  const characters: OnePieceModel[] = [];
  // iterate over the files
  for (const file of files) {
    // read the file
    const data = readFileSync(`./data/characters/${file}`).toString();
    const characterData = JSON.parse(data) as OnePieceCharacter;

    if (characterData.height !== "unknown" && characterData.age !== "unknown") {
      const characterModel: OnePieceModel = {
        id: characterData.id,
        name: characterData.name,
        image: characterData.imageURL,
        age: characterData.age!,
        height: characterData.height!,
        hakiType: characterData.haki ?? [],
        affiliations: characterData.affiliations ?? [],
        bounty: characterData.bounty === "unknown" ? -1 : characterData.bounty!,
        debutSaga: characterData.debut?.saga ?? "unknown",
        devilFruitType: characterData.devilFruit?.type ?? "None",
        gender: characterData.gender,
        origin: characterData.origin ?? "unknown",
        status: characterData.status ?? "UNKNOWN",
      };
      characters.push(characterModel);
    }
  }

  writeFileSync(`./data/model.json`, JSON.stringify(characters));
  writeFileSync(`../backend/data/model.json`, JSON.stringify(characters));
};

model();
