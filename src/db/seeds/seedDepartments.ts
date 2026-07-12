import { db } from '../index.js';
import { departments } from '../departments.js';
import { error } from 'node:console';

async function seedDepartments() {
    await db.insert(departments).values([
        {
            departmentsName: 'Human Resources',
            description: 'Mengelola rekrutmen, pelatihan, dan administrasi karyawan.'
        },
        {
            departmentsName: 'Information Technology',
            description: 'Bertanggung jawab atas pengembangan dan pemeliharaan sistem informasi.'
        }
    ]);

    console.log('✅ Departments seeded successfully!');
}

seedDepartments()
    .catch((error) => {
        console.error('❌ Failed to seed departments', error);
    })
    .finally(async () => {
        process.exit(0);
    });