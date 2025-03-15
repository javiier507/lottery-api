import { drizzle } from "drizzle-orm/libsql";
import "dotenv/config";

import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "@/utils/environment";

export const db = drizzle({
	connection: {
		url: TURSO_DATABASE_URL!,
		authToken: TURSO_AUTH_TOKEN!,
	},
});
