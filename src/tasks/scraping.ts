import { chromium } from "playwright";

import { NationalLotteryKindMap, type Lottery } from "@/types/lottery";
import { getDate } from "@/utils/date";

export async function getLotteryData(): Promise<Lottery[]> {
	const results: Lottery[] = [];

	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto("http://www.lnb.gob.pa/");

	let index = 0;
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

		const details = await container
			.locator(".primer-premio-details > .value")
			.all();
		const letters = await details[0].textContent();
		const serie = await details[1].textContent();
		const folio = await details[2].textContent();
		const kind = NationalLotteryKindMap[index];

		console.table([
			draw,
			dateStr,
			date?.toISOString(),
			first,
			second,
			third,
			letters,
			serie,
			folio,
			kind,
		]);

		if (draw && dateStr && date && first && second && third) {
			results.push({
				draw: draw,
				dateTitle: dateStr,
				date: date.toISOString(),
				firstPrize: first,
				secondPrize: second,
				thirdPrize: third,
				letters,
				serie,
				folio,
				kind,
			});
		}
		index++;
	}

	await context.close();
	await browser.close();

	return results;
}
