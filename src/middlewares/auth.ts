// src/middlewares/auth.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../types/request';
import { HttpStatus } from '../types/http-status';

// Usar variable de entorno en producción, fallback en testing
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_for_unit_tests';

export function authenticateToken(
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Acceso no autorizado. Token requerido.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as { id: string; email: string; rol: string };
    next();
  } catch (err) {
    if (process.env.NODE_ENV === 'test') {
      console.error('Token inválido (modo test):', err);
    }
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token inválido.' });
  }
}
