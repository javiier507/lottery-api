import {
	calculateSecondsBetweenDates,
	addMinutes,
	calculateMinutesBetweenDates,
} from "./date";

type MaxAge = {
	currentDate: Date;
	expirationDate: Date;
	seconds: number;
};

export function getMaxAge(currentDate: Date): MaxAge {
	currentDate.setUTCMilliseconds(0);
	const hour = currentDate.getUTCHours();
	const minutes = currentDate.getUTCMinutes();

	let expirationDate = new Date(currentDate.toString());

	const limitDate = new Date(currentDate.toString());
	limitDate.setUTCHours(20);
	limitDate.setUTCMinutes(30);
	limitDate.setUTCMilliseconds(0);

	if ((hour === 20 && minutes > 30) || (hour === 21 && minutes < 30)) {
		expirationDate = addMinutes(expirationDate, 2);
	} else if (hour >= 21) {
		expirationDate = addMinutes(expirationDate, 60);
	} else {
		const diffMinutes = calculateMinutesBetweenDates(expirationDate, limitDate);
		expirationDate = addMinutes(expirationDate, diffMinutes);
	}

	const seconds = calculateSecondsBetweenDates(currentDate, expirationDate);

	return {
		currentDate,
		expirationDate,
		seconds: Math.trunc(seconds),
	};
}
