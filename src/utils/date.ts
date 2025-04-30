const MONTHS_MAP = new Map<string, number>([
	["enero", 0],
	["febrero", 1],
	["marzo", 2],
	["abril", 3],
	["mayo", 4],
	["junio", 5],
	["julio", 6],
	["agosto", 7],
	["septiembre", 8],
	["octubre", 9],
	["noviembre", 10],
	["diciembre", 11],
]);

export function getDate(dateString: string): Date {
	const splited = dateString.split(" ");
	const dayStr = splited.at(0);
	const monthStr = splited.at(2)?.toLowerCase();
	const yearStr = splited.at(4);

	if (!dayStr || !monthStr || !yearStr) throw new Error("Get Portions Date");

	const month = MONTHS_MAP.get(monthStr);
	if (typeof month !== "number") throw new Error("Get Month");

	const current = new Date();

	return new Date(
		Number.parseInt(yearStr),
		month,
		Number.parseInt(dayStr),
		current.getHours(),
		current.getMinutes(),
		current.getSeconds(),
	);
}

export function calculateSecondsBetweenDates(date1: Date, date2: Date) {
	// Ensure date1 is earlier than date2
	const earlierDate = date1 < date2 ? date1 : date2;
	const laterDate = date1 > date2 ? date1 : date2;

	// Calculate difference in milliseconds
	const diffMilliseconds = laterDate.getTime() - earlierDate.getTime();

	// Convert milliseconds to seconds
	const diffSeconds = diffMilliseconds / 1000;

	return diffSeconds;
}

export function addMinutes(date: Date, minutes: number): Date {
	const newDate = new Date(date);
	newDate.setUTCMinutes(newDate.getUTCMinutes() + minutes);
	return newDate;
}

export function calculateMinutesBetweenDates(date1: Date, date2: Date): number {
	const diff = date2.getTime() - date1.getTime();
	return Math.floor(diff / (1000 * 60));
}
