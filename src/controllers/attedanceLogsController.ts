import type { Request, Response, NextFunction } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { attendanceLogs } from '../db/attedanceLogs.js';

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
    const { latitude, longitude } = req.body;

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
      .where(eq(attendanceLogs.employeeId, employeeId));
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil riwayat presensi',
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};