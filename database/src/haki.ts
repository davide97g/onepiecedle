import puppeteer from "puppeteer";
import { writeFileSync, readdirSync, readFileSync } from "fs";
import {
  HakiColor,
  HakiUser,
  OnePieceCharacter,
} from "../../types/onepiece.model";
import { generateIdFromName } from "./utils";

const URL = "https://onepiece.fandom.com/wiki/Haki";

const cleanCharacterName = (name: string) => {
  return name
    .split("(")[0]
    .split("[")[0]
    .trim()
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "");
};

const addHakiToCharacter = async (hakiUsers: HakiUser[]) => {
  const files = readdirSync("./data/characters");

  console.info("Haki Users", hakiUsers.length);
  let found = 0;

  const exceptions = ["686f746f7269xxxx", "6b6f746f7269xxxx"];
  for (const hakiUser of hakiUsers) {
    const file = exceptions.includes(hakiUser.userId)
      ? files.find(
          (f) =>
            generateIdFromName(f.replace(".json", "")) === "686f746f72692061"
        )
      : files.find(
          (characterName) =>
            generateIdFromName(characterName.replace(".json", "")) ===
            hakiUser.userId
        );
    if (!file) {
      console.info("Not found", hakiUser);
      continue;
    }
    found++;
    // read the file
    const data = readFileSync(`./data/characters/${file}`).toString();
    // clean the data
    const characterData = JSON.parse(data) as OnePieceCharacter;

    characterData.haki = hakiUser.haki;
    // stringify the cleaned data
    const cleanedData = JSON.stringify(characterData);
    // save the cleaned data
    writeFileSync(`./data/characters/${file}`, cleanedData);
  }
  console.info("Found", found);
};

const scraperHaki = async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle2" });

  // Locate the full title with a unique string
  const tableSelector = await page.waitForSelector("table.HakiColors");

  const tableBody = await tableSelector?.$("tbody");

  const trList = await tableBody?.$$("tr");

  const haki = {
    armament: false,
    observation: false,
    conqueror: false,
  };

  const hakiUsers: HakiUser[] = [];

  if (!trList) throw new Error("No trList found");
  for (const tr of trList) {
    const th = await tr.$("th");
    if (th) {
      const sectionName = await th.evaluate((el) => el.textContent);

      if (sectionName?.includes("All Types")) {
        haki.armament = true;
        haki.observation = true;
        haki.conqueror = true;
      } else if (sectionName?.includes("Kenbunshoku & Busoshoku")) {
        haki.armament = true;
        haki.observation = true;
        haki.conqueror = false;
      } else if (sectionName?.includes("At Least/Only Haoshoku")) {
        haki.armament = false;
        haki.observation = false;
        haki.conqueror = true;
      } else if (sectionName?.includes("At Least/Only Kenbunshoku")) {
        haki.armament = false;
        haki.observation = true;
        haki.conqueror = false;
      } else if (sectionName?.includes("At Least/Only Busoshoku")) {
        haki.armament = true;
        haki.observation = false;
        haki.conqueror = false;
      } else {
        haki.armament = false;
        haki.observation = false;
        haki.conqueror = false;
      }
    } else {
      const tdList = await tr.$$("td");

      const textContent = await Promise.all(
        tdList.map((td) => td.evaluate((el) => el.textContent))
      );

      const characterNames = textContent.filter(
        (t) => t?.trim() !== ""
      ) as string[];

      if (characterNames.length) {
        const hakiList: HakiColor[] = [];
        if (haki.armament) hakiList.push("Armament");
        if (haki.observation) hakiList.push("Observation");
        if (haki.conqueror) hakiList.push("Conqueror");
        if (hakiList.length > 0) {
          const users: HakiUser[] = characterNames.map((name) => {
            const characterName = cleanCharacterName(name);
            return {
              userId: generateIdFromName(characterName),
              name: characterName,
              haki: hakiList,
            };
          });
          if (users.length > 0) hakiUsers.push(...users);
        }
      }
    }
  }

  // save links to a file
  writeFileSync("./data/haki.json", JSON.stringify(hakiUsers));

  await browser.close();

  await addHakiToCharacter(hakiUsers);
};

scraperHaki();
