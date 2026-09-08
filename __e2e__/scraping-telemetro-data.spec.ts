import assert from "node:assert";
import { test } from "@playwright/test";

import { getLotteryData } from "@/tasks/scraping-telemetro";

test("getLotteryData scrapes prizes, date and kind from telemetro", async () => {
	test.setTimeout(60_000);

	const result = await getLotteryData();
	console.log(result);

	assert(result.firstPrize.length > 0, "firstPrize should not be empty");
	assert(result.secondPrize.length > 0, "secondPrize should not be empty");
	assert(result.thirdPrize.length > 0, "thirdPrize should not be empty");
	assert(
		!Number.isNaN(Date.parse(result.date)),
		"date should be a valid ISO date",
	);
	assert(result.kind !== undefined, "kind should be recognized from the title");
});
