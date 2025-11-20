import { LLM_API_KEY } from "@/utils/environment";

class FetchError extends Error {
	constructor(
		public url: string,
		public statusCode: number,
		public responseBody: string,
	) {
		super(`Fetch error: ${statusCode} for ${url}`);
		this.name = "FetchError";
	}
}

class LotteryScraper {
	private readonly MAIN_PAGE_URL =
		"https://www.laestrella.com.pa/tag/-/meta/lnb-loteria-nacional-de-beneficencia";
	private readonly OPENROUTER_API_URL =
		"https://openrouter.ai/api/v1/chat/completions";
	private readonly LLM_MODEL = "deepseek/deepseek-chat-v3.1";

	/**
	 * Fetches the main lottery page HTML
	 */
	private async fetchMainPage(): Promise<string> {
		console.log("Obteniendo página principal de lotería...");
		const response = await fetch(this.MAIN_PAGE_URL);

		if (!response.ok) {
			const responseBody = await response.text();
			throw new FetchError(this.MAIN_PAGE_URL, response.status, responseBody);
		}

		return await response.text();
	}

	/**
	 * Analyzes HTML content using LLM to find the most recent lottery results URL
	 */
	private async findMostRecentLotteryUrl(
		htmlContent: string,
		currentDate: Date,
	): Promise<string> {
		const response = await fetch(this.OPENROUTER_API_URL, {
			method: "POST",
			headers: this.getLLMHeaders(),
			body: JSON.stringify({
				model: this.LLM_MODEL,
				messages: [
					{
						role: "user",
						content: `Analiza esta página HTML de la lotería de Panamá. La fecha actual es ${currentDate.toLocaleDateString("es-PA")}. Busca enlaces que contengan la palabra "Resultados" en el texto del enlace y que tengan la fecha MÁS CERCANA a la fecha actual (puede ser la fecha actual o días anteriores). Extrae SOLO la URL del enlace de resultados con la fecha más reciente. Responde únicamente con la URL:\n\n${htmlContent}`,
					},
				],
				max_tokens: 100,
				temperature: 0.1,
			}),
		});

		if (!response.ok) {
			const responseBody = await response.text();
			throw new FetchError(
				this.OPENROUTER_API_URL,
				response.status,
				responseBody,
			);
		}

		const data = await response.json();
		const url = data.choices[0].message.content.trim();

		console.log("URL del sorteo más reciente encontrada:");
		console.log(url);

		return url;
	}

	/**
	 * Fetches the lottery page HTML from a specific URL
	 */
	private async fetchLotteryPage(url: string): Promise<string> {
		console.log("Obteniendo datos del sorteo más reciente:", url);
		const response = await fetch(url);

		if (!response.ok) {
			const responseBody = await response.text();
			throw new FetchError(url, response.status, responseBody);
		}

		return await response.text();
	}

	/**
	 * Extracts lottery data from HTML content using LLM
	 */
	private async extractLotteryData(htmlContent: string): Promise<string> {
		const response = await fetch(this.OPENROUTER_API_URL, {
			method: "POST",
			headers: this.getLLMHeaders(),
			body: JSON.stringify({
				model: this.LLM_MODEL,
				messages: [
					{
						role: "user",
						content: `Analiza esta página HTML de un sorteo de la Lotería Nacional de Beneficencia de Panamá y extrae EXACTAMENTE los siguientes datos en formato JSON:
            - primer_premio: número del primer premio
            - segundo_premio: número del segundo premio
            - tercer_premio: número del tercer premio
            - letras: las letras del sorteo
            - serie: número de serie
            - folio: número de folio
            - numero_sorteo: número del sorteo (puede aparecer con "No." al inicio)
            - fecha: fecha del sorteo

            Responde SOLO con un objeto JSON válido con estos datos:\n\n${htmlContent}`,
					},
				],
				max_tokens: 150,
				temperature: 0.1,
			}),
		});

		if (!response.ok) {
			const responseBody = await response.text();
			throw new FetchError(
				this.OPENROUTER_API_URL,
				response.status,
				responseBody,
			);
		}

		const data = await response.json();
		return data.choices[0].message.content;
	}

	/**
	 * Returns the common headers needed for LLM API requests
	 */
	private getLLMHeaders(): Record<string, string> {
		return {
			Authorization: `Bearer ${LLM_API_KEY}`,
			"HTTP-Referer": "https://lottery-pty.vercel.app/",
			"X-Title": "Lotería de Panamá",
			"Content-Type": "application/json",
		};
	}

	/**
	 * Validates that the URL is valid
	 */
	private validateUrl(url: string): void {
		if (!url.startsWith("http")) {
			throw new Error("No se encontró una URL válida del sorteo más reciente");
		}
	}

	/**
	 * Main method to scrape and extract lottery results
	 */
	async scrape(): Promise<string> {
		const currentDate = new Date();
		console.log("Fecha actual:", currentDate.toLocaleDateString("es-PA"));

		// Fetch main page
		const mainPageHtml = await this.fetchMainPage();

		// Find most recent lottery URL
		const mostRecentUrl = await this.findMostRecentLotteryUrl(
			mainPageHtml,
			currentDate,
		);

		// Validate URL
		this.validateUrl(mostRecentUrl);

		// Fetch lottery page
		const lotteryPageHtml = await this.fetchLotteryPage(mostRecentUrl);

		// Extract lottery data
		const lotteryResults = await this.extractLotteryData(lotteryPageHtml);

		return lotteryResults;
	}
}

// Main execution
(async () => {
	console.time("Scrapping LLM Execution");
	try {
		const scraper = new LotteryScraper();
		const results = await scraper.scrape();

		console.log("\n=== RESULTADOS DE LA LOTERÍA DE PANAMÁ ===");
		console.log(results);
	} catch (error) {
		if (error instanceof FetchError) {
			console.error("\n=== ERROR EN PETICIÓN FETCH ===");
			console.error("URL:", error.url);
			console.error("Código HTTP:", error.statusCode);
			console.error("Cuerpo de la respuesta:", error.responseBody);
		} else {
			console.error("\n=== ERROR GENÉRICO ===");
			console.error("Error:", error);
		}
	} finally {
		console.timeEnd("Scrapping LLM Execution");
	}
})();
