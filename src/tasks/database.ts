import { Lottery } from "@/types/lottery";
import {
	addLotteries,
	getLotteryDrawsByDraws,
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
