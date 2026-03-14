import { getLastLotteryByKind } from "@/db/repositories/lottery.repository";
import type { Lottery } from "@/types/lottery";

export async function mapTelemetro(
	lottery: Lottery,
): Promise<Lottery | undefined> {
	if (lottery.kind == null) return;

	const lastRecord = await getLastLotteryByKind(lottery.kind);

	if (lastRecord == null) return;

	return {
		...lottery,
		draw: String(Number(lastRecord.draw) + 1),
	};
}
