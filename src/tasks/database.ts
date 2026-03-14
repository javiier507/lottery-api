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

type LastLotteryResult = {
	currentDate: string;
	lastRecord: Lottery | null;
	isNew: boolean;
};

/**
 * Get the last lottery record and compare it against the current date
 * @returns Object with currentDate (YYYY-MM-DD), lastRecord, and isNew flag
 */
export async function getLastLottery(): Promise<LastLotteryResult> {
	try {
		const lotteries = await getLotteries({ limit: 1, offset: 0 });

		const now = new Date();
		const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

		if (lotteries.records.length === 0) {
			return { currentDate, lastRecord: null, isNew: false };
		}

		const lastRecord = lotteries.records[0];
		const isNew = lastRecord.date.slice(0, 10) !== currentDate;

		return { currentDate, lastRecord, isNew };
	} catch (error) {
		console.error("Error checking recent lottery records:", error);
		const now = new Date();
		const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
		return { currentDate, lastRecord: null, isNew: false };
	}
}
