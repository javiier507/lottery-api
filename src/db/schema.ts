import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const LotteryTable = sqliteTable("lottery", {
  id: int().primaryKey({ autoIncrement: true }),
  draw: int().notNull().unique(),
  dateTitle: text().notNull(),
  date: text().notNull(),
  firstPrize: int().notNull(),
  secondPrize: int().notNull(),
  thirdPrize: int().notNull(),
});
