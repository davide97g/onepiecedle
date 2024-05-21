import puppeteer, { ElementHandle, Page } from "puppeteer";
import { writeFileSync } from "fs";
import { OnePieceArc, OnePieceSaga, RangeStats } from "./types";
import { generateIdFromName } from "./utils";
import { formatChapters, formatEpisodes, formatVolumes } from "./format";
import databaseSaga from "../data/sagas.json";

const sagaList: OnePieceSaga[] = databaseSaga as OnePieceSaga[];

const getArchFormattedData = async (
  statsSection: ElementHandle<HTMLElement>
): Promise<RangeStats> => {
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

  console.log(formattedData);

  const volumes = formattedData
    .find((k) => k.key.includes("Volumes"))
    ?.key.replace("Volumes", "");

  const stats: RangeStats = {
    volumes: formatVolumes(volumes!),
    chapters: formatChapters(
      formattedData.find((k) => k.key === "Manga Chapters")?.value!
    ),
    episodes: formatEpisodes(
      formattedData.find((k) => k.key === "Anime Episodes")?.value!
    ),
  };

  return stats;
};

const scrapeArc = async (
  sagaId: string,
  page: Page,
  ARC_URL: string,
  order: number
): Promise<OnePieceArc> => {
  await page.goto(ARC_URL, { waitUntil: "networkidle2" });

  console.info("scraping", ARC_URL, order);
  await page.goto(ARC_URL, { waitUntil: "networkidle2" });

  // find first h1 element
  const archName = await page.$eval("h1", (el) => el.textContent?.trim());
  console.info(archName);

  const imageURL = await page.$eval(".pi-image img", (el) =>
    el.getAttribute("src")
  );

  const characterInfoBox = await page.$$(".portable-infobox");

  const characterSections = await characterInfoBox[0].$$("section");

  const archData = await getArchFormattedData(characterSections[0]);

  const arc: OnePieceArc = {
    id: generateIdFromName(archName!),
    name: archName!,
    url: ARC_URL,
    imageURL: imageURL ?? undefined,
    order,
    ...archData,
    sagaId,
  };
  return arc;
};

const scraperArcs = async () => {
  const archList: OnePieceArc[] = [];

  const arcLinkList: {
    link: string;
    sagaId: string;
  }[] = sagaList
    .map((saga) =>
      saga.arcLinkList.map((link) => ({
        link,
        sagaId: saga.id,
      }))
    )
    .flat();

  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const arcInfo of arcLinkList) {
    const arc = await scrapeArc(
      arcInfo.sagaId,
      page,
      arcInfo.link,
      archList.length + 1
    );
    archList.push(arc);
  }

  writeFileSync("./data/arcs.json", JSON.stringify(archList));
  await browser.close();
};

scraperArcs();
