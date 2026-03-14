import assert from "node:assert";
import { test } from "@playwright/test";

import { getLotteryData } from "@/tasks/scraping-telemetro";
import { getLastLottery } from "@/tasks/database";
import { mapTelemetro } from "@/tasks/telemetro";

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
});
