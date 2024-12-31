import { chromium } from "playwright";

import { Lottery } from "@/types/lottery";
import { addLotteries, getLotteryDrawsByDraws } from "@/db/repositories/lottery.repository";
import { getDate } from "@/utils/date";

export async function getLotteryData(): Promise<Lottery[]> {
  const results: Lottery[] = [];

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.lnb.gob.pa/");

  for (const container of await page.locator("div.containerTablero").all()) {
    const draw = await container.locator(".sorteo-number > div").textContent();

    const dateContent = await container.locator(".date").textContent();
    const dateStr = dateContent
      ?.split(" ")
      .filter((x) => x.length > 0)
      .map((x) => x.replace("\n", ""))
      .join(" ")
      .trim();
    const date = dateStr ? getDate(dateStr) : undefined;

    const firstContent = await container.locator(".premio-number").all();
    const first = await firstContent[0].textContent();
    const second = await firstContent[1].textContent();
    const third = await firstContent[2].textContent();

    console.table([draw, dateStr, date?.toISOString(), first, second, third]);

    if (draw && dateStr && date && first && second && third) {
      results.push({
        draw: draw,
        dateTitle: dateStr,
        date: date.toISOString(),
        firstPrize: first,
        secondPrize: second,
        thirdPrize: third,
      });
    }
  }

  await context.close();
  await browser.close();

  return results;
}

export async function addLotteriesData(lotteries: Lottery[]) {
  const existingDraws = await getLotteryDrawsByDraws(lotteries.map((x) => x.draw));
  const newDraws = lotteries.filter((x) => !existingDraws.find((y) => y.draw === x.draw));

  if (newDraws.length === 0) return;

  await addLotteries(newDraws)
    .then(() => {
      console.log("Data successfully added");
    })
    .catch((e) => {
      console.error("Error: Add Lotteries");
      console.error(e);
    });
}
