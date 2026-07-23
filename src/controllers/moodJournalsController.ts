import type { Request, Response, NextFunction } from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { moodJournals } from '../db/moodJournals.js';
import { employees } from '../db/employees.js';

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const VALID_MOODS = ['Excited', 'Happy', 'Neutral', 'Tired', 'Stressed'] as const;

/**
 * 1. CREATE MOOD JOURNAL (Employee)
 */
export const createMoodJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employeeId = (req as any).user?.id;
    const { attendanceLogId, moodLevel, note } = req.body;

    if (!employeeId) {
      throw new AppError('Unauthorized: Data user tidak ditemukan', 401);
    }

    if (!moodLevel || !VALID_MOODS.includes(moodLevel)) {
      throw new AppError(`moodLevel wajib diisi dan harus salah satu dari: ${VALID_MOODS.join(', ')}`, 400);
    }

    await db.insert(moodJournals).values({
      employeeId,
      attendanceLogId: attendanceLogId || null,
      moodLevel,
      note: note || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Mood journal berhasil dicatat!',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. GET ALL MOOD JOURNALS (Admin / Management)
 */
export const getAllMoodJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await db
      .select({
        id: moodJournals.id,
        employeeId: moodJournals.employeeId,
        employeeName: employees.full_name,
        attendanceLogId: moodJournals.attendanceLogId,
        moodLevel: moodJournals.moodLevel,
        note: moodJournals.note,
        createdAt: moodJournals.createdAt,
      })
      .from(moodJournals)
      .leftJoin(employees, eq(moodJournals.employeeId, employees.id))
      .orderBy(desc(moodJournals.createdAt));

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. UPDATE MOOD JOURNAL (Admin / Owner)
 */
export const updateMoodJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { moodLevel, note, attendanceLogId } = req.body;
    const user = (req as any).user;
    if (!id || typeof id !== 'string') {
    throw new AppError('ID tidak valid', 400);
    }

    const journalId = parseInt(id, 10);
    if (isNaN(journalId)) throw new AppError('ID tidak valid', 400);

    // Cek apakah data ada
    const existing = await db
      .select()
      .from(moodJournals)
      .where(eq(moodJournals.id, journalId))
      .limit(1);

    if (!existing[0]) {
      throw new AppError('Mood journal tidak ditemukan', 404);
    }

    // Jika bukan Admin dan bukan pemiliknya, tolak
    if (user.role !== 'admin' && existing[0].employeeId !== user.id) {
      throw new AppError('Kamu tidak memiliki akses untuk mengubah data ini', 403);
    }

    if (moodLevel && !VALID_MOODS.includes(moodLevel)) {
      throw new AppError(`moodLevel harus salah satu dari: ${VALID_MOODS.join(', ')}`, 400);
    }

    await db
      .update(moodJournals)
      .set({
        ...(moodLevel && { moodLevel }),
        ...(note !== undefined && { note }),
        ...(attendanceLogId !== undefined && { attendanceLogId }),
      })
      .where(eq(moodJournals.id, journalId));

    return res.status(200).json({
      success: true,
      message: 'Mood journal berhasil diperbarui!',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. DELETE MOOD JOURNAL (Admin / Owner)
 */
export const deleteMoodJournal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    if (!id || typeof id !== 'string') {
    throw new AppError('ID tidak valid', 400);
    }
    const journalId = parseInt(id, 10);
    if (isNaN(journalId)) throw new AppError('ID tidak valid', 400);

    const existing = await db
      .select()
      .from(moodJournals)
      .where(eq(moodJournals.id, journalId))
      .limit(1);

    if (!existing[0]) {
      throw new AppError('Mood journal tidak ditemukan', 404);
    }

    // Hak akses pengecekan
    if (user.role !== 'admin' && existing[0].employeeId !== user.id) {
      throw new AppError('Kamu tidak memiliki akses untuk menghapus data ini', 403);
    }

    await db.delete(moodJournals).where(eq(moodJournals.id, journalId));

    return res.status(200).json({
      success: true,
      message: 'Mood journal berhasil dihapus!',
    });
  } catch (error) {
    next(error);
  }
};