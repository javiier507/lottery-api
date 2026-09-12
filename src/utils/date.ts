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

export function isSameDay(a: string, b: string): boolean {
	return a.slice(0, 10) === b.slice(0, 10);
}
