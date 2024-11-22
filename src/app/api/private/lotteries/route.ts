import { getLotteryData } from "./schedule";

export async function POST() {
  await getLotteryData().catch((e) => {
    console.error("Error: Get Lottery Data");
    console.error(e);
  });
  return Response.json({ message: "Scheduled Task!" });
}
