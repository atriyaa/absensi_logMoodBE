import { db } from '../index.js'; 
import { workSchedules } from '../workSchedules.js'; 

export const seedWorkSchedules = async () => {
  console.log('⏳ Seeding work schedules...');

  const dummySchedules = [
    {
      scheduleName: 'Jam Kantor Reguler (Senin - Jumat)',
      startTime: '08:00:00',
      endTime: '17:00:00',
      toleranceMinutes: 15, 
    },
    {
      scheduleName: 'Shift Pagi',
      startTime: '07:00:00',
      endTime: '15:00:00',
      toleranceMinutes: 10, 
    },
    {
      scheduleName: 'Shift Siang',
      startTime: '13:00:00',
      endTime: '21:00:00',
      toleranceMinutes: 10, 
    },
    {
      scheduleName: 'Fleksibel / Non-Toleransi',
      startTime: '09:00:00',
      endTime: '18:00:00',
      toleranceMinutes: 0, 
    },
  ];

  try {
    await db.insert(workSchedules).values(dummySchedules);
    console.log('✅ Seeding work schedules berhasil!');
  } catch (error) {
    console.error('❌ Gagal melakukan seed work schedules:', error);
  }
};

seedWorkSchedules();