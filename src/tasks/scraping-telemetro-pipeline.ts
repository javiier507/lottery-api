import { addLotteriesData, getLastLottery } from "@/tasks/database";
import { sendNotification } from "@/tasks/notification";
import { getLotteryData } from "@/tasks/scraping-telemetro";
import { mapTelemetro } from "@/tasks/telemetro";
import { isSameDay } from "@/utils/date";

import type { Lottery } from "@/types/lottery";

export type ScrapingPipelineResult =
	| {
			status: "skipped";
			reason: "not-new" | "empty-scrape" | "mapping-failed" | "duplicate-draw";
	  }
	| { status: "added"; lottery: Lottery }
	| { status: "not-added"; lottery: Lottery };

export async function runScrapingTelemetroPipeline(): Promise<ScrapingPipelineResult> {
	const lastLottery = await getLastLottery();
	if (!lastLottery.isNew) {
		return { status: "skipped", reason: "not-new" };
	}

	const result = await getLotteryData();
	if (
		result.firstPrize.length +
			result.secondPrize.length +
			result.thirdPrize.length ===
		0
	) {
		return { status: "skipped", reason: "empty-scrape" };
	}

	const telemetroResult = await mapTelemetro(result);
	if (telemetroResult === undefined) {
		return { status: "skipped", reason: "mapping-failed" };
	}

	if (
		lastLottery.lastRecord &&
		isSameDay(lastLottery.lastRecord.date, telemetroResult.date)
	) {
		return { status: "skipped", reason: "duplicate-draw" };
	}

	const added = await addLotteriesData([telemetroResult]);
	if (!added) {
		return { status: "not-added", lottery: telemetroResult };
	}

	await sendNotification();
	return { status: "added", lottery: telemetroResult };
}

if (require.main === module) {
	console.log("🚀 Starting scraping pipeline...");
	runScrapingTelemetroPipeline()
		.then((result) => console.log("✅ Scraping pipeline finished:", result))
		.catch((error) => console.error("❌ Scraping pipeline failed:", error));
}
