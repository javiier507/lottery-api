import { getLotteryData } from "./schedule";

export async function POST() {
  await getLotteryData().catch(() => console.error("Error: Get Lottery Data"));
  return Response.json({ message: "Scheduled Task!" });
}
