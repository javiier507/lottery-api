import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { getLotteryByDraw } from "@/db/repositories/lottery.repository";
import { EditLotteryPageClient } from "./page.client";

export const metadata: Metadata = {
	title: "Lotería Pty - Edit Lottery",
	description: "Edit lottery draw",
};

export default async function EditLotteryPage({
	params,
}: {
	params: Promise<{ draw: string }>;
}) {
	const { draw } = await params;
	const lottery = await getLotteryByDraw(draw);

	if (!lottery) {
		notFound();
	}

	return (
		<Container>
			<EditLotteryPageClient lottery={lottery} draw={draw} />
		</Container>
	);
}
