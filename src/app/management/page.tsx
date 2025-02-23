import Link from "next/link";

import { LotteryTableWrapper } from "@/components/lottery-table-wrapper";
import { Container } from "@/components/container";

import { getLotteries } from "@/db/repositories/lottery.repository";

export const dynamic = "force-dynamic";

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
			<LotteryTableWrapper lotteries={lotteries.records} />
			<Link
				href="/handler/sign-out"
				className="mt-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
			>
				Sign Out
			</Link>
		</Container>
	);
}
