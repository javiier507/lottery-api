import { test } from "@playwright/test";

import { getLotteryData } from "@/app/api/private/lotteries/schedule";

test("should get data from lottery", async () => {
  await getLotteryData();
});
