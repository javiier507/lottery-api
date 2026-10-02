const TELEMETRO_BASE = "https://www.telemetro.com";

const SLUG_PREFIX = "en-vivo-resultados-del-";
const RESULTS_SLUG_PATTERN = new RegExp(
	`^${SLUG_PREFIX}.+-la-loteria-nacional.*-n\\d+$`,
);

export function normalizeTelemetroHref(href: string): string {
	const trimmed = href.trim();
	if (trimmed.startsWith("http")) {
		return trimmed;
	}

	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return `${TELEMETRO_BASE}${withLeadingSlash}`;
}

function toSlug(href: string): string | undefined {
	let pathname: string;
	try {
		pathname = new URL(href).pathname;
	} catch {
		return undefined;
	}

	const match = pathname.match(/^\/entretenimiento\/(.+)$/);
	if (!match) return undefined;

	return match[1].toLowerCase();
}

/**
 * Given all hrefs scraped from a Telemetro page, returns the unique links to
 * live lottery results articles ("EN VIVO | Resultados del sorteo ..."), most
 * recent first.
 */
export function filterLiveResultsLinks(links: string[]): string[] {
	const seen = new Set<string>();
	const candidates: Array<{ href: string; id: number }> = [];

	for (const link of links) {
		const normalized = normalizeTelemetroHref(link);
		const slug = toSlug(normalized);
		if (!slug || !RESULTS_SLUG_PATTERN.test(slug)) continue;

		if (seen.has(slug)) continue;
		seen.add(slug);

		const idMatch = slug.match(/-n(\d+)$/);
		if (!idMatch) continue;

		candidates.push({ href: normalized, id: Number(idMatch[1]) });
	}

	return candidates
		.sort((a, b) => b.id - a.id)
		.map((candidate) => candidate.href);
}
