import type { Request, Response, NextFunction } from 'express';
import { eq, and, desc, sql, gte, lte, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { attendanceLogs } from '../db/attedanceLogs.js';
import { employees } from '../db/employees.js';
import { departments } from '../db/departments.js';
import { moodJournals } from '../db/moodJournals.js';
import ExcelJS from "exceljs";

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const checkIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employeeId = (req as any).user?.id; 
    const { latitude, longitude, photo } = req.body;

    if (!employeeId) {
      throw new AppError('Unauthorized: Data user tidak ditemukan', 401);
    }
    if (latitude === undefined || longitude === undefined) {
      throw new AppError('Latitude dan Longitude wajib diisi', 400);
    }
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]!; 
    const existingLog = await db
      .select()
      .from(attendanceLogs)
      .where(
        and(
          eq(attendanceLogs.employeeId, employeeId),
          eq(attendanceLogs.attendanceDate, todayStr)
        )
      )
      .limit(1);
    if (existingLog.length > 0) {
      throw new AppError('Kamu sudah melakukan Check-In hari ini', 400);
    }
    const workStartTime = new Date(now);
    workStartTime.setHours(8, 0, 0, 0);
    const attendanceStatus = now > workStartTime ? 'late' : 'present';
    await db.insert(attendanceLogs).values({
      employeeId,
      attendanceDate: todayStr, 
      checkIn: now,
      latitudeIn: latitude.toString(),
      longitudeIn: longitude.toString(),
      photoIn: photo || null,
      attendanceStatus,
    });
    const createdLog = await db
      .select()
      .from(attendanceLogs)
      .where(
        and(
          eq(attendanceLogs.employeeId, employeeId),
          eq(attendanceLogs.attendanceDate, todayStr)
        )
      )
      .limit(1);
    return res.status(201).json({
      success: true,
      message: `Check-In berhasil! Status: ${attendanceStatus}`,
      data: createdLog[0],
    });
  } catch (error) {
    next(error);
  }
};

export const checkOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employeeId = (req as any).user?.id;
    const { latitude, longitude } = req.body;
    if (!employeeId) {
      throw new AppError('Unauthorized: Data user tidak ditemukan', 401);
    }
    if (latitude === undefined || longitude === undefined) {
      throw new AppError('Latitude dan Longitude wajib diisi', 400);
    }
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]!;
    const result = await db
      .select()
      .from(attendanceLogs)
      .where(
        and(
          eq(attendanceLogs.employeeId, employeeId),
          eq(attendanceLogs.attendanceDate, todayStr)
        )
      )
      .limit(1);
    const todayLog = result[0];
    if (!todayLog) {
      throw new AppError('Kamu belum melakukan Check-In hari ini', 400);
    }
    if (todayLog.checkOut) {
      throw new AppError('Kamu sudah melakukan Check-Out hari ini', 400);
    }
    const checkInTime = new Date(todayLog.checkIn!).getTime();
    const checkOutTime = now.getTime();
    const diffInHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    const workingHours = parseFloat(diffInHours.toFixed(2));
    await db
      .update(attendanceLogs)
      .set({
        checkOut: now,
        latitudeOut: latitude.toString(),
        longitudeOut: longitude.toString(),
        workingHours: workingHours.toString(),
      })
      .where(eq(attendanceLogs.id, todayLog.id));
    const updatedLog = await db
      .select()
      .from(attendanceLogs)
      .where(eq(attendanceLogs.id, todayLog.id))
      .limit(1);
    return res.status(200).json({
      success: true,
      message: 'Check-Out berhasil!',
      data: updatedLog[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employeeId = (req as any).user?.id;
    if (!employeeId) {
      throw new AppError('Unauthorized: Data user tidak ditemukan', 401);
    }
    const logs = await db
      .select()
      .from(attendanceLogs)
      .where(eq(attendanceLogs.employeeId, employeeId))
      .orderBy(desc(attendanceLogs.createdAt));
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil riwayat presensi',
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAttendanceLogs = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await db
      .select({
        id: attendanceLogs.id,
        employeeId: attendanceLogs.employeeId,
        employeeName: employees.full_name,
        departmentName: departments.departmentsName,
        attendanceDate: attendanceLogs.attendanceDate,
        checkIn: attendanceLogs.checkIn,
        checkOut: attendanceLogs.checkOut,
        workingHours: attendanceLogs.workingHours,
        photoIn: attendanceLogs.photoIn,
        attendanceStatus: attendanceLogs.attendanceStatus,
        createdAt: attendanceLogs.createdAt,
      })
      .from(attendanceLogs)
      .leftJoin(employees, eq(attendanceLogs.employeeId, employees.id))
      .leftJoin(departments, eq(employees.department_id, departments.id))
      .orderBy(desc(attendanceLogs.createdAt));

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyAttendanceLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.query;

    const today = new Date();

    const numericMonth = today.getMonth() + 1;
    const numericYear = today.getFullYear();
    const startDate = `${numericYear}-${String(numericMonth).padStart(2, "0")}-01`;
    const lastDay = new Date(numericYear, numericMonth, 0).getDate();
    const endDate = `${numericYear}-${String(numericMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    // 3. Menyusun kondisi WHERE (Kombinasi Range Tanggal + Optional Employee ID)
    const conditions = [
      sql`DATE(${attendanceLogs.attendanceDate}) >= ${startDate}`,
      sql`DATE(${attendanceLogs.attendanceDate}) <= ${endDate}`,
    ];

    // Jika employeeId dikirimkan (misal user filter karyawan tertentu / user biasa liat datanya sendiri)
    if (employeeId) {
      conditions.push(eq(attendanceLogs.employeeId, Number(employeeId)));
    }

    // 4. Query ke Database
    const logs = await db
      .select({
        id: attendanceLogs.id,
        employeeId: attendanceLogs.employeeId,
        employeeName: employees.full_name,
        departmentName: departments.departmentsName,
        attendanceDate: attendanceLogs.attendanceDate,
        checkIn: attendanceLogs.checkIn,
        checkOut: attendanceLogs.checkOut,
        workingHours: attendanceLogs.workingHours,
        photoIn: attendanceLogs.photoIn,
        attendanceStatus: attendanceLogs.attendanceStatus,
        createdAt: attendanceLogs.createdAt,
      })
      .from(attendanceLogs)
      .leftJoin(employees, eq(attendanceLogs.employeeId, employees.id))
      .leftJoin(departments, eq(employees.department_id, departments.id))
      .where(and(...conditions))
      .orderBy(desc(attendanceLogs.attendanceDate)); // Diurutkan berdasarkan tanggal absensi

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Attendance");

      worksheet.columns = [
            { header: "Tanggal", key: "date", width: 15 },
            { header: "Nama", key: "name", width: 30 },
            { header: "Divisi", key: "department", width: 20 },
            { header: "Check In", key: "checkIn", width: 15 },
            { header: "Check Out", key: "checkOut", width: 15 },
            { header: "Jam Kerja", key: "workingHours", width: 15 },
            { header: "Status", key: "status", width: 15 },
        ];
      logs.forEach((log) => {
          worksheet.addRow({
              date: log.attendanceDate,
              name: log.employeeName,
              department: log.departmentName,
              checkIn: log.checkIn,
              checkOut: log.checkOut,
              workingHours: log.workingHours,
              status: log.attendanceStatus,
          });
      });

      res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Attendance-${numericMonth}-${numericYear}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();
        return;
  } catch (error) {
    next(error);
  }
};

export const getDepartmentMonthlyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Parameter month dan year wajib diisi',
      });
    }

    const numericMonth = Number(month);
    const numericYear = Number(year);

    // 1. Format Range Tanggal
    const formattedMonth = String(numericMonth).padStart(2, '0');
    const lastDayNum = new Date(numericYear, numericMonth, 0).getDate();
    
    const startDateStr = `${numericYear}-${formattedMonth}-01`;
    const endDateStr = `${numericYear}-${formattedMonth}-${String(lastDayNum).padStart(2, '0')}`;

    const startDateObj = new Date(numericYear, numericMonth - 1, 1, 0, 0, 0, 0);
    const endDateObj = new Date(numericYear, numericMonth, 0, 23, 59, 59, 999);

    // 2. Query mengambil gabungan data Absensi + Mood + Karyawan + Departemen
    const rawData = await db
      .select({
        departmentId: departments.id,
        departmentName: departments.departmentsName,
        employeeId: employees.id,
        employeeName: employees.full_name,
        // Data Absensi
        attendanceId: attendanceLogs.id,
        attendanceDate: attendanceLogs.attendanceDate,
        checkIn: attendanceLogs.checkIn,
        checkOut: attendanceLogs.checkOut,
        workingHours: attendanceLogs.workingHours,
        attendanceStatus: attendanceLogs.attendanceStatus,
        // Data Mood
        moodId: moodJournals.id,
        moodLevel: moodJournals.moodLevel,
        moodNote: moodJournals.note,
        moodCreatedAt: moodJournals.createdAt,
      })
      .from(attendanceLogs)
      .innerJoin(employees, eq(attendanceLogs.employeeId, employees.id))
      .innerJoin(departments, eq(employees.department_id, departments.id))
      .leftJoin(
        moodJournals,
        and(
          eq(attendanceLogs.employeeId, moodJournals.employeeId),
          gte(moodJournals.createdAt, startDateObj),
          lte(moodJournals.createdAt, endDateObj)
        )
      )
      .where(
        and(
          gte(attendanceLogs.attendanceDate, startDateStr),
          lte(attendanceLogs.attendanceDate, endDateStr)
        )
      );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Department Report");

    worksheet.columns = [
        { header: "Departemen", key: "departmentName", width: 20 },
        { header: "Nama Karyawan", key: "employeeName", width: 30 },
        { header: "Tanggal Absensi", key: "attendanceDate", width: 15 },
        { header: "Check In", key: "checkIn", width: 15 },
        { header: "Check Out", key: "checkOut", width: 15 },
        { header: "Jam Kerja", key: "workingHours", width: 15 },
        { header: "Status Absensi", key: "attendanceStatus", width: 15 },
        { header: "Level Mood", key: "moodLevel", width: 15 },
        { header: "Catatan Mood", key: "moodNote", width: 30 },
    ];

    rawData.forEach((row) => {
        worksheet.addRow({
            departmentName: row.departmentName,
            employeeName: row.employeeName,
            attendanceDate: row.attendanceDate,
            checkIn: row.checkIn,
            checkOut: row.checkOut,
            workingHours: row.workingHours,
            attendanceStatus: row.attendanceStatus,
            moodLevel: row.moodLevel || "-",
            moodNote: row.moodNote || "-",
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=DepartmentReport-${numericMonth}-${numericYear}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
    return;
  } catch (error) {
    next(error);
  }
};