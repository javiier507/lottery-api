type MaxAge = {
	currentDate: Date;
	expirationDate: Date;
	seconds: number;
};

const SHORT_CACHE_SECONDS = 30;
const DEFAULT_CACHE_SECONDS = 3600;

export function getMaxAge(currentDate: Date): MaxAge {
	// Panama (UTC-5): the short-cache window is 15:30–18:00 every day.
	const windowStart = new Date(currentDate);
	windowStart.setUTCHours(20, 30, 0, 0);
	const windowEnd = new Date(currentDate);
	windowEnd.setUTCHours(23, 0, 0, 0);

	let expirationTime = currentDate.getTime() + DEFAULT_CACHE_SECONDS * 1000;
	if (currentDate < windowStart) {
		expirationTime = Math.min(expirationTime, windowStart.getTime());
	} else if (currentDate < windowEnd) {
		expirationTime = Math.min(
			currentDate.getTime() + SHORT_CACHE_SECONDS * 1000,
			windowEnd.getTime(),
		);
	}

	const expirationDate = new Date(expirationTime);

	return {
		currentDate,
		expirationDate,
		seconds: Math.floor(
			(expirationDate.getTime() - currentDate.getTime()) / 1000,
		),
	};
}
