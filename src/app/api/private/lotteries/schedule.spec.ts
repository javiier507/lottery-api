import { test } from "vitest";

import { getLotteryData } from "./schedule";

test("should get data from lottery", async () => {
  await getLotteryData();
});
