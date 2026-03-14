import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getLastLottery } from "../../src/tasks/database";

vi.mock("../../src/db/repositories/lottery.repository", () => ({
	addLotteries: vi.fn(),
	getLotteryDrawsByDraws: vi.fn(),
	getLotteries: vi.fn(),
}));

import { getLotteries } from "../../src/db/repositories/lottery.repository";

const mockGetLotteries = vi.mocked(getLotteries);

const FIXED_DATE = new Date("2026-03-14T12:00:00.000Z");

const baseLottery = {
	draw: "3001",
	dateTitle: "Viernes 14 de Marzo",
	firstPrize: "12345",
	secondPrize: "67890",
	thirdPrize: "11111",
};

describe("getLastLottery", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(FIXED_DATE);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it("returns currentDate in YYYY-MM-DD format", async () => {
		mockGetLotteries.mockResolvedValueOnce({ records: [], totalRecords: 0 });

		const result = await getLastLottery();

		expect(result.currentDate).toBe("2026-03-14");
	});

	it("returns lastRecord null and isNew false when there are no records", async () => {
		mockGetLotteries.mockResolvedValueOnce({ records: [], totalRecords: 0 });

		const result = await getLastLottery();

		expect(result.lastRecord).toBeNull();
		expect(result.isNew).toBe(false);
	});

	it("returns isNew false when lastRecord.date matches currentDate", async () => {
		const lottery = { ...baseLottery, date: "2026-03-14" };
		mockGetLotteries.mockResolvedValueOnce({
			records: [lottery],
			totalRecords: 1,
		});

		const result = await getLastLottery();

		expect(result.lastRecord).toEqual(lottery);
		expect(result.isNew).toBe(false);
	});

	it("returns isNew false when lastRecord.date has a timestamp but same date", async () => {
		const lottery = { ...baseLottery, date: "2026-03-14T20:30:00.000Z" };
		mockGetLotteries.mockResolvedValueOnce({
			records: [lottery],
			totalRecords: 1,
		});

		const result = await getLastLottery();

		expect(result.isNew).toBe(false);
	});

	it("returns isNew true when lastRecord.date is a different date", async () => {
		const lottery = { ...baseLottery, date: "2026-03-13" };
		mockGetLotteries.mockResolvedValueOnce({
			records: [lottery],
			totalRecords: 1,
		});

		const result = await getLastLottery();

		expect(result.lastRecord).toEqual(lottery);
		expect(result.isNew).toBe(true);
	});

	it("returns safe defaults when getLotteries throws", async () => {
		mockGetLotteries.mockRejectedValueOnce(new Error("DB error"));
		vi.spyOn(console, "error").mockImplementation(() => {});

		const result = await getLastLottery();

		expect(result.currentDate).toBe("2026-03-14");
		expect(result.lastRecord).toBeNull();
		expect(result.isNew).toBe(false);
	});
});
