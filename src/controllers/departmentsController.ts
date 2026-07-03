import type { Request, Response, NextFunction } from 'express';
import { eq, ne, or } from 'drizzle-orm';
import { db } from '../db/index.js';
import { departments } from '../db/departments.js';
import { numeric } from 'drizzle-orm/pg-core';

export async function getAllDepartments(_req: Request, res:Response, next: NextFunction) {
    try {
        const data = await db.select().from(departments);
        return res.json(data);
    } catch (error) {
        return next(error);
    }
}

export async function getDepartmentsById(req: Request, res:Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)){
            return next({
                statusCode: 400,
                message: 'id harus berupa angka'
            });
        }

        const data = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
        if (Number.isNaN(id)) {
            return next({
                statusCode: 400,
                message: 'id harus berupa angka'
            });
        }

        return res.json(data[0]);
    } catch (error) {
        return next(error);
    }
}

export async function createDepartments(req: Request, res: Response, next: NextFunction) {
    try {
        const { departmentsName, description } = req.body;

        if (!departmentsName || ! description){
            return next({
                statusCode: 400,
                message: 'Nama dan Deskripsi wajib diisi'
            });
        }

        const duplicate = await db.select().from(departments).where(or(
            eq(departments.departmentsName, departmentsName),
            eq(departments.description, description)
        )
    ).limit(1);

    if (duplicate[0]) {
        return next({
            statusCode: 409,
            message: 'Nama Departments Sudah Tersedia'
        });
    }

    await db.insert(departments).values({departmentsName, description});
    const created = await db.select().from(departments).where(eq(
        departments.departmentsName, departmentsName
    )).limit(1);

    return res.status(201).json(created[0]);
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
                message: 'id harus berupa angka'
            });
        }

        const {departmentsName, description} = req.body;

        if (!departmentsName || !description) {
            return next({
                statusCode: 400,
                message: 'Nama dan Deskripsi wajib diisi'
            });
        }

        const existing = await db.select().from(departments).where(eq(
            departments.id, id
        )).limit(1);

        if (!existing[0]) {
            return next({
                statusCode: 404,
                meesage: 'Departments tidak ditemukan'
            });
        }

        const duplicate = await db.select().from(departments).where(or(
            eq(departments.departmentsName, departmentsName),
            eq(departments.description, description)
        ));

        const duplicateData = duplicate.find((m) => m.id !== id
        );

        if (duplicateData) {
            return next({
                statusCode: 409,
                message: 'Nama departments sudah terdaftar'
            });
        }

        await db.update(departments).set({ departmentsName, description}).where(
            eq(departments.id, id)
        );

        const updated = await db.select().from(departments).where(eq(
            departments.id, id
        )).limit(1);

        return res.json(updated[0]);
    } catch (error) {
        return next(error);
    }
}

export async function removeDepartments(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);
          if (Number.isNaN(id)){
            return next({
                statusCode: 404,
                message: 'Departments tidak ditemukan'
            });
          }

        const existing = await db.select().from(departments).where(eq(
            departments.id, id
        )).limit(1);
        if (!existing[0]) {
            return next ({
                statusCode: 404,
                message: 'Departments Tidak ditemukan'
            });
        }

        await db.delete(departments).where(eq(
            departments.id, id
        ));
        return res.json({ Message: 'Departments berhasil dihapus '});
    } catch (error) {
        return next(error);
    }
}