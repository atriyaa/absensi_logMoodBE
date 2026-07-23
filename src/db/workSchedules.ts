import { mysqlTable, serial, varchar, time, int, timestamp } from 'drizzle-orm/mysql-core';

export const workSchedules = mysqlTable('work_schedules', {
  id: serial('id').primaryKey(),
  scheduleName: varchar('schedule_name', { length: 200 }).notNull(), // Contoh: "Office Hours Regular", "Shift Pagi"
  startTime: time('start_time').notNull(),                            // Contoh: "08:00:00"
  endTime: time('end_time').notNull(),                                // Contoh: "17:00:00"
  toleranceMinutes: int('tolerance_minutes').default(0).notNull(),    // Contoh: 15 (menit)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});