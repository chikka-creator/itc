CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`pinned` integer DEFAULT 0 NOT NULL,
	`created_by` text NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category_id` text NOT NULL,
	`deadline` integer NOT NULL,
	`max_score` integer DEFAULT 100 NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `attendance_records` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'present' NOT NULL,
	`marked_by` text,
	`marked_at` integer,
	FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`marked_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `attendance_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`meeting_no` integer NOT NULL,
	`title` text,
	`date` text NOT NULL,
	`notes` text,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`color` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` text PRIMARY KEY NOT NULL,
	`image_url` text NOT NULL,
	`caption` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`title` text NOT NULL,
	`body` text,
	`type` text DEFAULT 'info' NOT NULL,
	`read` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`assignment_id` text NOT NULL,
	`user_id` text NOT NULL,
	`file_url` text,
	`file_name` text,
	`file_size` integer,
	`link_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`score` integer,
	`feedback` text,
	`graded_by` text,
	`graded_at` integer,
	`submitted_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`graded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`email` text,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`class_name` text,
	`phone` text,
	`avatar_url` text,
	`bio` text,
	`last_login_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `announcements_published_idx` ON `announcements` (`published`);--> statement-breakpoint
CREATE INDEX `announcements_created_at_idx` ON `announcements` (`created_at`);--> statement-breakpoint
CREATE INDEX `assignments_category_idx` ON `assignments` (`category_id`);--> statement-breakpoint
CREATE INDEX `assignments_deadline_idx` ON `assignments` (`deadline`);--> statement-breakpoint
CREATE INDEX `assignments_status_idx` ON `assignments` (`status`);--> statement-breakpoint
CREATE INDEX `attendance_records_session_idx` ON `attendance_records` (`session_id`);--> statement-breakpoint
CREATE INDEX `attendance_records_user_idx` ON `attendance_records` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `attendance_records_session_user_uq` ON `attendance_records` (`session_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `attendance_sessions_meeting_no_uq` ON `attendance_sessions` (`meeting_no`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_uq` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `gallery_sort_idx` ON `gallery` (`sort_order`);--> statement-breakpoint
CREATE INDEX `notifications_user_read_idx` ON `notifications` (`user_id`,`read`);--> statement-breakpoint
CREATE INDEX `notifications_created_idx` ON `notifications` (`created_at`);--> statement-breakpoint
CREATE INDEX `submissions_assignment_idx` ON `submissions` (`assignment_id`);--> statement-breakpoint
CREATE INDEX `submissions_user_idx` ON `submissions` (`user_id`);--> statement-breakpoint
CREATE INDEX `submissions_status_idx` ON `submissions` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `submissions_user_assignment_uq` ON `submissions` (`user_id`,`assignment_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_uq` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_uq` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);