"use server";

import { redirect } from "next/navigation";

import { addLotteries } from "@/db/repositories/lottery.repository";
import { Lottery } from "@/types/lottery";

export async function addLotteryAction(lottery: Lottery) {
	await addLotteries([lottery]);
	redirect("/management");
}
