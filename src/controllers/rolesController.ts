import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { roles } from "../db/roles.js";

export async function getAllRoles(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await db.select().from(roles);

    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export async function getRolesById(req: Request,res: Response,next: NextFunction) {
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
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!data[0]) {
      return next({
        statusCode: 404,
        message: "Role tidak ditemukan",
      });
    }

    return res.json(data[0]);
  } catch (error) {
    return next(error);
  }
}

export async function createRoles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { role_name, description } = req.body;

    if (!role_name) {
      return next({
        statusCode: 400,
        message: "Role Name wajib diisi",
      });
    }

    const duplicate = await db
      .select()
      .from(roles)
      .where(eq(roles.role_name, role_name))
      .limit(1);

    if (duplicate[0]) {
      return next({
        statusCode: 409,
        message: "Role Name sudah digunakan",
      });
    }

    await db.insert(roles).values({
      role_name,
      description,
    });

    const created = await db
      .select()
      .from(roles)
      .where(eq(roles.role_name, role_name))
      .limit(1);

    return res.status(201).json(created[0]);
  } catch (error) {
    return next(error);
  }
}

export async function updateRoles(
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

    const { role_name, description } = req.body;

    if (!role_name) {
      return next({
        statusCode: 400,
        message: "Role Name wajib diisi",
      });
    }

    const existing = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!existing[0]) {
      return next({
        statusCode: 404,
        message: "Role tidak ditemukan",
      });
    }

    const duplicate = await db
      .select()
      .from(roles)
      .where(eq(roles.role_name, role_name));

    const duplicateData = duplicate.find((role) => role.id !== id);

    if (duplicateData) {
      return next({
        statusCode: 409,
        message: "Role Name sudah digunakan",
      });
    }

    await db
      .update(roles)
      .set({
        role_name,
        description,
      })
      .where(eq(roles.id, id));

    const updated = await db
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    return res.json(updated[0]);
  } catch (error) {
    return next(error);
  }
}

export async function removeRoles(
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
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!existing[0]) {
      return next({
        statusCode: 404,
        message: "Role tidak ditemukan",
      });
    }

    await db.delete(roles).where(eq(roles.id, id));

    return res.json({
      message: "Role berhasil dihapus",
    });
  } catch (error) {
    return next(error);
  }
}