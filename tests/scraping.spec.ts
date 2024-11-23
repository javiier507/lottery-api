import assert from "node:assert";
import { test } from "@playwright/test";

import { getLotteryData } from "@/scraping";

test("should get data from lottery", async () => {
  const results = await getLotteryData();
  assert(results.length === 4);
});
