import { describe, expect, it } from "vitest";

import { getMaxAge } from "./cache";

// Daily cache schedule. Ranges include the start and exclude the end.
// Panama (UTC-5) | UTC                    | Cache duration
// 00:00–15:30    | 05:00–20:30            | Up to 1 hour; expires by 15:30 Panama
// 15:30–18:00    | 20:30–23:00            | Up to 30 seconds; expires by 18:00 Panama
// 18:00–24:00    | 23:00–05:00 (next day) | 1 hour
// UTC methods keep this schedule independent of the server's time zone.
describe("max age (Panama time)", () => {
	it.each([
		[
			"caches for one hour before the short-cache window",
			"2024-12-15T10:00:00-05:00",
			"2024-12-15T11:00:00-05:00",
			3600,
		],
		[
			"allows a full hour ending exactly at 15:30",
			"2024-12-15T14:30:00-05:00",
			"2024-12-15T15:30:00-05:00",
			3600,
		],
		[
			"caps a 15:15 response at 15:30",
			"2024-12-15T15:15:00-05:00",
			"2024-12-15T15:30:00-05:00",
			900,
		],
		[
			"caps the cache ten seconds before 15:30",
			"2024-12-15T15:29:50-05:00",
			"2024-12-15T15:30:00-05:00",
			10,
		],
		[
			"rounds down to zero just before 15:30",
			"2024-12-15T15:29:59.999-05:00",
			"2024-12-15T15:30:00-05:00",
			0,
		],
		[
			"starts the 30-second cache exactly at 15:30",
			"2024-12-15T15:30:00-05:00",
			"2024-12-15T15:30:30-05:00",
			30,
		],
		[
			"preserves milliseconds within the short-cache window",
			"2024-12-15T16:00:23.031-05:00",
			"2024-12-15T16:00:53.031-05:00",
			30,
		],
		[
			"allows 30 seconds ending exactly at 18:00",
			"2024-12-15T17:59:30-05:00",
			"2024-12-15T18:00:00-05:00",
			30,
		],
		[
			"caps the cache ten seconds before 18:00",
			"2024-12-15T17:59:50-05:00",
			"2024-12-15T18:00:00-05:00",
			10,
		],
		[
			"rounds down to zero just before 18:00",
			"2024-12-15T17:59:59.999-05:00",
			"2024-12-15T18:00:00-05:00",
			0,
		],
		[
			"resumes the one-hour cache exactly at 18:00",
			"2024-12-15T18:00:00-05:00",
			"2024-12-15T19:00:00-05:00",
			3600,
		],
		[
			"caches for one hour across UTC midnight",
			"2024-12-15T18:30:00-05:00",
			"2024-12-15T19:30:00-05:00",
			3600,
		],
		[
			"caches for one hour after UTC midnight",
			"2024-12-15T19:00:00-05:00",
			"2024-12-15T20:00:00-05:00",
			3600,
		],
		[
			"caches for one hour across Panama midnight",
			"2024-12-15T23:45:00-05:00",
			"2024-12-16T00:45:00-05:00",
			3600,
		],
		[
			"caches for one hour across the year boundary",
			"2024-12-31T23:45:00-05:00",
			"2025-01-01T00:45:00-05:00",
			3600,
		],
	])("%s", (_scenario, input, expiration, seconds) => {
		const result = getMaxAge(new Date(input));

		expect(result.expirationDate).toEqual(new Date(expiration));
		expect(result.seconds).toBe(seconds);
	});

	it("does not change the supplied date, including milliseconds", () => {
		const currentDate = new Date("2024-12-15T15:29:50.123-05:00");
		const originalTimestamp = currentDate.getTime();

		const result = getMaxAge(currentDate);

		expect(currentDate.getTime()).toBe(originalTimestamp);
		expect(result.currentDate.getTime()).toBe(originalTimestamp);
		expect(result.expirationDate).toEqual(
			new Date("2024-12-15T15:30:00-05:00"),
		);
		expect(result.seconds).toBe(9);
	});
});
