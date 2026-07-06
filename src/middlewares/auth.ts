import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { error } from "node:console";

const SECRET_KEY = 'KANGEN_IVAN';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }

    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (error, user) => {
        if (error) return res.sendStatus(403);
        (req.user?.id);
        next();

    });
};