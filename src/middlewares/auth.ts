// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../types/request';
import { HttpStatus} from '../types/http-status';

// Usar la variable de entorno o un valor predeterminado para pruebas
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_for_unit_tests';

export function authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Acceso no autorizado. Token requerido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded as { id: string; email: string; rol: string };
        next();
    } catch (err) {
        console.error('Error al verificar token:', err);
        console.error('Token recibido:', token);
        console.error('JWT_SECRET usado:', JWT_SECRET);
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token inválido.' });
    }
}