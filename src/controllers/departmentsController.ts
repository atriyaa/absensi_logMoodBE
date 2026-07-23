import type { Request, Response, NextFunction } from 'express';
import { eq, and, ne } from 'drizzle-orm';
import { db } from '../db/index.js';
import { departments } from '../db/departments.js';
export async function getAllDepartments(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await db.select().from(departments);
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data departemen',
      data,
    });
  } catch (error) {
    return next(error);
  }
}
export async function getDepartmentsById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next({
        statusCode: 400,
        message: 'Id harus berupa angka',
      });
    }
    const data = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    if (!data[0]) {
      return next({
        statusCode: 404,
        message: 'Departemen tidak ditemukan',
      });
    }
    return res.status(200).json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    return next(error);
  }
}
export async function createDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    const { departmentsName, description } = req.body;
    if (!departmentsName || !description) {
      return next({
        statusCode: 400,
        message: 'Nama dan Deskripsi wajib diisi',
      });
    }
    const duplicate = await db
      .select()
      .from(departments)
      .where(eq(departments.departmentsName, departmentsName))
      .limit(1);
    if (duplicate[0]) {
      return next({
        statusCode: 409,
        message: 'Nama Departemen sudah terdaftar',
      });
    }
    await db.insert(departments).values({ departmentsName, description });
    const created = await db
      .select()
      .from(departments)
      .where(eq(departments.departmentsName, departmentsName))
      .limit(1);
    return res.status(201).json({
      success: true,
      data: created[0],
    });
  } catch (error) {
    return next(error);
  }
}
export async function updateDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next({
        statusCode: 400,
        message: 'Id harus berupa angka',
      });
    }
    const { departmentsName, description } = req.body;
    if (!departmentsName || !description) {
      return next({
        statusCode: 400,
        message: 'Nama dan Deskripsi wajib diisi',
      });
    }
    const existing = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    if (!existing[0]) {
      return next({
        statusCode: 404,
        message: 'Departemen tidak ditemukan',
      });
    }
    const duplicate = await db
      .select()
      .from(departments)
      .where(and(eq(departments.departmentsName, departmentsName), ne(departments.id, id)))
      .limit(1);
    if (duplicate[0]) {
      return next({
        statusCode: 409,
        message: 'Nama Departemen sudah terdaftar',
      });
    }
    await db
      .update(departments)
      .set({ departmentsName, description })
      .where(eq(departments.id, id));
    const updated = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    return res.status(200).json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    return next(error);
  }
}
export async function removeDepartments(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return next({
        statusCode: 400,
        message: 'Id harus berupa angka',
      });
    }
    const existing = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    if (!existing[0]) {
      return next({
        statusCode: 404,
        message: 'Departemen tidak ditemukan',
      });
    }
    await db.delete(departments).where(eq(departments.id, id));
    return res.status(200).json({
      success: true,
      message: 'Departemen berhasil dihapus',
    });
  } catch (error) {
    return next(error);
  }
}