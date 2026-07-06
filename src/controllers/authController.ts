import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { employee } from '../employees.js';

const SECRET_KEY = 'KANGEN_IVAN';

interface JwtPayload {
    id: number;
    email: string;
}

export const register = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(employee).values({
            email, 
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Register berhasil'
        });
    } catch (error) {
        res.status(500).json ({
            message: 'Gagal register',
            error
        });
    }
};


export const login = async (req: Request, res:Response) => {
    try{
        const { email, password } = req.body;

        const result = await db.select().from(employee).where(eq(
            employee.email, email
        )).limit(1);

        const user = result [0];

        if (!user) {
            return res.status(401).json({
                message: 'Email tidak ditemukan'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Password salah'
            });
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email
        };

        const token = jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Gagal login',
            error
        });
    }
};