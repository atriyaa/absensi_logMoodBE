import { db } from '../index.js'; 
import { employees } from '../employees.js'; 

export const seedEmployees = async () => {
  console.log('⏳ Seeding employees...');

  // Disarankan untuk memberi type eksplisit typeof employees.$inferInsert[]
  const dummyEmployees: (typeof employees.$inferInsert)[] = [
    {
      employee_code: 'EMP001',
      full_name: 'Muhammad Ardavin Likara',
      no_phone: '081234567890',
      photo: 'https://example.com/photos/ardavin.jpg',
      department_id: 1,
      role_id: 1,
      workScheduleId: 1,
      status: 'Active',
    },
    {
      employee_code: 'EMP002',
      full_name: 'John Karuna Putra',
      no_phone: '081234567891',
      photo: 'https://example.com/photos/john.jpg',
      department_id: 2,
      role_id: 2,
      workScheduleId: 1,
      status: 'Active',
    },
    {
      employee_code: 'EMP003',
      full_name: 'Alayka Putri Zamzami',
      no_phone: '081234567892',
      photo: null, 
      department_id: 2,
      role_id: 2,
      workScheduleId: 2,
      status: 'Inactive',
    },
  ];

  try {
    await db.insert(employees).values(dummyEmployees);
    console.log('✅ Seeding employees berhasil!');
  } catch (error) {
    console.error('❌ Gagal melakukan seed employees:', error);
  }
};

seedEmployees();