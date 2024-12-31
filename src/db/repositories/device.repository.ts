import { db } from "@/db";
import { DeviceTable } from "@/db/schema";

export async function addDevice(token: string) {
  return db.insert(DeviceTable).values({ token, createdAt: new Date().toISOString() }).onConflictDoNothing();
}
