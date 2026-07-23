import { db } from '../index.js'; // Adjust path ke instance DB kamu
import { roles } from '../roles.js'; // Adjust path schema

export const seedRoles = async () => {
  console.log('⏳ Seeding roles...');

  const dummyRoles = [
    {
      role_name: 'Admin', // Gunakan role_name jika schema Drizzle kamu tidak di-map ke camelCase
      description: 'Mengelola semua operasi di aplikasi absensi.',
    },
    {
      role_name: 'Employee',
      description: 'Karyawan Perusahaan.',
    },
  ];

  try {
    await db.insert(roles).values(dummyRoles);
    console.log('✅ Seeding roles berhasil!');
  } catch (error) {
    console.error('❌ Gagal melakukan seed roles:', error);
  }
};

// Jalankan jika file dipanggil langsung
seedRoles();