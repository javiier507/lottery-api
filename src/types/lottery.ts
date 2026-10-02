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
	kind?: Kind | null;
};

export const TelemetroKindMap: Record<string, Kind> = {
	// extraordinario first: titles like "dominical extraordinario" must match 4
	extraordinario: 4,
	dominical: 1,
	miercolito: 2,
	gordito: 3,
} as const;
