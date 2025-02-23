import { LotteryTableWrapper } from "@/components/lottery-table-wrapper";
import { Container } from "@/components/container";
import Link from "next/link";

export default function ManagementPage() {
  return (
    <Container>
      <Link 
        href="/management/new" 
        className="mb-4 inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
      >
        Create New Lottery
      </Link>
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
    </Container>
  );
}
