import puppeteer from "puppeteer";
import { writeFileSync } from "fs";

const URL = "https://onepiece.fandom.com/wiki/List_of_Canon_Characters";

const scraperLinks = async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle2" });

  // Locate the full title with a unique string
  const tableSelector = await page.waitForSelector(".fandom-table");

  const tableRows = await tableSelector?.$$("tr");

  const charactersLinks = [];

  for (let i = 1; i < (tableRows?.length ?? 0); i++) {
    // find second td in the row
    const characterLink = await tableRows?.[i].$eval(
      "td:nth-child(2) a",
      (el) => el.href
    );
    charactersLinks.push(characterLink);
  }

  // save links to a file
  writeFileSync("./data/charactersLinks.json", JSON.stringify(charactersLinks));

  await browser.close();
};

scraperLinks();
