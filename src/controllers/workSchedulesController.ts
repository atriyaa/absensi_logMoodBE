import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { workSchedules } from '../db/workSchedules.js';

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * 1. CREATE WORK SCHEDULE (Admin)
 */
export const createWorkSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scheduleName, startTime, endTime, toleranceMinutes } = req.body;

    if (!scheduleName || !startTime || !endTime) {
      throw new AppError('Nama jadwal, jam mulai (startTime), dan jam selesai (endTime) wajib diisi', 400);
    }

    await db.insert(workSchedules).values({
      scheduleName,
      startTime,
      endTime,
      toleranceMinutes: toleranceMinutes ?? 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Jadwal kerja berhasil dibuat!',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. GET ALL WORK SCHEDULES
 */
export const getAllWorkSchedules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schedules = await db.select().from(workSchedules);

    return res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. GET WORK SCHEDULE BY ID
 */
export const getWorkScheduleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const scheduleId = parseInt(id as string, 10);

    if (isNaN(scheduleId)) {
      throw new AppError('ID jadwal kerja tidak valid', 400);
    }

    const schedule = await db
      .select()
      .from(workSchedules)
      .where(eq(workSchedules.id, scheduleId))
      .limit(1);

    if (!schedule[0]) {
      throw new AppError('Jadwal kerja tidak ditemukan', 404);
    }

    return res.status(200).json({
      success: true,
      data: schedule[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. UPDATE WORK SCHEDULE (Admin)
 */
export const updateWorkSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { scheduleName, startTime, endTime, toleranceMinutes } = req.body;

    const scheduleId = parseInt(id as string, 10);
    if (isNaN(scheduleId)) {
      throw new AppError('ID jadwal kerja tidak valid', 400);
    }

    const existingSchedule = await db
      .select()
      .from(workSchedules)
      .where(eq(workSchedules.id, scheduleId))
      .limit(1);

    if (!existingSchedule[0]) {
      throw new AppError('Jadwal kerja tidak ditemukan', 404);
    }

    await db
      .update(workSchedules)
      .set({
        ...(scheduleName && { scheduleName }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(toleranceMinutes !== undefined && { toleranceMinutes }),
      })
      .where(eq(workSchedules.id, scheduleId));

    return res.status(200).json({
      success: true,
      message: 'Jadwal kerja berhasil diperbarui!',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. DELETE WORK SCHEDULE (Admin)
 */
export const deleteWorkSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const scheduleId = parseInt(id as string, 10);
    if (isNaN(scheduleId)) {
      throw new AppError('ID jadwal kerja tidak valid', 400);
    }

    const existingSchedule = await db
      .select()
      .from(workSchedules)
      .where(eq(workSchedules.id, scheduleId))
      .limit(1);

    if (!existingSchedule[0]) {
      throw new AppError('Jadwal kerja tidak ditemukan', 404);
    }

    await db.delete(workSchedules).where(eq(workSchedules.id, scheduleId));

    return res.status(200).json({
      success: true,
      message: 'Jadwal kerja berhasil dihapus!',
    });
  } catch (error) {
    next(error);
  }
};