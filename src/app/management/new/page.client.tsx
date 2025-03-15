import { LotteryForm } from "@/components/lottery-form";
import { addLotteryAction } from "./actions";

export function NewLotteryPageClient() {
	return <LotteryForm onSubmit={addLotteryAction} />;
}
