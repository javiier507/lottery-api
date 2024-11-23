const MONTHS_MAP = new Map<string, number>([
  ["enero", 0],
  ["febrero", 1],
  ["marzo", 2],
  ["abril", 3],
  ["mayo", 4],
  ["junio", 5],
  ["julio", 6],
  ["agosto", 7],
  ["septiembre", 8],
  ["octubre", 9],
  ["noviembre", 10],
  ["diciembre", 11],
]);

export function getDate(dateString: string): Date {
  const splited = dateString.split(" ");
  const dayStr = splited.at(0);
  const monthStr = splited.at(2)?.toLowerCase();
  const yearStr = splited.at(4);

  if (!dayStr || !monthStr || !yearStr) throw new Error("Get Portions Date");

  const month = MONTHS_MAP.get(monthStr);
  if (!month) throw new Error("Get Month");

  const current = new Date();

  return new Date(
    parseInt(yearStr),
    month,
    parseInt(dayStr),
    current.getHours(),
    current.getMinutes(),
    current.getSeconds()
  );
}
