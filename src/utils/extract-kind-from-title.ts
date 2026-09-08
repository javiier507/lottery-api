import type { Kind } from "@/types/lottery";
import { TelemetroKindMap } from "@/types/lottery";

export function extractKindFromTitle(title: string): Kind | undefined {
	const titleLower = title.toLowerCase();
	for (const [key, value] of Object.entries(TelemetroKindMap)) {
		if (titleLower.includes(key)) {
			return value;
		}
	}
	return undefined;
}
