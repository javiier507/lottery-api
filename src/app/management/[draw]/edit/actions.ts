"use server";

import { redirect } from "next/navigation";

import { updateLottery } from "@/db/repositories/lottery.repository";
import type { Lottery } from "@/types/lottery";

export async function updateLotteryAction(draw: string, lottery: Lottery) {
	await updateLottery(draw, lottery);
	redirect("/management");
}
