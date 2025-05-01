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

function getLimitDate(currentDate: Date) {
	const limitDate = new Date(currentDate.toString());
	limitDate.setUTCHours(20);
	limitDate.setUTCMinutes(30);
	limitDate.setUTCMilliseconds(0);
	return limitDate;
}

export function getMaxAge(currentDate: Date): MaxAge {
	currentDate.setUTCMilliseconds(0);
	const hour = currentDate.getUTCHours();
	const minutes = currentDate.getUTCMinutes();

	let expirationDate = new Date(currentDate.toString());

	const setToLimitDate = () => {
		const diffMinutes = calculateMinutesBetweenDates(
			expirationDate,
			getLimitDate(currentDate),
		);
		expirationDate = addMinutes(expirationDate, diffMinutes);
	};

	switch (true) {
		case hour <= 18:
			expirationDate = addMinutes(expirationDate, 60);
			break;
		case hour === 19:
			setToLimitDate();
			break;
		case hour === 20 && minutes < 30:
			setToLimitDate();
			break;
		case hour === 20 && minutes >= 30:
			expirationDate = addMinutes(expirationDate, 2);
			break;
		case hour === 21 && minutes < 30:
			expirationDate = addMinutes(expirationDate, 2);
			break;
		case hour === 21 && minutes >= 30:
			expirationDate = addMinutes(expirationDate, 60);
			break;
		case hour >= 22:
			expirationDate = addMinutes(expirationDate, 60);
			break;
	}

	const seconds = calculateSecondsBetweenDates(currentDate, expirationDate);

	return {
		currentDate,
		expirationDate,
		seconds: Math.trunc(seconds),
	};
}
