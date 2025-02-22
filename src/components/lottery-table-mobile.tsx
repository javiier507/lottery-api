type Lottery = {
    draw: string
    dateTitle: string
    date: string
    firstPrize: string
    secondPrize: string
    thirdPrize: string
    letters?: string | null
    serie?: string | null
    folio?: string | null
  }
  
  interface LotteryTableMobileProps {
    lotteries?: Lottery[]
    onRowClick?: (lottery: Lottery) => void
  }
  
  export default function LotteryTableMobile({ lotteries = [], onRowClick }: LotteryTableMobileProps) {
    if (!lotteries || lotteries.length === 0) {
      return (
        <div className="mt-4 rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">No lottery data available</p>
        </div>
      )
    }
  
    return (
      <div className="mt-4 space-y-4">
        {lotteries.map((lottery, index) => (
          <div
            key={`${lottery.draw}-${index}`}
            onClick={() => onRowClick?.(lottery)}
            className={`rounded-lg border border-gray-200 bg-white p-4 ${
              onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Draw</p>
                <p className="mt-1 text-sm text-gray-900">{lottery.draw}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Date Title</p>
                <p className="mt-1 text-sm text-gray-900">{lottery.dateTitle}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">{lottery.date}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">First Prize</p>
                <p className="mt-1 text-sm text-gray-900">{lottery.firstPrize}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Second Prize</p>
                <p className="mt-1 text-sm text-gray-900">{lottery.secondPrize}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Third Prize</p>
                <p className="mt-1 text-sm text-gray-900">{lottery.thirdPrize}</p>
              </div>
              {(lottery.letters || lottery.serie || lottery.folio) && (
                <>
                  {lottery.letters && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">Letters</p>
                      <p className="mt-1 text-sm text-gray-900">{lottery.letters}</p>
                    </div>
                  )}
                  {lottery.serie && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">Serie</p>
                      <p className="mt-1 text-sm text-gray-900">{lottery.serie}</p>
                    </div>
                  )}
                  {lottery.folio && (
                    <div>
                      <p className="text-xs font-medium text-gray-500">Folio</p>
                      <p className="mt-1 text-sm text-gray-900">{lottery.folio}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  