import * as chrono from "chrono-node";

const SPANISH_MONTHS: Record<string, string> = {
	enero: "January",
	febrero: "February",
	marzo: "March",
	abril: "April",
	mayo: "May",
	junio: "June",
	julio: "July",
	agosto: "August",
	septiembre: "September",
	octubre: "October",
	noviembre: "November",
	diciembre: "December",
};

function translateSpanishDate(text: string): string {
	return text.replace(
		/(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+de\s+(\d{4})/gi,
		(_, day, month, year) =>
			`${day} ${SPANISH_MONTHS[month.toLowerCase()]} ${year}`,
	);
}

export function parseSemanticDate(text: string): Date {
	const translated = translateSpanishDate(text);
	const date = chrono.parseDate(translated);
	if (!date) throw new Error(`Could not parse date from: "${text}"`);
	return date;
}
