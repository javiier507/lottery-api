CREATE TABLE `device` (
	`token` text(100) PRIMARY KEY NOT NULL,
	`createdAt` text(25) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lottery` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`draw` integer NOT NULL,
	`dateTitle` text NOT NULL,
	`date` text NOT NULL,
	`firstPrize` text NOT NULL,
	`secondPrize` text NOT NULL,
	`thirdPrize` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lottery_draw_unique` ON `lottery` (`draw`);