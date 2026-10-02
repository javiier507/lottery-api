import { describe, expect, it } from "vitest";

import { extractKindFromTitle } from "./extract-kind-from-title";

describe("extractKindFromTitle", () => {
	describe("dominical", () => {
		it("detects dominical", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo dominical de hoy de la Lotería Nacional de Panamá",
				),
			).toBe(1);
		});

		it("detects dominical (27 de septiembre)", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo Dominical de hoy, 27 de septiembre, de la Lotería Nacional de Panamá",
				),
			).toBe(1);
		});

		it("detects dominical (20 de septiembre)", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo Dominical de hoy, 20 de septiembre, de la Lotería Nacional de Panamá",
				),
			).toBe(1);
		});
	});

	describe("miercolito", () => {
		it("detects miercolito", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo miercolito de la Lotería Nacional del 11 de marzo de 2026",
				),
			).toBe(2);
		});

		it("detects miercolito (30 de septiembre)", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo Miercolito de la Lotería Nacional de hoy, 30 de septiembre",
				),
			).toBe(2);
		});

		it("detects miercolito (23 de septiembre)", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo Miercolito de la Lotería Nacional de hoy, 23 de septiembre",
				),
			).toBe(2);
		});

		it("detects miercolito (16 de septiembre)", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo Miercolito de la Lotería Nacional de hoy, 16 de septiembre",
				),
			).toBe(2);
		});

		it("detects miercolito de hoy", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo miercolito de hoy de la Lotería Nacional de Panamá",
				),
			).toBe(2);
		});
	});

	describe("gordito", () => {
		it("detects gordito", () => {
			expect(
				extractKindFromTitle(
					"Resultados del sorteo gordito de la Lotería Nacional",
				),
			).toBe(3);
		});

		it("detects Gordito del Zodiaco (2 de octubre)", () => {
			expect(
				extractKindFromTitle(
					"¡EN VIVO! Resultados del Gordito del Zodiaco de hoy, 2 de octubre de la Lotería Nacional de Panamá",
				),
			).toBe(3);
		});
	});

	describe("extraordinario", () => {
		it("detects extraordinario", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del Sorteo Extraordinario de la Lotería Nacional este 19 de abril",
				),
			).toBe(4);
		});

		it("gives extraordinario priority in a dominical extraordinario title", () => {
			expect(
				extractKindFromTitle(
					"EN VIVO | Resultados del sorteo dominical extraordinario de la Lotería Nacional del 16 de agosto del 2026",
				),
			).toBe(4);
		});
	});

	describe("generic", () => {
		it("is case-insensitive", () => {
			expect(extractKindFromTitle("SORTEO DOMINICAL de la Lotería")).toBe(1);
		});

		it("returns undefined when no kind matches", () => {
			expect(extractKindFromTitle("texto sin tipo de sorteo")).toBeUndefined();
		});
	});
});
