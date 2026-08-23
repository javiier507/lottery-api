import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/db/repositories/device.repository", () => ({
	getDevicesToken: vi.fn(),
}));

import { getDevicesToken } from "../../src/db/repositories/device.repository";
import { sendNotification } from "../../src/tasks/notification";

const mockGetDevicesToken = vi.mocked(getDevicesToken);
const mockFetch = vi.fn();

const createMockFetchResponse = (data: unknown) => ({
	ok: true,
	json: vi.fn().mockResolvedValue(data),
});

const generateTokens = (count: number) =>
	Array.from({ length: count }, (_, index) => ({
		token: `token-${index + 1}`,
	}));

describe("sendNotification", () => {
	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
		mockFetch.mockResolvedValue(createMockFetchResponse({ ok: true }));
		vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.unstubAllGlobals();
	});

	it("does not call fetch when there are no device tokens", async () => {
		mockGetDevicesToken.mockResolvedValueOnce([]);

		const result = await sendNotification();

		expect(mockFetch).not.toHaveBeenCalled();
		expect(result).toEqual([]);
	});

	it("sends a single batch when there are 100 or fewer devices", async () => {
		const tokens = generateTokens(50);
		mockGetDevicesToken.mockResolvedValueOnce(tokens);

		const result = await sendNotification();

		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(mockFetch).toHaveBeenCalledWith(
			"https://exp.host/--/api/v2/push/send",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(
					tokens.map((device) => ({
						title: "Lotería Pty",
						body: "Nuevo sorteo disponible",
						to: device.token,
					})),
				),
			},
		);
		expect(result).toEqual([{ ok: true }]);
	});

	it("sends notifications in chunks of 100 devices", async () => {
		const tokens = generateTokens(250);
		mockGetDevicesToken.mockResolvedValueOnce(tokens);

		const result = await sendNotification();

		expect(mockFetch).toHaveBeenCalledTimes(3);

		const bodies = mockFetch.mock.calls.map((call) =>
			JSON.parse(call[1].body as string),
		);

		expect(bodies[0]).toHaveLength(100);
		expect(bodies[1]).toHaveLength(100);
		expect(bodies[2]).toHaveLength(50);
		expect(bodies.flat()).toHaveLength(250);
		expect(result).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
	});
});
