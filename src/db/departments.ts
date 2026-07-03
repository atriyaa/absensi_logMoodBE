import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const departments = mysqlTable('departments', {
    id: int('id').autoincrement().primaryKey(),
    departmentsName: varchar('departmetns_name', { length: 150 }).notNull().unique(),
    description: varchar('description', { length: 255 }).notNull()
});