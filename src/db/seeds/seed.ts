import { seedRoles } from './seedRoles.js';
import { seedDepartments } from './seedDepartments.js';
import { seedWorkSchedules } from './seedWorkSchedules.js';
import { seedEmployees } from './seedEmployees.js';
import { seedAttendanceLogs } from './seedAttedanceLogs.js';
import { seedMoodJournals } from './seedMoodJournals.js';

const runSeeders = async () => {
  try {
    console.log('🚀 Memulai proses seeding data...\n');

    // Tahap 1: Master Data Independen
    await seedRoles();
    await seedDepartments();
    await seedWorkSchedules();

    // Tahap 2: Master Employees
    await seedEmployees();

    // Tahap 3 & 4: Data Transaksional
    await seedAttendanceLogs();
    await seedMoodJournals();

    console.log('\n🎉 Semua data seeder berhasil dimasukkan!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal menjalankan seeder:', error);
    process.exit(1);
  }
};

runSeeders();