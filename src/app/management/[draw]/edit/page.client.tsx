"use client";

import { LotteryForm } from "@/components/lottery-form";
import { updateLotteryAction } from "./actions";
import type { Lottery } from "@/types/lottery";

export function EditLotteryPageClient({
	lottery,
	draw,
}: {
	lottery: Lottery;
	draw: string;
}) {
	return (
		<LotteryForm
			defaultValues={{
				...lottery,
				kind: lottery.kind ?? undefined,
				letters: lottery.letters ?? undefined,
				serie: lottery.serie ?? undefined,
				folio: lottery.folio ?? undefined,
			}}
			onSubmit={(data) => {
				return updateLotteryAction(draw, data as Lottery);
			}}
		/>
	);
}
