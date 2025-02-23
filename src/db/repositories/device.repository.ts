import { db } from "@/db";
import { DeviceTable } from "@/db/schema";

export async function addDevice(token: string) {
	return db
		.insert(DeviceTable)
		.values({ token, createdAt: new Date().toISOString() })
		.onConflictDoNothing();
}

export async function getDevicesToken(): Promise<{ token: string }[]> {
	return db.select({ token: DeviceTable.token }).from(DeviceTable);
}
