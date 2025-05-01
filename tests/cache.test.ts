import { describe, expect, it } from "vitest";

import { getMaxAge } from "../src/utils/cache";

describe("max age", () => {
	it("when is earlier than 20:00 utc", () => {
		const result = getMaxAge(new Date("2024-12-15T19:42:23.031Z"));
		expect(result.expirationDate.getUTCHours()).toBe(20);
		expect(result.expirationDate.getUTCMinutes()).toBe(30);
		expect(result.seconds).toBe(2880); //  48 minutes
	});

	it("when is between 20:00 utc and 20:30 utc", () => {
		const result = getMaxAge(new Date("2024-12-15T20:20:23.031Z"));
		expect(result.expirationDate.getUTCHours()).toBe(20);
		expect(result.expirationDate.getUTCMinutes()).toBe(30);
		expect(result.seconds).toBe(600); //  10 minutos
	});

	it("when is between 20:30 utc and 21:00 utc", () => {
		const result = getMaxAge(new Date("2024-12-15T20:32:23.031Z"));
		expect(result.expirationDate.getUTCHours()).toBe(20);
		expect(result.expirationDate.getUTCMinutes()).toBe(34);
		expect(result.seconds).toBe(120); //  2 minutos
	});

	it("when is between 21:00 utc and 22:00 utc", () => {
		const result = getMaxAge(new Date("2024-12-15T21:01:23.031Z"));
		expect(result.expirationDate.getUTCHours()).toBe(21);
		expect(result.expirationDate.getUTCMinutes()).toBe(3);
		expect(result.seconds).toBe(120); //  2 minutos
	});

	it("when is between 21:30 utc and 22:00 utc", () => {
		const result = getMaxAge(new Date("2024-12-15T21:31:23.031Z"));
		expect(result.expirationDate.getUTCHours()).toBe(22);
		expect(result.expirationDate.getUTCMinutes()).toBe(31);
		expect(result.seconds).toBe(3600); //  1 hora
	});

	it("when is between 22:00 utc and forward", () => {
		const result = getMaxAge(new Date("2024-12-15T22:02:23.031Z"));
		expect(result.expirationDate.getUTCDate()).toBe(15);
		expect(result.expirationDate.getUTCHours()).toBe(23);
		expect(result.expirationDate.getUTCMinutes()).toBe(2);
		expect(result.seconds).toBe(3600); //  1 hora
	});
});
