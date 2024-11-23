import { chromium } from "playwright";

import { Lottery } from "@/types/lottery";

export async function getLotteryData(): Promise<Lottery[]> {
  let results: Lottery[] = [];

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.lnb.gob.pa/");

  for (const container of await page.locator("div.containerTablero").all()) {
    const draw = await container.locator(".sorteo-number > div").textContent();

    const dateContent = await container.locator(".date").textContent();
    const date = dateContent
      ?.split(" ")
      .filter((x) => x.length > 0)
      .map((x) => x.replace("\n", ""))
      .join(" ")
      .trim();

    const firstContent = await container.locator(".premio-number").all();
    const first = await firstContent[0].textContent();
    const second = await firstContent[1].textContent();
    const third = await firstContent[2].textContent();

    console.table([draw, date, first, second, third]);

    if (draw && date && first && second && third) {
      results.push({
        draw: parseInt(draw),
        dateString: date,
        firstPrize: parseInt(first),
        secondPrize: parseInt(second),
        thirdPrize: parseInt(third),
      });
    }
  }

  await context.close();
  await browser.close();

  return results;
}