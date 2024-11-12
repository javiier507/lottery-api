import { desc } from "drizzle-orm";

import { db } from "@/db";
import { LotteryTable } from "@/db/schema";
import { Lottery } from "@/types/lottery";
import { Pagination, PaginationParams } from "@/types/pagination";

export async function getLotteries(params: PaginationParams = {limit: 10, offset: 0}): Promise<Pagination<Lottery[]>> {
  const records = await db
    .select()
    .from(LotteryTable)
    .orderBy(desc(LotteryTable.id)).limit(params.limit).offset(params.offset);
  
  const totalRecords = await db.$count(LotteryTable);

  return {
    records,
    totalRecords,
  };
}
