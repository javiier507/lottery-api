import { test } from "@playwright/test";

import { sendNotification } from "@/tasks/notification";

test("should send the notifications", async () => {
	await sendNotification();
});
