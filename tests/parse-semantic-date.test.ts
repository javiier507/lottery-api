import { describe, expect, it } from "vitest";

import { parseSemanticDate } from "../src/utils/parse-semantic-date";

describe("parseSemanticDate", () => {
	it("parses a full Spanish date string", () => {
		const result = parseSemanticDate("11 de marzo de 2026");
		expect(result.getFullYear()).toBe(2026);
		expect(result.getMonth()).toBe(2); // marzo = 2
		expect(result.getDate()).toBe(11);
	});

	it("extracts date from a long title", () => {
		const result = parseSemanticDate(
			"EN VIVO | Resultados del sorteo miercolito de la Lotería Nacional del 11 de marzo de 2026",
		);
		expect(result.getFullYear()).toBe(2026);
		expect(result.getMonth()).toBe(2);
		expect(result.getDate()).toBe(11);
	});

	it("parses all months correctly", () => {
		const cases: [string, number][] = [
			["enero", 0],
			["febrero", 1],
			["marzo", 2],
			["abril", 3],
			["mayo", 4],
			["junio", 5],
			["julio", 6],
			["agosto", 7],
			["septiembre", 8],
			["octubre", 9],
			["noviembre", 10],
			["diciembre", 11],
		];
		for (const [month, expected] of cases) {
			const result = parseSemanticDate(`1 de ${month} de 2026`);
			expect(result.getMonth(), `failed for ${month}`).toBe(expected);
		}
	});

	it("throws when date cannot be parsed", () => {
		expect(() => parseSemanticDate("texto sin fecha")).toThrow();
	});
});
