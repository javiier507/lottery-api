import { desc } from "drizzle-orm";

import { db } from "@/db";
import { LotteryTable } from "@/db/schema";
import { Lottery } from "@/types/lottery";

export async function getLotteries(): Promise<Lottery[]> {
  return db.select().from(LotteryTable).orderBy(desc(LotteryTable.id));
}
