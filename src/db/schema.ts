import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const LotteryTable = sqliteTable("lottery", {
  id: int().primaryKey({ autoIncrement: true }),
  draw: text().notNull().unique(),
  dateTitle: text().notNull(),
  date: text().notNull(),
  firstPrize: text().notNull(),
  secondPrize: text().notNull(),
  thirdPrize: text().notNull(),
});

export const DeviceTable = sqliteTable("device", {
  token: text({ length: 100 }).primaryKey(),
  createdAt: text({ length: 25 }).notNull(),
});
