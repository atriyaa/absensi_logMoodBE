import { mysqlTable, int, varchar, mysqlEnum, timestamp,} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { departments } from "./departments.js";
import { roles } from "./roles.js";

export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  employee_code: varchar("employee_code", { length: 250 }).notNull(),
  full_name: varchar("full_name", { length: 250 }).notNull(),
  name: varchar("name", { length: 250 }),
  email: varchar("email", { length: 100 }),
  password: varchar("password", { length: 255 }),
  no_phone: varchar("no_phone", { length: 20 }).notNull(),
  photo: varchar("photo", { length: 200 }),
  department_id: int("department_id"),
  role_id: int("role_id"),
  status: mysqlEnum("status", [
    "Active",
    "Inactive",
    "Resigned",
  ]).default("Inactive"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});


export const employeesRelations = relations(employees, ({ one }) => ({
  role: one(roles, {
    fields: [employees.role_id],
    references: [roles.id],
  }),

  department: one(departments, {
    fields: [employees.department_id],
    references: [departments.id],
  }),
}));