import { db } from '../index.js';
import { roles } from '../roles.js';
import { error } from 'node:console';

async function seedRoles() {
    await db.insert(roles).values([
        {
            role_name: 'Admin',
            description: 'Mengelola semua operasi di aplikasi absensi.'
        },
        {
            role_name: 'Employe',
            description: 'Karyawan Perusahaan'
        }
    ]);

    console.log('✅ Roles seeded successfully!')
}

seedRoles()
    .catch((error) => {
        console.error('❌ Failed to seed roles',
        error);
    })
    .finally(async () => {
        process.exit(0);
    });