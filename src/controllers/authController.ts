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
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email dan password wajib diisi', 400);
    }

    // 1. Cari data karyawan yang didaftarkan oleh Admin
    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.email, email))
      .limit(1);

    const user = existingEmployee[0];

    if (!user) {
      throw new AppError('Email belum terdaftar oleh Admin. Silakan hubungi Admin.', 404);
    }

    if (user.password) {
      throw new AppError('Akun sudah terdaftar/aktif. Silakan melakukan login.', 400);
    }

    // 2. Hash password & update data
    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(employees)
      .set({ password: hashedPassword })
      .where(eq(employees.email, email));

    return res.status(200).json({
      success: true,
      message: 'Aktivasi akun/Register berhasil! Silakan login.'
    });
  } catch (error) {
    // Semua error dilempar ke errorHandler milikmu
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email dan password wajib diisi', 400);
    }

    // 1. Cari karyawan berdasarkan email
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

    // 2. Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError('Email atau password salah', 401);
    }

    // 3. Buat Payload & Token
    const payload: JwtPayload = {
      id: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      token
    });
  } catch (error) {
    // Dilempar ke errorHandler
    next(error);
  }
};