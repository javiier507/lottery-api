import { z } from "zod";

import { addDevice } from "@/db/repositories/device.repository";

const deviceSchema = z.object({
	token: z.string(),
});

export async function POST(request: Request) {
	const json = await request.json();
	const parsed = deviceSchema.safeParse(json);
	if (!parsed.success) {
		return Response.json(
			{ message: "The parameters do not comply with the correct format" },
			{ status: 400 },
		);
	}

	return addDevice(parsed.data.token)
		.then(() => {
			return Response.json({ message: "Device added" });
		})
		.catch((e) => {
			console.error("Error: Add Device");
			console.error(e);
			return Response.json(
				{ message: "Sorry, something went wrong" },
				{ status: 500 },
			);
		});
}
