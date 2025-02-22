import { LotteryTableWrapper } from "@/components/lottery-table-wrapper";

export default function ManagementPage() {
  return (
    <LotteryTableWrapper lotteries={[
        //generate 20 lotteries
        ...Array.from({ length: 20 }, (_, index) => ({
            draw: `Draw ${index + 1}`,
            dateTitle: `Date Title ${index + 1}`,
            date: `Date ${index + 1}`,
            firstPrize: `First Prize ${index + 1}`,
            secondPrize: `Second Prize ${index + 1}`,
            thirdPrize: `Third Prize ${index + 1}`,
        }))
    ]} />
  );
}
