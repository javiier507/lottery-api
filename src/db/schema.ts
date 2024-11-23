import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const LotteryTable = sqliteTable("lottery", {
  id: int().primaryKey({ autoIncrement: true }),
  draw: int().notNull().unique(),
  dateTitle: text().notNull(),
  date: text().notNull(),
  firstPrize: text().notNull(),
  secondPrize: text().notNull(),
  thirdPrize: text().notNull(),
});
