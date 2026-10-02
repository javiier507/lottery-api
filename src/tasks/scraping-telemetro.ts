import { chromium } from "playwright";

import { extractKindFromTitle } from "@/utils/extract-kind-from-title";
import { filterLiveResultsLinks } from "@/utils/find-lottery-link";
import { parseSemanticDate } from "@/utils/parse-semantic-date";

import type { Lottery } from "@/types/lottery";

function extractValue(text: string, pattern: RegExp): string {
	const match = text.match(pattern);
	return match ? match[1].trim() : "";
}

export async function getLotteryData(): Promise<Lottery> {
	const browser = await chromium.launch({
		headless: true,
	});

	const context = await browser.newContext({
		userAgent:
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	});
	const page = await context.newPage();

	page.setDefaultTimeout(60000);

	await page.goto("https://www.telemetro.com/entretenimiento", {
		waitUntil: "domcontentloaded",
		timeout: 60000,
	});

	const hrefs = await page
		.locator('a[href*="/entretenimiento/"]')
		.evaluateAll((anchors) =>
			anchors
				.map((anchor) =>
					anchor instanceof HTMLAnchorElement
						? (anchor.getAttribute("href") ?? "")
						: "",
				)
				.filter(Boolean),
		);

	const [resultLink] = filterLiveResultsLinks(hrefs);
	if (!resultLink) {
		throw new Error(
			`No live results article found among ${hrefs.length} links`,
		);
	}

	await page.goto(resultLink, {
		waitUntil: "domcontentloaded",
		timeout: 60000,
	});

	const pageTitle = await page.title();
	console.log("Título de la página:", pageTitle);

	const kind = extractKindFromTitle(pageTitle);

	const dateElement = page.locator("span.news-headline__date time").first();
	await dateElement.waitFor({ timeout: 10000 });
	const dateText = ((await dateElement.textContent()) || "").trim();
	console.log("Fecha de la página:", dateText);

	const liveblogContent = page
		.locator("div.liveblog-content.liveblog-body")
		.first();

	await liveblogContent.waitFor({ timeout: 10000 });

	const paragraphTexts = await liveblogContent
		.locator("p, li")
		.allTextContents();

	let firstPrize = "";
	let secondPrize = "";
	let thirdPrize = "";
	let letters = "";
	let serie = "";
	let folio = "";

	for (const raw of paragraphTexts) {
		const text = raw.toLowerCase();

		if (/primer premio/.test(text)) {
			firstPrize = extractValue(raw, /primer premio:?\s*(\d+)/i);
		}

		if (/premio mayor/.test(text)) {
			firstPrize = extractValue(raw, /premio mayor:?\s*(\d+)/i);
		}

		if (/segundo premio/.test(text)) {
			secondPrize = extractValue(raw, /segundo premio:?\s*(\d+)/i);
		}

		if (/tercer premio/.test(text)) {
			thirdPrize = extractValue(raw, /tercer premio:?\s*(\d+)/i);
		}

		if (/letras/.test(text)) {
			letters = extractValue(raw, /letras:?\s*([a-z]+)/i).toUpperCase();
		}

		if (/serie/.test(text)) {
			serie = extractValue(raw, /serie:?\s*(\d+)/i);
		}

		if (/folio/.test(text)) {
			folio = extractValue(raw, /folio:?\s*(\d+)/i);
		}
	}

	const date = parseSemanticDate(dateText);

	await context.close();
	await browser.close();

	return {
		draw: "[PENDING]",
		dateTitle: date.toLocaleDateString("es-PA", {
			dateStyle: "long",
		}),
		date: date.toISOString(),
		firstPrize,
		secondPrize,
		thirdPrize,
		letters,
		serie,
		folio,
		kind,
	};
}
