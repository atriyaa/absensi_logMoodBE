import { db } from '../index.js'; // Adjust path ke instance DB kamu
import { departments } from '../departments.js'; // Adjust path schema

export const seedDepartments = async () => {
  console.log('⏳ Seeding departments...');

  const dummyDepartments = [
    {
      departmentsName: 'Human Resources', // Sesuaikan dengan properti schema (departmentName / department_name)
      description: 'Mengelola rekrutmen, pelatihan, dan administrasi karyawan.',
    },
    {
      departmentsName: 'Information Technology',
      description: 'Bertanggung jawab atas pengembangan dan pemeliharaan sistem informasi.',
    },
    {
      departmentsName: 'Finance & Accounting',
      description: 'Mengelola keuangan, penggajian, dan pembukuan perusahaan.',
    },
  ];

  try {
    await db.insert(departments).values(dummyDepartments);
    console.log('✅ Seeding departments berhasil!');
  } catch (error) {
    console.error('❌ Gagal melakukan seed departments:', error);
  }
};

// Jalankan jika file dipanggil langsung
seedDepartments();