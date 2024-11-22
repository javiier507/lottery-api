import { chromium } from "playwright";

export async function getLotteryData() {
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
  }

  await context.close();
  await browser.close();
}
