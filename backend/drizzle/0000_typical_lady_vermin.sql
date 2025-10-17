CREATE TABLE `optimizations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`product_id` int NOT NULL,
	`original_title` text NOT NULL,
	`original_bullets` json NOT NULL,
	`original_description` text,
	`optimized_title` text NOT NULL,
	`optimized_bullets` json NOT NULL,
	`optimized_description` text NOT NULL,
	`keywords` json NOT NULL,
	`model` varchar(64) NOT NULL,
	`prompt_version` varchar(32) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `optimizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`asin` varchar(20) NOT NULL,
	`title` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_asin_unique` UNIQUE(`asin`)
);
