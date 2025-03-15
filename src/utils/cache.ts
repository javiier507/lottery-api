import { calculateSecondsBetweenDates } from "./date";

type MaxAge = {
	currentDate: Date;
	limitDate: Date;
	seconds: number;
};

export function getMaxAge(currentDate: Date): MaxAge {
	currentDate.setUTCMilliseconds(0);
	const hour = currentDate.getUTCHours();
	const minutes = currentDate.getUTCMinutes();

	const limitDate = new Date(currentDate.toString());
	limitDate.setUTCHours(20);
	limitDate.setUTCMinutes(30);
	limitDate.setUTCMilliseconds(0);

	if (hour === 20 && minutes > 30) {
		limitDate.setUTCMinutes(minutes + 2);
	} else if (hour === 21) {
		limitDate.setUTCHours(21);
		limitDate.setUTCMinutes(minutes + 2);
	} else if (hour > 21) {
		limitDate.setUTCDate(limitDate.getUTCDate() + 1);
	}

	const seconds = calculateSecondsBetweenDates(currentDate, limitDate);

	return {
		currentDate,
		limitDate,
		seconds: Math.trunc(seconds),
	};
}
