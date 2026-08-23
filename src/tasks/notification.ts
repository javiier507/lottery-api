import { getDevicesToken } from "@/db/repositories/device.repository";

const NOTIFICATION_TOPIC = {
	title: "Lotería Pty",
	body: "Nuevo sorteo disponible",
} as const;

const MAX_BATCH_SIZE = 100;

function chunkArray<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

export async function sendNotification() {
	const deviceTokens = await getDevicesToken();
	const notifications = deviceTokens.map((device) => ({
		title: NOTIFICATION_TOPIC.title,
		body: NOTIFICATION_TOPIC.body,
		to: device.token,
	}));

	const batches = chunkArray(notifications, MAX_BATCH_SIZE);

	const results = await Promise.all(
		batches.map((batch) =>
			fetch("https://exp.host/--/api/v2/push/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(batch),
			}).then((response) => response.json()),
		),
	);

	console.log(results);
	return results;
}

if (require.main === module) {
	console.log("🚀 Starting notification process...");
	sendNotification()
		.then(() => console.log("✅ Notifications sent successfully"))
		.catch((error) => console.error("❌ Failed to send notifications:", error));
}
