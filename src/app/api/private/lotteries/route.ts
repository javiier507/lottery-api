import { getLotteryData } from "./schedule";

export async function POST(request: Request) {
  await getLotteryData().catch(() => console.error("Error: Get Lottery Data"));
  return Response.json({ message: "Scheduled Task!" });
}
