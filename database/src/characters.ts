import puppeteer, { ElementHandle } from "puppeteer";
import { writeFileSync } from "fs";

import characterLinks from "../data/charactersLinks.json";
import maleCharacterNames from "../data/maleCharacterNames.json";

import {
  DevilFruit,
  DevilFruitType,
  OnePieceCharacter,
  Stats,
} from "../../types/onepiece.model";
import {
  formatAffiliations,
  formatAge,
  formatBounty,
  formatDebut,
  formatDevilFruitName,
  formatHeight,
  formatOrigin,
} from "./format";

import cliProgress from "cli-progress";
import { findArchAndSaga, generateIdFromName } from "./utils";

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const buildTypeFromRawData = (typeString?: string): DevilFruitType => {
  if (!typeString) return "Unknown";
  if (typeString.toLowerCase().includes("paramecia")) return "Paramecia";
  if (typeString.toLowerCase().includes("zoan")) return "Zoan";
  if (typeString.toLowerCase().includes("logia")) return "Logia";
  return "Unknown";
};

const getDevilFruitData = async (
  devilFruitSection: ElementHandle<HTMLElement>
) => {
  const rawLines = await devilFruitSection?.$$eval(".pi-data", (list) =>
    list.map((l) => l.textContent)
  );
  const cleanData =
    rawLines
      ?.map((rL) => rL?.split("\t").join("").split("\n").join("").trim())
      .filter(Boolean)
      .map((s) => s as string) ?? [];

  const formattedData = cleanData.map((line) => {
    const [key, value] = line.split(":");
    return {
      key,
      value,
    };
  });

  const rawType = formattedData.find((k) => k.key === "Type")?.value ?? "";

  const devilFruit: DevilFruit = {
    name: formatDevilFruitName(
      formattedData.find((k) => k.key === "English Name")?.value
    ),
    japaneseName:
      formattedData.find((k) => k.key === "Japanese Name")?.value ?? "",
    type: buildTypeFromRawData(rawType),
  };

  return devilFruit;
};

const getStatisticsData = async (
  statsSection: ElementHandle<HTMLElement>
): Promise<Stats> => {
  const rawLines = await statsSection?.$$eval(".pi-data", (list) =>
    list.map((l) => l.textContent)
  );
  const cleanData =
    rawLines
      ?.map((rL) => rL?.split("\t").join("").split("\n").join("").trim())
      .filter(Boolean)
      .map((s) => s as string) ?? [];

  const formattedData = cleanData.map((line) => {
    const [key, value] = line.split(":");
    return {
      key,
      value,
    };
  });

  const debutStats = formatDebut(
    formattedData.find((k) => k.key === "Debut")?.value!
  );

  const { arch, saga } = findArchAndSaga({ chapterNumber: debutStats.manga });

  const stats: Stats = {
    officialEnglishName: formattedData.find(
      (k) => k.key === "Official English Name"
    )?.value,
    romanizedName: formattedData.find((k) => k.key === "Romanized Name")?.value,
    japaneseName: formattedData.find((k) => k.key === "Japanese Name")?.value,
    debut: {
      manga: debutStats.manga,
      anime: debutStats.anime,
      arch,
      saga,
    },
    affiliations: formatAffiliations(
      formattedData.find((k) => k.key === "Affiliations")?.value!
    ),
    origin: formatOrigin(formattedData.find((k) => k.key === "Origin")?.value),
    status:
      formattedData.find((k) => k.key === "Status")?.value === "Deceased"
        ? "DECEASED"
        : "ALIVE",
    age: formatAge(formattedData.find((k) => k.key === "Age")?.value),
    height: formatHeight(formattedData.find((k) => k.key === "Height")?.value),
    bounty: formatBounty(formattedData.find((k) => k.key === "Bounty")?.value),
  };

  return stats;
};

const scraperCharacters = async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const links = structuredClone(characterLinks).splice(860);
  // const links = [characterLinks[22]]; // Alvida

  bar1.start(links.length, 0);

  for (const element of links) {
    await page.goto(element, { waitUntil: "networkidle2" });

    // find first h1 element
    const characterName = await page.$eval("h1", (el) =>
      el.textContent?.trim().replace("/", "-")
    );
    if (!characterName) continue;

    const imageURL = await page.$eval(".pi-image img", (el) =>
      el.getAttribute("src")
    );

    const characterInfoBox = await page.$$(".portable-infobox");

    const characterSections = await characterInfoBox[0].$$("section");

    // *** DEVIL FRUIT ***
    const devilFruit =
      characterSections.length === 2
        ? await getDevilFruitData(characterSections[1])
        : undefined;

    const stats = await getStatisticsData(characterSections[0]);

    console.log(characterName);
    const isMale = maleCharacterNames.includes(characterName);

    // search all the page for word "female"
    const isFemale =
      !isMale ||
      (await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("female");
      }));

    const gender = isMale ? "M" : isFemale ? "F" : "U";

    const character: OnePieceCharacter = {
      id: generateIdFromName(characterName),
      url: element,
      name: characterName,
      gender,
      imageURL: imageURL ?? undefined,
      devilFruit,
      ...stats,
    };
    // save links to a file
    writeFileSync(
      `./data/characters/${characterName}.json`,
      JSON.stringify(character)
    );
    bar1.increment(1);
  }
  bar1.stop();
  await browser.close();
};

scraperCharacters();
