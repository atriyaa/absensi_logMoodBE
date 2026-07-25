import type { Request, Response, NextFunction } from 'express';
import { eq, desc, gte, lte, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { moodJournals } from '../db/moodJournals.js';
import { employees } from '../db/employees.js';
import ExcelJS from "exceljs";

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const VALID_MOODS = ['Excited', 'Happy', 'Neutral', 'Tired', 'Stressed'] as const;

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

export const getMonthlyMoodJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { month, year, employeeId } = req.query;

    // 1. Validasi parameter query wajib
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Parameter month dan year wajib diisi',
      });
    }

    const numericMonth = Number(month);
    const numericYear = Number(year);

    // 2. Buat range tanggal awal dan akhir bulan (berdasarkan UTC/Lokal)
    // Tanggal 1 di awal bulan pukul 00:00:00
    const startDate = new Date(numericYear, numericMonth - 1, 1, 0, 0, 0, 0);
    // Tanggal terakhir di bulan tersebut pukul 23:59:59
    const endDate = new Date(numericYear, numericMonth, 0, 23, 59, 59, 999);

    // 3. Susun array kondisi WHERE
    const conditions = [
      gte(moodJournals.createdAt, startDate),
      lte(moodJournals.createdAt, endDate),
    ];

    // Jika ingin difilter per karyawan spesifik (opsional)
    if (employeeId) {
      conditions.push(eq(moodJournals.employeeId, Number(employeeId)));
    }

    // 4. Query ke Database dengan Drizzle ORM
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
      .where(and(...conditions))
      .orderBy(desc(moodJournals.createdAt));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Mood Journals");

    worksheet.columns = [
        { header: "Tanggal", key: "date", width: 15 },
        { header: "Nama", key: "name", width: 30 },
        { header: "Level Mood", key: "moodLevel", width: 15 },
        { header: "Catatan", key: "note", width: 40 },
    ];

    logs.forEach((log) => {
        worksheet.addRow({
            date: log.createdAt ? log.createdAt.toISOString().split('T')[0] : "-",
            name: log.employeeName,
            moodLevel: log.moodLevel,
            note: log.note,
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=MoodJournals-${numericMonth}-${numericYear}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
    return;
  } catch (error) {
    next(error);
  }
};

/**
 * 3. GET MY MOOD JOURNALS (Employee — hanya milik sendiri)
 */
export const getMyMoodJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employeeId = (req as any).user?.id;

    if (!employeeId) {
      throw new AppError('Unauthorized: Data user tidak ditemukan', 401);
    }

    const logs = await db
      .select({
        id: moodJournals.id,
        employeeId: moodJournals.employeeId,
        attendanceLogId: moodJournals.attendanceLogId,
        moodLevel: moodJournals.moodLevel,
        note: moodJournals.note,
        createdAt: moodJournals.createdAt,
      })
      .from(moodJournals)
      .where(eq(moodJournals.employeeId, employeeId))
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
 * 4. UPDATE MOOD JOURNAL (Admin / Owner)
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
