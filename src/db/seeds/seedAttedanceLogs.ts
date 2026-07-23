import { db } from '../index.js'; 
import { attendanceLogs } from '../attedanceLogs.js'; 

export const seedAttendance = async () => {
  console.log('⏳ Seeding attendance logs...');

  const sampleEmployeeId = 1; 

  const dummyLogs = [
    {
      employeeId: sampleEmployeeId,
      attendanceDate: '2026-07-20', // Hari Senin
      checkIn: new Date('2026-07-20T07:55:00'),
      checkOut: new Date('2026-07-20T17:00:00'),
      latitudeIn: '-7.2574719',
      longitudeIn: '112.7520883',
      latitudeOut: '-7.2574719',
      longitudeOut: '112.7520883',
      workingHours: '9.08',
      attendanceStatus: 'present' as const,
    },
    {
      employeeId: sampleEmployeeId,
      attendanceDate: '2026-07-21', // Hari Selasa (Telat)
      checkIn: new Date('2026-07-21T08:25:00'),
      checkOut: new Date('2026-07-21T17:10:00'),
      latitudeIn: '-7.2574719',
      longitudeIn: '112.7520883',
      latitudeOut: '-7.2574719',
      longitudeOut: '112.7520883',
      workingHours: '8.75',
      attendanceStatus: 'late' as const,
    },
    {
      employeeId: sampleEmployeeId,
      attendanceDate: '2026-07-22', // Hari Rabu (Baru Check-In)
      checkIn: new Date('2026-07-22T07:50:00'),
      checkOut: null,
      latitudeIn: '-7.2574719',
      longitudeIn: '112.7520883',
      latitudeOut: null,
      longitudeOut: null,
      workingHours: null,
      attendanceStatus: 'present' as const,
    },
  ];

  try {
    await db.insert(attendanceLogs).values(dummyLogs);
    console.log('✅ Seeding attendance logs berhasil!');
  } catch (error) {
    console.error('❌ Gagal melakukan seed:', error);
  }
};

seedAttendance();