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
 * Check if there are recent lottery records (from current date)
 * @returns True if the most recent record is from the current date, false otherwise
 */
export async function hasRecentLotteryRecords(): Promise<boolean> {
	try {
		const lotteries = await getLotteries({ limit: 1, offset: 0 });

		if (lotteries.records.length === 0) return false;

		const mostRecentLottery = lotteries.records[0];
		const currentDate = new Date();
		const recordDate = new Date(mostRecentLottery.date);

		const currentDateOnly = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate(),
		);
		const recordDateOnly = new Date(
			recordDate.getFullYear(),
			recordDate.getMonth(),
			recordDate.getDate(),
		);

		const isSameDate = currentDateOnly.getTime() === recordDateOnly.getTime();

		console.log({
			currentDate: currentDateOnly,
			recordDate: recordDateOnly,
			result: isSameDate,
		});

		return isSameDate;
	} catch (error) {
		console.error("Error checking recent lottery records:", error);
		return false;
	}
}
