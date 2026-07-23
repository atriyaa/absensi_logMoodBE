import { db } from '../index.js'; // Adjust path ke instance DB kamu
import { moodJournals } from '../moodJournals.js'; // Adjust path schema

export const seedMoodJournals = async () => {
  console.log('⏳ Seeding mood journals...');
  const sampleEmployeeId = 1;
  const sampleAttendanceLogId = 1; 
  const dummyMoods = [
    {
      employeeId: sampleEmployeeId,
      attendanceLogId: sampleAttendanceLogId,
      moodLevel: 'Excited' as const,
      note: 'Semangat menyambut sprint minggu ini!',
      createdAt: new Date('2026-07-20T08:00:00'),
    },
    {
      employeeId: sampleEmployeeId,
      attendanceLogId: null, // Opsional: tanpa link absensi
      moodLevel: 'Neutral' as const,
      note: 'Hari biasa, pekerjaan berjalan lancar.',
      createdAt: new Date('2026-07-21T12:30:00'),
    },
    {
      employeeId: sampleEmployeeId,
      attendanceLogId: null,
      moodLevel: 'Tired' as const,
      note: 'Agak capek setelah lembur kemarin malam.',
      createdAt: new Date('2026-07-22T17:00:00'),
    },
  ];

  try {
    await db.insert(moodJournals).values(dummyMoods);
    console.log('✅ Seeding mood journals berhasil!');
  } catch (error) {
    console.error('❌ Gagal melakukan seed mood journals:', error);
  }
};

seedMoodJournals();