type Lottery = {
	draw: string;
	dateTitle: string;
	date: string;
	firstPrize: string;
	secondPrize: string;
	thirdPrize: string;
	letters?: string | null;
	serie?: string | null;
	folio?: string | null;
};

interface LotteryTableProps {
	lotteries?: Lottery[];
	onRowClick?: (lottery: Lottery) => void;
}

export default function LotteryTable({
	lotteries = [],
	onRowClick,
}: LotteryTableProps) {
	if (!lotteries || lotteries.length === 0) {
		return (
			<div className="mt-4 rounded-lg border border-gray-200 p-6 text-center">
				<p className="text-sm text-gray-500">No lottery data available</p>
			</div>
		);
	}

	return (
		<div className="mt-4 w-full overflow-hidden rounded-lg border border-gray-200">
			<div className="w-full overflow-x-auto">
				<table className="w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								Draw
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								Date Title
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								Date
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								First Prize
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								Second Prize
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								Third Prize
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								Letters
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								Serie
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-left text-sm font-medium text-gray-500"
							>
								Folio
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{lotteries.map((lottery, index) => (
							<tr
								key={`${lottery.draw}-${index}`}
								onClick={() => onRowClick?.(lottery)}
								className={`${
									onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
								}`}
							>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									{lottery.draw}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									{lottery.dateTitle}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									{lottery.date}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									{lottery.firstPrize}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									{lottery.secondPrize}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									{lottery.thirdPrize}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{lottery.letters || "-"}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{lottery.serie || "-"}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									{lottery.folio || "-"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
