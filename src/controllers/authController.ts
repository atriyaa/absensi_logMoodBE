import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { employees } from '../db/employees.js';

const SECRET_KEY = process.env.JWT_SECRET || 'KANGEN_IVAN';

interface JwtPayload {
  id: number;
  email: string | null;
  name: string | null;
  role: number | null;
}

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {full_name, name, email, password } = req.body;

    if (!full_name ||!name || !email || !password) {
      throw new AppError('Email dan password wajib diisi', 400);
    }

    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.full_name, full_name))
      .limit(1);

    const user = existingEmployee[0];
    
    if (!user) {
      throw new AppError('Karyawan belum terdaftar oleh Admin. Silakan hubungi Admin.', 404);
    }

    if (user.password) {
      throw new AppError('Akun sudah terdaftar/aktif. Silakan melakukan login.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(employees)
      .set({ password: hashedPassword, name: name, email: email, status:"Active"})
      .where(eq(employees.full_name, full_name));

    return res.status(200).json({
      success: true,
      message: 'Aktivasi akun/Register berhasil! Silakan login.'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email dan password wajib diisi', 400);
    }

    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.email, email))
      .limit(1);

    const user = result[0];

    if (!user) {
      throw new AppError('Email atau password salah', 401);
    }

    if (!user.password) {
      throw new AppError('Akun belum diaktifkan. Silakan lakukan register/aktivasi terlebih dahulu.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError('Email atau password salah', 401);
    }
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role_id
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employeeId = (req as any).user?.id;

    if (!employeeId) {
      throw new AppError('Unauthorized', 401);
    }

    const { name } = req.body;

    if (!name || !name.trim()) {
      throw new AppError('Nama tidak boleh kosong', 400);
    }

    await db
      .update(employees)
      .set({ full_name: name.trim(), name: name.trim() })
      .where(eq(employees.id, employeeId));

    return res.status(200).json({
      success: true,
      message: 'Nama berhasil diperbarui',
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employeeId = (req as any).user?.id;

    if (!employeeId) {
      throw new AppError('Unauthorized', 401);
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new AppError('Password lama dan password baru wajib diisi', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('Password baru minimal 6 karakter', 400);
    }

    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);

    const user = result[0];

    if (!user || !user.password) {
      throw new AppError('Akun tidak ditemukan', 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new AppError('Password lama tidak sesuai', 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db
      .update(employees)
      .set({ password: hashed })
      .where(eq(employees.id, employeeId));

    return res.status(200).json({
      success: true,
      message: 'Password berhasil diubah',
    });
  } catch (error) {
    next(error);
  }
};