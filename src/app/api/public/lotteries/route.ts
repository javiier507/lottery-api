import { type NextRequest } from 'next/server';
import { z } from 'zod';

import {
  getLotteries
} from "@/db/repositories/lottery.repository";

const paginationSchema = z.object({
  limit: z.coerce.number().default(10).transform(x => x < 10 ? 10 : x),
  offset: z.coerce.number().default(0)
})

export async function GET(request: NextRequest) {
  const queryParams = request.nextUrl.searchParams;

  const paginationParams = {
    limit: queryParams.get('limit'),
    offset: queryParams.get('offset')
  }
  const parsed = paginationSchema.safeParse(paginationParams);
  if(!parsed.success) {
    return Response.json(
      { message: "The parameters do not comply with the correct format" },
      { status: 400 }
    );
  }

  console.log(parsed.data)

  return getLotteries(parsed.data)
    .then(async (data) => {
      return Response.json({ data });
    })
    .catch((e) => {
      return Response.json(
        { message: "Sorry, something went wrong" },
        { status: 500 }
      );
    });
}
