import { describe, expect, it } from "vitest";

import { extractKindFromTitle } from "../src/utils/extract-kind-from-title";

describe("extractKindFromTitle", () => {
	it("detects dominical", () => {
		expect(
			extractKindFromTitle(
				"EN VIVO | Resultados del sorteo dominical de hoy de la Lotería Nacional de Panamá",
			),
		).toBe(1);
	});

	it("detects miercolito", () => {
		expect(
			extractKindFromTitle(
				"EN VIVO | Resultados del sorteo miercolito de la Lotería Nacional del 11 de marzo de 2026",
			),
		).toBe(2);
	});

	it("detects gordito", () => {
		expect(
			extractKindFromTitle(
				"Resultados del sorteo gordito de la Lotería Nacional",
			),
		).toBe(3);
	});

	it("detects extraordinario", () => {
		expect(
			extractKindFromTitle(
				"EN VIVO | Resultados del Sorteo Extraordinario de la Lotería Nacional este 19 de abril",
			),
		).toBe(4);
	});

	it("is case-insensitive", () => {
		expect(extractKindFromTitle("SORTEO DOMINICAL de la Lotería")).toBe(1);
	});

	it("returns undefined when no kind matches", () => {
		expect(extractKindFromTitle("texto sin tipo de sorteo")).toBeUndefined();
	});
});
