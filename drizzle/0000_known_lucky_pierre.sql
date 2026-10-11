CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`paypal_id` text,
	`label` text NOT NULL,
	`amount` integer NOT NULL,
	`rules` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_paypal_id_unique` ON `orders` (`paypal_id`);--> statement-breakpoint
CREATE TABLE `preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`rules` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`mode` text NOT NULL,
	`kind` text NOT NULL,
	`label` text NOT NULL,
	`gross` integer NOT NULL,
	`fee` integer DEFAULT 0 NOT NULL,
	`sales_tax` integer DEFAULT 0 NOT NULL,
	`tax` integer NOT NULL,
	`business` integer NOT NULL,
	`personal` integer NOT NULL,
	`parent` text,
	`rules` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_records_user_mode_created` ON `records` (`user_id`,`mode`,`created`);