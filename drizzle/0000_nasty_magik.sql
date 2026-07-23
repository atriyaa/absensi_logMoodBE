CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`departmetns_name` varchar(150) NOT NULL,
	`description` varchar(255) NOT NULL,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`),
	CONSTRAINT `departments_departmetns_name_unique` UNIQUE(`departmetns_name`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employee_code` varchar(250) NOT NULL,
	`full_name` varchar(250) NOT NULL,
	`name` varchar(250),
	`email` varchar(100),
	`password` varchar(255),
	`no_phone` varchar(20) NOT NULL,
	`photo` varchar(200),
	`department_id` int,
	`role_id` int,
	`work_schedule_id` int,
	`status` enum('Active','Inactive','Resigned') DEFAULT 'Inactive',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role_name` varchar(100) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendance_logs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`attendance_date` date NOT NULL,
	`check_in` timestamp,
	`check_out` timestamp,
	`latitude_in` decimal(10,8),
	`longitude_in` decimal(11,8),
	`latitude_out` decimal(10,8),
	`longitude_out` decimal(11,8),
	`working_hours` decimal(4,2),
	`attendance_status` enum('present','late','absent') DEFAULT 'present',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mood_journals` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`employee_id` int NOT NULL,
	`attendance_log_id` int,
	`mood_level` enum('Excited','Happy','Neutral','Tired','Stressed') NOT NULL,
	`note` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mood_journals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `work_schedules` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`schedule_name` varchar(200) NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`tolerance_minutes` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `work_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_work_schedule_id_work_schedules_id_fk` FOREIGN KEY (`work_schedule_id`) REFERENCES `work_schedules`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance_logs` ADD CONSTRAINT `attendance_logs_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mood_journals` ADD CONSTRAINT `mood_journals_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mood_journals` ADD CONSTRAINT `mood_journals_attendance_log_id_attendance_logs_id_fk` FOREIGN KEY (`attendance_log_id`) REFERENCES `attendance_logs`(`id`) ON DELETE set null ON UPDATE no action;