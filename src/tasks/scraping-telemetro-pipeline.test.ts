import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Lottery } from "@/types/lottery";

vi.mock("@/tasks/database", () => ({
	getLastLottery: vi.fn(),
	addLotteriesData: vi.fn(),
}));
vi.mock("@/tasks/scraping-telemetro", () => ({
	getLotteryData: vi.fn(),
}));
vi.mock("@/tasks/telemetro", () => ({
	mapTelemetro: vi.fn(),
}));
vi.mock("@/tasks/notification", () => ({
	sendNotification: vi.fn(),
}));

import { addLotteriesData, getLastLottery } from "@/tasks/database";
import { sendNotification } from "@/tasks/notification";
import { getLotteryData } from "@/tasks/scraping-telemetro";
import { runScrapingTelemetroPipeline } from "@/tasks/scraping-telemetro-pipeline";
import { mapTelemetro } from "@/tasks/telemetro";

const mockGetLastLottery = vi.mocked(getLastLottery);
const mockAddLotteriesData = vi.mocked(addLotteriesData);
const mockGetLotteryData = vi.mocked(getLotteryData);
const mockMapTelemetro = vi.mocked(mapTelemetro);
const mockSendNotification = vi.mocked(sendNotification);

const scrapedLottery = {
	draw: "[PENDING]",
	dateTitle: "Viernes 14 de Marzo",
	date: "2026-03-14T20:00:00.000Z",
	firstPrize: "12345",
	secondPrize: "67890",
	thirdPrize: "11111",
	letters: "ABC",
	serie: "1",
	folio: "1",
	kind: 1 as const,
};

const emptyScrapedLottery = {
	...scrapedLottery,
	firstPrize: "",
	secondPrize: "",
	thirdPrize: "",
};

const mappedLottery = { ...scrapedLottery, draw: "3002" };

const newLastLottery = (lastRecord: Lottery | null = null) => ({
	currentDate: "2026-03-14",
	lastRecord,
	isNew: true,
});

describe("runScrapingTelemetroPipeline", () => {
	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => {});
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("skips when the last lottery is not new", async () => {
		mockGetLastLottery.mockResolvedValueOnce({
			currentDate: "2026-03-14",
			lastRecord: null,
			isNew: false,
		});

		const result = await runScrapingTelemetroPipeline();

		expect(result).toEqual({ status: "skipped", reason: "not-new" });
		expect(mockGetLotteryData).not.toHaveBeenCalled();
	});

	it("skips when the scraped prizes are all empty", async () => {
		mockGetLastLottery.mockResolvedValueOnce(newLastLottery());
		mockGetLotteryData.mockResolvedValueOnce(emptyScrapedLottery);

		const result = await runScrapingTelemetroPipeline();

		expect(result).toEqual({ status: "skipped", reason: "empty-scrape" });
		expect(mockMapTelemetro).not.toHaveBeenCalled();
	});

	it("skips when mapping the scraped result is undefined", async () => {
		mockGetLastLottery.mockResolvedValueOnce(newLastLottery());
		mockGetLotteryData.mockResolvedValueOnce(scrapedLottery);
		mockMapTelemetro.mockResolvedValueOnce(undefined);

		const result = await runScrapingTelemetroPipeline();

		expect(result).toEqual({ status: "skipped", reason: "mapping-failed" });
		expect(mockAddLotteriesData).not.toHaveBeenCalled();
	});

	it("skips as a duplicate draw when the last record is from the same day", async () => {
		mockGetLastLottery.mockResolvedValueOnce(
			newLastLottery({ ...mappedLottery, date: mappedLottery.date }),
		);
		mockGetLotteryData.mockResolvedValueOnce(scrapedLottery);
		mockMapTelemetro.mockResolvedValueOnce(mappedLottery);

		const result = await runScrapingTelemetroPipeline();

		expect(result).toEqual({ status: "skipped", reason: "duplicate-draw" });
		expect(mockAddLotteriesData).not.toHaveBeenCalled();
	});

	it("does not send a notification when the draw already existed in the database", async () => {
		mockGetLastLottery.mockResolvedValueOnce(
			newLastLottery({ ...mappedLottery, date: "2026-03-13T20:00:00.000Z" }),
		);
		mockGetLotteryData.mockResolvedValueOnce(scrapedLottery);
		mockMapTelemetro.mockResolvedValueOnce(mappedLottery);
		mockAddLotteriesData.mockResolvedValueOnce(false);

		const result = await runScrapingTelemetroPipeline();

		expect(result).toEqual({ status: "not-added", lottery: mappedLottery });
		expect(mockSendNotification).not.toHaveBeenCalled();
	});

	it("saves the new draw and sends a notification when it was added", async () => {
		mockGetLastLottery.mockResolvedValueOnce(
			newLastLottery({ ...mappedLottery, date: "2026-03-13T20:00:00.000Z" }),
		);
		mockGetLotteryData.mockResolvedValueOnce(scrapedLottery);
		mockMapTelemetro.mockResolvedValueOnce(mappedLottery);
		mockAddLotteriesData.mockResolvedValueOnce(true);

		const result = await runScrapingTelemetroPipeline();

		expect(mockAddLotteriesData).toHaveBeenCalledWith([mappedLottery]);
		expect(mockSendNotification).toHaveBeenCalledTimes(1);
		expect(result).toEqual({ status: "added", lottery: mappedLottery });
		if (result.status === "added") {
			expect(result.lottery.draw.length).toBeGreaterThan(0);
			expect(result.lottery.date.length).toBeGreaterThan(0);
		}
	});

	it("works when there is no previous record at all", async () => {
		mockGetLastLottery.mockResolvedValueOnce(newLastLottery(null));
		mockGetLotteryData.mockResolvedValueOnce(scrapedLottery);
		mockMapTelemetro.mockResolvedValueOnce(mappedLottery);
		mockAddLotteriesData.mockResolvedValueOnce(true);

		const result = await runScrapingTelemetroPipeline();

		expect(result).toEqual({ status: "added", lottery: mappedLottery });
		expect(mockSendNotification).toHaveBeenCalledTimes(1);
	});
});
