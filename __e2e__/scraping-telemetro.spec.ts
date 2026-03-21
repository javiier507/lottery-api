import assert from "node:assert";
import { test } from "@playwright/test";

import { getLotteryData } from "@/tasks/scraping-telemetro";
import { addLotteriesData, getLastLottery } from "@/tasks/database";
import { mapTelemetro } from "@/tasks/telemetro";
import { sendNotification } from "@/tasks/notification";
import { isSameDay } from "@/utils/date";

test("should get data from lottery", async () => {
	test.setTimeout(180_000);

	const lastLottery = await getLastLottery();
	console.log(lastLottery);
	if (!lastLottery.isNew) return;

	const result = await getLotteryData();
	console.log(result);

	assert(result !== undefined, "Result should not be undefined");

	const telemetroResult = await mapTelemetro(result);
	console.log(telemetroResult);

	assert(
		telemetroResult !== undefined,
		"Telemetro Result should not be undefined",
	);

	if (
		lastLottery.lastRecord &&
		isSameDay(lastLottery.lastRecord.date, telemetroResult.date)
	) {
		console.log("Lottery draw already exists");
		return;
	}

	/* const added = await addLotteriesData([telemetroResult]);
	added && (await sendNotification()); */
});
