type MaxAge = {
	currentDate: Date;
	expirationDate: Date;
	seconds: number;
};

export function getMaxAge(currentDate: Date): MaxAge {
	// Panama (UTC-5): the short-cache window is 15:30–18:00 every day.
	const windowStart = new Date(currentDate);
	windowStart.setUTCHours(20, 30, 0, 0);
	const windowEnd = new Date(currentDate);
	windowEnd.setUTCHours(23, 0, 0, 0);

	const inWindow = currentDate >= windowStart && currentDate < windowEnd;
	const durationSeconds = inWindow ? 30 : 3600;
	const nextBoundary = inWindow ? windowEnd : new Date(windowStart);
	if (currentDate >= windowEnd) {
		nextBoundary.setUTCDate(nextBoundary.getUTCDate() + 1);
	}

	const expirationDate = new Date(
		Math.min(
			currentDate.getTime() + durationSeconds * 1000,
			nextBoundary.getTime(),
		),
	);

	return {
		currentDate,
		expirationDate,
		seconds: Math.floor(
			(expirationDate.getTime() - currentDate.getTime()) / 1000,
		),
	};
}
