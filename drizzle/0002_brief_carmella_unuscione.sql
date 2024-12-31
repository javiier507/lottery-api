DROP INDEX IF EXISTS "lottery_draw_unique";--> statement-breakpoint
ALTER TABLE `lottery` ALTER COLUMN "draw" TO "draw" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `lottery_draw_unique` ON `lottery` (`draw`);