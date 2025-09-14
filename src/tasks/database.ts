import type { Lottery } from "@/types/lottery";
import {
	addLotteries,
	getLotteryDrawsByDraws,
	getLotteries,
} from "@/db/repositories/lottery.repository";

/**
 * Save the lottery data to the database
 * @param lotteries Result of the lottery to be added
 * @returns True if some data was added, false otherwise
 */
export async function addLotteriesData(lotteries: Lottery[]): Promise<boolean> {
	const existingDraws = await getLotteryDrawsByDraws(
		lotteries.map((x) => x.draw),
	);
	const newDraws = lotteries.filter(
		(x) => !existingDraws.find((y) => y.draw === x.draw),
	);

	if (newDraws.length === 0) return false;

	return addLotteries(newDraws)
		.then(() => {
			console.log("Data successfully added");
			return true;
		})
		.catch((e) => {
			console.error("Error: Add Lotteries");
			console.error(e);
			return false;
		});
}

/**
 * Check if there are recent lottery records (within last 12 hours)
 * @returns True if the most recent record is within 12 hours, false otherwise
 */
export async function hasRecentLotteryRecords(): Promise<boolean> {
	try {
		const lotteries = await getLotteries({ limit: 1, offset: 0 });

		if (lotteries.records.length === 0) return false;

		const mostRecentLottery = lotteries.records[0];
		const currentTime = new Date();
		const recordTime = new Date(mostRecentLottery.date);

		const timeDifferenceMs = currentTime.getTime() - recordTime.getTime();
		const twelveHoursMs = 12 * 60 * 60 * 1000;

		return timeDifferenceMs <= twelveHoursMs;
	} catch (error) {
		console.error("Error checking recent lottery records:", error);
		return false;
	}
}
