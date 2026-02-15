import assert from "node:assert";
import { test } from "@playwright/test";

import { getLotteryData } from "@/tasks/scraping-telemetro";

test("should get data from lottery", async () => {
	test.setTimeout(180_000);

	const result = await getLotteryData();
	console.log(result);

	assert(result !== undefined, "Result should not be undefined");
});
