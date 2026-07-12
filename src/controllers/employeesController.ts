import type { Request, Response, NextFunction } from "express";
import { eq, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { employees } from "../db/employees.js";

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export async function getAll(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await db.select().from(employees);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return next({
        statusCode: 400,
        message: "Id harus berupa angka",
      });
    }

    const data = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    if (!data[0]) {
      return next({
        statusCode: 404,
        message: "Employee tidak ditemukan",
      });
    }

    return res.json(data[0]);
  } catch (error) {
    return next(error);
  }
}

export async function createEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      employee_code,
      full_name,
      no_phone,
      department_id,
      role_id,
    } = req.body;

    if (!employee_code || !full_name || !no_phone) {
      return next({
        statusCode: 400,
        message: "Employee Code, Full Name dan No Phone wajib diisi",
      });
    }

    const duplicate = await db
      .select()
      .from(employees)
      .where(eq(employees.employee_code, employee_code))
      .limit(1);

    if (duplicate[0]) {
      return next({
        statusCode: 409,
        message: "Employee Code sudah digunakan",
      });
    }

    await db.insert(employees).values({
      employee_code,
      full_name,
      no_phone,
      department_id,
      role_id,
      status: "Inactive",
    });

    const created = await db
      .select()
      .from(employees)
      .where(eq(employees.employee_code, employee_code))
      .limit(1);

    return res.status(201).json(created[0]);
  } catch (error) {
    return next(error);
  }
}

export async function updateEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return next({
        statusCode: 400,
        message: "Id harus berupa angka",
      });
    }

    const {
      employee_code,
      full_name,
      name,
      email,
      password,
      no_phone,
      photo,
      department_id,
      role_id,
      status,
    } = req.body;

    if (!employee_code || !full_name || !no_phone) {
      return next({
        statusCode: 400,
        message: "Employee Code, Full Name dan No Phone wajib diisi",
      });
    }

    if (email && !isValidEmail(email)) {
      return next({
        statusCode: 400,
        message: "Format email tidak valid",
      });
    }

    const existing = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    if (!existing[0]) {
      return next({
        statusCode: 404,
        message: "Employee tidak ditemukan",
      });
    }

    const duplicate = await db
      .select()
      .from(employees)
      .where(
        or(
          eq(employees.employee_code, employee_code),
          email ? eq(employees.email, email) : eq(employees.employee_code, "")
        )
      );

    const duplicateData = duplicate.find((e) => e.id !== id);

    if (duplicateData) {
      return next({
        statusCode: 409,
        message: "Employee Code atau Email sudah digunakan",
      });
    }

    await db
      .update(employees)
      .set({
        employee_code,
        full_name,
        name,
        email,
        password,
        no_phone,
        photo,
        department_id,
        role_id,
        status,
        updated_at: new Date(),
      })
      .where(eq(employees.id, id));

    const updated = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    return res.json(updated[0]);
  } catch (error) {
    return next(error);
  }
}

export async function removeEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return next({
        statusCode: 400,
        message: "Id harus berupa angka",
      });
    }

    const existing = await db
      .select()
      .from(employees)
      .where(eq(employees.id, id))
      .limit(1);

    if (!existing[0]) {
      return next({
        statusCode: 404,
        message: "Employee tidak ditemukan",
      });
    }

    await db.delete(employees).where(eq(employees.id, id));

    return res.json({
      message: "Employee berhasil dihapus",
    });
  } catch (error) {
    return next(error);
  }
}