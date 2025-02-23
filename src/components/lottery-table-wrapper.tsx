"use client";

import { useEffect, useState } from "react";
import LotteryTable from "./lottery-table";
import LotteryTableMobile from "./lottery-table-mobile";

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

interface LotteryTableWrapperProps {
	lotteries?: Lottery[];
	onRowClick?: (lottery: Lottery) => void;
}

export function LotteryTableWrapper({
	lotteries = [],
	onRowClick,
}: LotteryTableWrapperProps) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Initial check
		checkIfMobile();

		// Add event listener
		window.addEventListener("resize", checkIfMobile);

		// Cleanup
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	return isMobile ? (
		<LotteryTableMobile lotteries={lotteries} onRowClick={onRowClick} />
	) : (
		<LotteryTable lotteries={lotteries} onRowClick={onRowClick} />
	);
}
