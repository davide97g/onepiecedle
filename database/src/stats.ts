import { readdirSync, readFileSync } from "fs";
import { OnePieceCharacter } from "../../types/onepiece.model";

const runStats = async () => {
  const files = readdirSync("./data/characters");

  console.info("Characters", files.length);

  const characters: OnePieceCharacter[] = [];
  for (const file of files) {
    const data = readFileSync(`./data/characters/${file}`).toString();
    const characterData = JSON.parse(data);
    characters.push(characterData);
  }

  const stats = {
    total: characters.length,
    withHaki: characters.filter((c) => c.haki).length,
    withBounty: characters.filter((c) => c.bounty).length,
    withDevilFruit: characters.filter((c) => c.devilFruit).length,
    withAffiliation: characters.filter((c) => c.affiliations).length,
    withAge: characters.filter((c) => c.age).length,
    withHeight: characters.filter((c) => c.height).length,
    withDebut: characters.filter((c) => c.debut?.anime && c.debut.manga).length,
    withStatus: characters.filter((c) => c.status).length,
    withImage: characters.filter((c) => c.imageURL).length,
    withGender: characters.filter((c) => c.gender).length,
    valid: characters.filter(
      (c) =>
        c.bounty &&
        c.affiliations &&
        c.age &&
        c.height &&
        c.debut?.anime &&
        c.debut.manga &&
        c.status &&
        c.gender &&
        c.imageURL
    ).length,
  };

  console.info(stats);
};

runStats();
