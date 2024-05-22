import puppeteer, { ElementHandle, Page } from "puppeteer";
import { writeFileSync } from "fs";
import { OnePieceSaga, RangeStats } from "../../types/onepiece.model";
import { generateIdFromName } from "./utils";
import { formatChapters, formatEpisodes, formatVolumes } from "./format";

const BASE_URL = "https://onepiece.fandom.com";
const FIRST_SAGA_URL = `${BASE_URL}/wiki/East_Blue_Saga`;

const getSagaFormattedData = async (
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

const scrapeSaga = async (
  page: Page,
  SAGA_URL: string,
  order: number
): Promise<{ saga: OnePieceSaga; nextURL?: string }> => {
  console.info("scraping", SAGA_URL, order);
  await page.goto(SAGA_URL, { waitUntil: "networkidle2" });

  // find first h1 element
  const sagaName = await page.$eval("h1", (el) => el.textContent?.trim());

  const imageURL = await page.$eval(".pi-image img", (el) =>
    el.getAttribute("src")
  );

  const characterInfoBox = await page.$$(".portable-infobox");

  const characterSections = await characterInfoBox[0].$$("section");

  const sagaData = await getSagaFormattedData(characterSections[0]);

  const nextURL = await page
    .$eval('[data-source="next"] a', (el) => el.getAttribute("href"))
    .catch(() => undefined);

  const headline = await page.$(".mw-headline");

  const headlineParentSibling = await headline?.evaluateHandle(
    (el) => el.parentElement?.nextElementSibling!
  );

  const arcsLinks = await headlineParentSibling?.$$eval("ul li a", (list) =>
    list.map((l) => l.getAttribute("href"))
  );

  const arcs: string[] =
    arcsLinks?.filter(Boolean).map((link) => `${BASE_URL}${link}`) ?? [];

  console.info(arcs);
  const saga: OnePieceSaga = {
    id: generateIdFromName(sagaName!),
    url: SAGA_URL,
    name: sagaName!,
    imageURL: imageURL ?? undefined,
    order,
    ...sagaData,
    arcLinkList: arcs,
  };
  return { saga, nextURL: nextURL ? `${BASE_URL}${nextURL}` : undefined };
};

const scraperSagas = async () => {
  const sagaList: OnePieceSaga[] = [];
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const scrapeNextSaga = async (
    page: Page,
    SAGA_URL: string,
    order: number
  ) => {
    try {
      const { saga, nextURL } = await scrapeSaga(page, SAGA_URL, order);
      sagaList.push(saga);
      if (nextURL) await scrapeNextSaga(page, nextURL, order + 1);
    } catch (e) {
      console.error(e);
    }
  };

  await scrapeNextSaga(page, FIRST_SAGA_URL, 1);
  writeFileSync("./data/sagas.json", JSON.stringify(sagaList));

  await browser.close();
};

scraperSagas();
