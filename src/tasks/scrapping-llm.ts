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

(async () => {
	console.time("Scrapping LLM Execution");
	try {
		// 1. Obtener fecha actual
		const currentDate = new Date();
		console.log("Fecha actual:", currentDate.toLocaleDateString("es-PA"));

		// 2. Obtener página principal de lotería
		console.log("Obteniendo página principal de lotería...");
		const mainPageUrl =
			"https://www.laestrella.com.pa/tag/-/meta/lnb-loteria-nacional-de-beneficencia";
		const mainPageResponse = await fetch(mainPageUrl);

		if (!mainPageResponse.ok) {
			const responseBody = await mainPageResponse.text();
			throw new FetchError(mainPageUrl, mainPageResponse.status, responseBody);
		}

		const mainPageHtml = await mainPageResponse.text();

		// 3. Usar OpenRouter para analizar y extraer enlaces de sorteos
		const analysisUrl = "https://openrouter.ai/api/v1/chat/completions";
		const analysisResponse = await fetch(analysisUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${LLM_API_KEY}`,
				"HTTP-Referer": "https://lottery-pty.vercel.app/",
				"X-Title": "Lotería de Panamá",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "deepseek/deepseek-chat-v3.1",
				messages: [
					{
						role: "user",
						content: `Analiza esta página HTML de la lotería de Panamá. La fecha actual es ${currentDate.toLocaleDateString("es-PA")}. Busca enlaces que contengan la palabra "Resultados" en el texto del enlace y que tengan la fecha MÁS CERCANA a la fecha actual (puede ser la fecha actual o días anteriores). Extrae SOLO la URL del enlace de resultados con la fecha más reciente. Responde únicamente con la URL:\n\n${mainPageHtml}`,
					},
				],
				max_tokens: 100,
				temperature: 0.1,
			}),
		});

		if (!analysisResponse.ok) {
			const responseBody = await analysisResponse.text();
			throw new FetchError(analysisUrl, analysisResponse.status, responseBody);
		}

		const analysisData = await analysisResponse.json();
		const mostRecentUrl = analysisData.choices[0].message.content.trim();
		console.log("URL del sorteo más reciente encontrada:");
		console.log(mostRecentUrl);

		// 4. Validar que se obtuvo una URL válida
		if (!mostRecentUrl.startsWith("http")) {
			throw new Error("No se encontró una URL válida del sorteo más reciente");
		}
		console.log("Obteniendo datos del sorteo más reciente:", mostRecentUrl);

		const lotteryPageResponse = await fetch(mostRecentUrl);

		if (!lotteryPageResponse.ok) {
			const responseBody = await lotteryPageResponse.text();
			throw new FetchError(
				mostRecentUrl,
				lotteryPageResponse.status,
				responseBody,
			);
		}

		const lotteryPageHtml = await lotteryPageResponse.text();

		// 5. Extraer datos específicos del sorteo usando OpenRouter
		const dataExtractionUrl = "https://openrouter.ai/api/v1/chat/completions";
		const dataExtractionResponse = await fetch(dataExtractionUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${LLM_API_KEY}`,
				"HTTP-Referer": "https://lottery-pty.vercel.app/",
				"X-Title": "Lotería de Panamá",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "deepseek/deepseek-chat-v3.1",
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

            Responde SOLO con un objeto JSON válido con estos datos:\n\n${lotteryPageHtml}`,
					},
				],
				max_tokens: 150,
				temperature: 0.1,
			}),
		});

		if (!dataExtractionResponse.ok) {
			const responseBody = await dataExtractionResponse.text();
			throw new FetchError(
				dataExtractionUrl,
				dataExtractionResponse.status,
				responseBody,
			);
		}

		const extractionData = await dataExtractionResponse.json();
		const lotteryResults = extractionData.choices[0].message.content;

		console.log("\n=== RESULTADOS DE LA LOTERÍA DE PANAMÁ ===");
		console.log(lotteryResults);
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
