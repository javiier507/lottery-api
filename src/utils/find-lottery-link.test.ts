import { describe, expect, it } from "vitest";

import { filterLiveResultsLinks } from "./find-lottery-link";

describe("filterLiveResultsLinks", () => {
	it("matches the Gordito del Zodiaco title that does not start with EN VIVO |", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-gordito-del-zodiaco-hoy-2-octubre-la-loteria-nacional-panama-n6093798",
		]);

		expect(links).toHaveLength(1);
		expect(links[0]).toBe(
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-gordito-del-zodiaco-hoy-2-octubre-la-loteria-nacional-panama-n6093798",
		);
	});

	it("matches dominical results", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-dominical-hoy-la-loteria-nacional-panama-n6090925",
		]);

		expect(links).toHaveLength(1);
	});

	it("matches miercolito results with date in the middle", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-miercolito-la-loteria-nacional-hoy-30-septiembre-n6093535",
		]);

		expect(links).toHaveLength(1);
	});

	it("sorts by article id descending (most recent first)", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-dominical-hoy-la-loteria-nacional-panama-n6090925",
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-gordito-del-zodiaco-hoy-2-octubre-la-loteria-nacional-panama-n6093798",
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-miercolito-la-loteria-nacional-hoy-30-septiembre-n6093535",
		]);

		expect(links).toEqual([
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-gordito-del-zodiaco-hoy-2-octubre-la-loteria-nacional-panama-n6093798",
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-miercolito-la-loteria-nacional-hoy-30-septiembre-n6093535",
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-dominical-hoy-la-loteria-nacional-panama-n6090925",
		]);
	});

	it("deduplicates the same article linked multiple times", () => {
		const duplicate =
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-gordito-del-zodiaco-hoy-2-octubre-la-loteria-nacional-panama-n6093798";
		const links = filterLiveResultsLinks([duplicate, duplicate, duplicate]);

		expect(links).toHaveLength(1);
	});

	it("keeps a different slug for the same article id (redirect variants)", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-dominical-hoy-la-loteria-nacional-panama-n6090925",
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-dominical-hoy-la-loteria-nacional-de-panama-n6090925",
		]);

		expect(links).toHaveLength(2);
	});

	it("rejects video articles of the same draws", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/entretenimiento/video-sorteo-dominical-la-loteria-nacional-panama-del-27-septiembre-n6093150",
			"https://www.telemetro.com/entretenimiento/video-sorteo-miercolito-la-loteria-nacional-panama-del-30-septiembre-de-2026-n6093534",
		]);

		expect(links).toHaveLength(0);
	});

	it("rejects preview and contextual lottery articles", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/entretenimiento/loteria-nacional-panama-online-y-tv-cuando-y-donde-ver-los-resultados-del-sorteo-miercolito-n6091138",
			"https://www.telemetro.com/entretenimiento/gordito-del-zodiaco-se-juega-este-viernes-cual-es-la-fecha-del-sorteo-n6093378",
			"https://www.telemetro.com/entretenimiento/piramide-chakatin-el-sorteo-dominical-del-27-septiembre-2026-n6093160",
			"https://www.telemetro.com/entretenimiento/ganaste-chakatin-pega-el-sorteo-dominical-del-27-septiembre-2026-n6093183",
		]);

		expect(links).toHaveLength(0);
	});

	it("rejects hrefs outside the entretenimiento section", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/nacionales/en-vivo-resultados-del-sorteo-dominical-hoy-la-loteria-nacional-panama-n6090925",
			"https://www.google.com/entretenimiento/en-vivo-resultados-del-sorteo-dominical-n6090925",
			"",
		]);

		expect(links).toHaveLength(0);
	});

	it("normalizes relative hrefs", () => {
		const links = filterLiveResultsLinks([
			"/entretenimiento/en-vivo-resultados-del-gordito-del-zodiaco-hoy-2-octubre-la-loteria-nacional-panama-n6093798",
		]);

		expect(links).toEqual([
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-gordito-del-zodiaco-hoy-2-octubre-la-loteria-nacional-panama-n6093798",
		]);
	});

	it("matches a future extraordinario live results article", () => {
		const links = filterLiveResultsLinks([
			"https://www.telemetro.com/entretenimiento/en-vivo-resultados-del-sorteo-extraordinario-de-la-loteria-nacional-este-19-de-abril-n6099999",
		]);

		expect(links).toHaveLength(1);
	});
});
