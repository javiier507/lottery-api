import type { NextRequest } from "next/server";
import { z } from "zod";

import { getLotteries } from "@/db/repositories/lottery.repository";
import { getMaxAge } from "@/utils/cache";

export const dynamic = "force-dynamic";

const paginationSchema = z.object({
	limit: z.coerce.number().transform((x) => (x < 25 ? 25 : x)),
	offset: z.coerce.number().default(0),
});

export async function GET(request: NextRequest) {
	const queryParams = request.nextUrl.searchParams;

	const paginationParams = {
		limit: queryParams.get("limit"),
		offset: queryParams.get("offset"),
	};
	const parsed = paginationSchema.safeParse(paginationParams);
	if (!parsed.success) {
		return Response.json(
			{ message: "The parameters do not comply with the correct format" },
			{ status: 400 },
		);
	}

	return getLotteries(parsed.data)
		.then(async (data) => {
			const seconds = getMaxAge(new Date()).seconds;
			return Response.json(
				{ data },
				{
					headers: {
						"Cache-Control": `public, max-age=${seconds}`,
					},
				},
			);
		})
		.catch((e) => {
			console.error("Error: Get Lotteries");
			console.error(e);
			return Response.json(
				{ message: "Sorry, something went wrong" },
				{ status: 500 },
			);
		});
}
