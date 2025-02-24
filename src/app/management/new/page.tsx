import type { Metadata } from "next";

import { Container } from "@/components/container";
import { NewLotteryPageClient } from "./page.client";

export const metadata: Metadata = {
	title: "Lotería Pty - New Lottery",
	description: "Create a new lottery",
};

export default function NewLotteryPage() {
	return (
		<Container>
			<NewLotteryPageClient />
		</Container>
	);
}
