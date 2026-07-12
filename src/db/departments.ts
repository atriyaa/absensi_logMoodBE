import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from "drizzle-orm";
import { employees } from "./employees.js";

export const departments = mysqlTable('departments', {
    id: int('id').autoincrement().primaryKey(),
    departmentsName: varchar('departmetns_name', { length: 150 }).notNull().unique(),
    description: varchar('description', { length: 255 }).notNull()
});

export const departmentsRelations = relations(
  departments,
  ({ many }) => ({
    employees: many(employees),
  })
);