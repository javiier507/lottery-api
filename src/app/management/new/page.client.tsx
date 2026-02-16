"use client";

import { LotteryForm } from "@/components/lottery-form";
import { addLotteryAction } from "./actions";
import type { Lottery } from "@/types/lottery";

export function NewLotteryPageClient() {
	return (
		<LotteryForm
			onSubmit={(data) => {
				return addLotteryAction(data as Lottery);
			}}
		/>
	);
}
