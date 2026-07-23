import { 
  mysqlTable, 
  serial, 
  int, 
  text, 
  timestamp, 
  mysqlEnum 
} from 'drizzle-orm/mysql-core';
import { employees } from './employees.js';
import { attendanceLogs } from './attedanceLogs.js';

export const moodJournals = mysqlTable('mood_journals', {
  id: serial('id').primaryKey(),
  employeeId: int('employee_id').notNull().references(() => employees.id, { onDelete: 'cascade' }),
  attendanceLogId: int('attendance_log_id').references(() => attendanceLogs.id, { onDelete: 'set null' }), 
  moodLevel: mysqlEnum('mood_level', ['Excited', 'Happy', 'Neutral', 'Tired', 'Stressed']).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});