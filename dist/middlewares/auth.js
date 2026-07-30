import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET || 'KANGEN_IVAN';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.'
        });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Token tidak valid atau sudah kadaluarsa.'
            });
        }
        req.user = decoded;
        next();
    });
};
//# sourceMappingURL=auth.js.map