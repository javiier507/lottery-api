import assert from "node:assert";
import { test } from "@playwright/test";

import { getLotteryData, addLotteriesData } from "@/scraping";

test("should get data from lottery", async () => {
  const results = await getLotteryData();
  assert(results.length === 4);

  await addLotteriesData(results);
});
