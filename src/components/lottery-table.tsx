import type { Lottery } from "@/types/lottery";

interface LotteryTableProps {
	lotteries?: Lottery[];
}

export default function LotteryTable({ lotteries = [] }: LotteryTableProps) {
	if (!lotteries || lotteries.length === 0) {
		return (
			<div className="mt-4 rounded-lg border border-gray-200 p-6 text-center">
				<p className="text-sm text-gray-500">No lottery data available</p>
			</div>
		);
	}

	return (
		<div className="mt-4">
			{/* Desktop Table - hidden on mobile */}
			<div className="hidden md:block w-full overflow-hidden rounded-lg border border-gray-200">
				<div className="w-full overflow-x-auto">
					<table className="w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Draw
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Date Title
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Date
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									First Prize
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Second Prize
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Third Prize
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Letters
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Serie
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Folio
								</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
									Kind
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{lotteries.map((lottery, index) => (
								<tr key={`${lottery.draw}-${index}`}>
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
									<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
										{lottery.kind ?? "-"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Mobile Cards - hidden on desktop */}
			<div className="md:hidden space-y-4">
				{lotteries.map((lottery, index) => (
					<div
						key={`${lottery.draw}-${index}`}
						className="rounded-lg border border-gray-200 bg-white p-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-xs font-medium text-gray-500">Draw</p>
								<p className="mt-1 text-sm text-gray-900">{lottery.draw}</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500">Date Title</p>
								<p className="mt-1 text-sm text-gray-900">
									{lottery.dateTitle}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500">Date</p>
								<p className="mt-1 text-sm text-gray-900">{lottery.date}</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500">First Prize</p>
								<p className="mt-1 text-sm text-gray-900">
									{lottery.firstPrize}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500">
									Second Prize
								</p>
								<p className="mt-1 text-sm text-gray-900">
									{lottery.secondPrize}
								</p>
							</div>
							<div>
								<p className="text-xs font-medium text-gray-500">Third Prize</p>
								<p className="mt-1 text-sm text-gray-900">
									{lottery.thirdPrize}
								</p>
							</div>
							{lottery.letters && (
								<div>
									<p className="text-xs font-medium text-gray-500">Letters</p>
									<p className="mt-1 text-sm text-gray-900">
										{lottery.letters}
									</p>
								</div>
							)}
							{lottery.serie && (
								<div>
									<p className="text-xs font-medium text-gray-500">Serie</p>
									<p className="mt-1 text-sm text-gray-900">{lottery.serie}</p>
								</div>
							)}
							{lottery.folio && (
								<div>
									<p className="text-xs font-medium text-gray-500">Folio</p>
									<p className="mt-1 text-sm text-gray-900">{lottery.folio}</p>
								</div>
							)}
							{lottery.kind && (
								<div>
									<p className="text-xs font-medium text-gray-500">Kind</p>
									<p className="mt-1 text-sm text-gray-900">{lottery.kind}</p>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
