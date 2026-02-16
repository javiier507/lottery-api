export type Kind = 1 | 2 | 3 | 4;

export type Lottery = {
	draw: string;
	dateTitle: string;
	date: string;
	firstPrize: string;
	secondPrize: string;
	thirdPrize: string;
	letters?: string | null;
	serie?: string | null;
	folio?: string | null;
	kind?: Kind;
};

export const NationalLotteryKindMap: Record<number, Kind> = {
	0: 1,
	1: 2,
	2: 3,
	3: 4,
} as const;

export const TelemetroKindMap: Record<string, Kind> = {
	dominical: 1,
	miercolito: 2,
	gordito: 3,
	extraordinario: 4,
} as const;
