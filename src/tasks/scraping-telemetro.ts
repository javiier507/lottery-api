import { chromium } from "playwright";

import type { Lottery, Kind } from "@/types/lottery";
import { KindMap } from "@/types/lottery";

function extractValue(text: string, pattern: RegExp): string {
	const match = text.match(pattern);
	return match ? match[1].trim() : "";
}

function extractKindFromTitle(title: string): Kind | undefined {
	const titleLower = title.toLowerCase();
	for (const [key, value] of Object.entries(KindMap)) {
		if (titleLower.includes(key)) {
			return value;
		}
	}
	return undefined;
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

	const lotteryLink = page
		.locator('a:has-text("EN VIVO | Resultados del sorteo")')
		.first();

	await lotteryLink.waitFor({ timeout: 10000 });
	await lotteryLink.click();
	await page.waitForLoadState("domcontentloaded");

	const pageTitle = await page.title();
	console.log("Título de la página:", pageTitle);

	const kind = extractKindFromTitle(pageTitle);

	const liveblogContent = page
		.locator("div.liveblog-content.liveblog-body")
		.first();

	await liveblogContent.waitFor({ timeout: 10000 });

	const paragraphs = await liveblogContent.locator("p").all();

	let firstPrize = "";
	let secondPrize = "";
	let thirdPrize = "";
	let letters = "";
	let serie = "";
	let folio = "";

	for (const p of paragraphs) {
		const text = (await p.textContent()) || "";

		if (text.includes("PRIMER PREMIO:")) {
			firstPrize = extractValue(text, /PRIMER PREMIO:\s*(\d+)/);
		}

		if (text.includes("SEGUNDO PREMIO:")) {
			secondPrize = extractValue(text, /SEGUNDO PREMIO:\s*(\d+)/);
		}

		if (text.includes("TERCER PREMIO:")) {
			thirdPrize = extractValue(text, /TERCER PREMIO:\s*(\d+)/);
		}

		if (text.includes("Letras:")) {
			letters = extractValue(text, /Letras:\s*([A-Z]+)/);
		}

		if (text.includes("Serie:")) {
			serie = extractValue(text, /Serie:\s*(\d+)/);
		}

		if (text.includes("Folio:")) {
			folio = extractValue(text, /Folio:\s*(\d+)/);
		}
	}

	const date = new Date();

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
