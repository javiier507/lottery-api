import assert from "node:assert";
import { test } from "@playwright/test";

import { getLotteryData } from "@/tasks/scraping";
import { addLotteriesData, hasRecentLotteryRecords } from "@/tasks/database";
import { sendNotification } from "@/tasks/notification";

test("should get data from lottery", async () => {
	test.setTimeout(180_000);

	const hasRecords = await hasRecentLotteryRecords();
	if (hasRecords) return;

	const results = await getLotteryData();
	assert(results.length === 4);

	const added = await addLotteriesData(results);
	added && (await sendNotification());
});
