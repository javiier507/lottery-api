import { getLotteries } from "@/db/repositories/lottery.repository";

export async function GET(request: Request) {
  return getLotteries()
    .then((data) => {
      return Response.json({ data });
    })
    .catch((e) => {
      return Response.json(
        { message: "Sorry, something went wrong" },
        { status: 500 }
      );
    });
}
