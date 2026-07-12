import { mysqlTable, int, varchar,} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { employees } from "./employees.js";

export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  role_name: varchar("role_name", {
    length: 100,
  }).notNull(),
  description: varchar("description", {
    length: 255,
  }),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  employees: many(employees),
}));