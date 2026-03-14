import { desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { LotteryTable } from "@/db/schema";
import type { Lottery } from "@/types/lottery";
import type { Pagination, PaginationParams } from "@/types/pagination";

export async function getLotteries(
	params: PaginationParams = { limit: 10, offset: 0 },
): Promise<Pagination<Lottery[]>> {
	const records = (await db
		.select()
		.from(LotteryTable)
		.orderBy(desc(LotteryTable.id))
		.limit(params.limit)
		.offset(params.offset)) as Lottery[];

	const totalRecords = await db.$count(LotteryTable);

	return {
		records,
		totalRecords,
	};
}

export async function addLotteries(lotteries: Lottery[]) {
	return db.insert(LotteryTable).values(lotteries).onConflictDoNothing();
}

export async function getLastLotteryByKind(
	kind: number,
): Promise<Lottery | undefined> {
	const [record] = await db
		.select()
		.from(LotteryTable)
		.where(eq(LotteryTable.kind, kind))
		.orderBy(desc(LotteryTable.id))
		.limit(1);

	return record as Lottery | undefined;
}

export async function getLotteryDrawsByDraws(
	draws: string[],
): Promise<{ draw: string }[]> {
	return db
		.select({ draw: LotteryTable.draw })
		.from(LotteryTable)
		.where(inArray(LotteryTable.draw, draws));
}
