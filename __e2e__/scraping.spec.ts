import assert from "node:assert";
import { test } from "@playwright/test";

import { getLotteryData } from "@/tasks/scraping";
import { addLotteriesData, getLastLottery } from "@/tasks/database";
import { sendNotification } from "@/tasks/notification";

test("should get data from lottery", async () => {
	test.setTimeout(180_000);

	const lastLottery = await getLastLottery();
	console.log(lastLottery);
	if (!lastLottery.isNew) return;

	const results = await getLotteryData();
	assert(results.length === 4);

	const added = await addLotteriesData(results);
	added && (await sendNotification());
});
