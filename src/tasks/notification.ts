import { getDevicesToken } from "@/db/repositories/device.repository";

const NOTIFICATION_TOPIC = {
	title: "Lotería Pty",
	body: "Nuevo sorteo disponible",
} as const;

export async function sendNotification() {
	const deviceTokens = await getDevicesToken();
	const toList = deviceTokens.map((device) => ({
		title: NOTIFICATION_TOPIC.title,
		body: NOTIFICATION_TOPIC.body,
		to: device.token,
	}));

	return fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(toList),
	})
		.then((response) => response.json())
		.then((response) => console.log(response))
		.catch((error) => console.error(error));
}

if (require.main === module) {
	console.log("🚀 Starting notification process...");
	sendNotification()
		.then(() => console.log("✅ Notifications sent successfully"))
		.catch((error) => console.error("❌ Failed to send notifications:", error));
}
