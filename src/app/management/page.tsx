import Link from "next/link";
import type { Metadata } from "next";

import LotteryTable from "@/components/lottery-table";
import { Container } from "@/components/container";
import { getLotteries } from "@/db/repositories/lottery.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Lotería Pty - Management",
	description: "Management lotteries",
};

export default async function ManagementPage() {
	const lotteries = await getLotteries();
	return (
		<Container>
			<Link
				href="/management/new"
				className="mb-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
			>
				Create New Lottery
			</Link>
			<LotteryTable lotteries={lotteries.records} />
			<Link
				href="/handler/sign-out"
				className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
			>
				Sign Out
			</Link>
		</Container>
	);
}
