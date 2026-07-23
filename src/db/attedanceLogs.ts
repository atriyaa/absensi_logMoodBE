import { 
  mysqlTable, 
  serial, 
  int, 
  date, 
  timestamp, 
  decimal, 
  mysqlEnum 
} from 'drizzle-orm/mysql-core';
import { employees } from './employees.js'; 

export const attendanceLogs = mysqlTable('attendance_logs', {
  id: serial('id').primaryKey(),
  employeeId: int('employee_id').notNull().references(() => employees.id, { onDelete: 'cascade' }),
  attendanceDate: date('attendance_date', { mode: 'string' }).notNull(),
  checkIn: timestamp('check_in'),
  checkOut: timestamp('check_out'),
  latitudeIn: decimal('latitude_in', { precision: 10, scale: 8 }),
  longitudeIn: decimal('longitude_in', { precision: 11, scale: 8 }),
  latitudeOut: decimal('latitude_out', { precision: 10, scale: 8 }),
  longitudeOut: decimal('longitude_out', { precision: 11, scale: 8 }),
  workingHours: decimal('working_hours', { precision: 4, scale: 2 }),
  attendanceStatus: mysqlEnum('attendance_status', [
    'present', 
    'late', 
    'absent'
  ]).default('present'),
  
  createdAt: timestamp('created_at').defaultNow().notNull()
});