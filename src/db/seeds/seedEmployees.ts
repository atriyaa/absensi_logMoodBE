import { db } from "../index.js";
import { employees } from "../employees.js";

async function seedEmployees() {
  await db.insert(employees).values([
    {
      employee_code: "EMP001",
      full_name: "Muhammad Ardavin Likara",
      no_phone: "081234567890",
      department_id: 1,
      role_id: 2,
      status: "Inactive",
    },
    {
      employee_code: "EMP002",
      full_name: "John Karuna Putra",
      no_phone: "081234567891",
      department_id: 2,
      role_id: 2,
      status: "Inactive",
    },
    {
      employee_code: "EMP003",
      full_name: "Alayka Putri Zamzami",
      no_phone: "081234567892",
      department_id: 3,
      role_id: 2,
      status: "Inactive",
    },
  ]);

  console.log("Employee seed berhasil.");
}

seedEmployees()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });