import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../types/request';
import { HttpStatus } from '../types/http-status';

const JWT_SECRET = process.env.JWT_SECRET as string;

interface JwtPayload {
  id: string;
  email: string;
  rol: string;
}

export function authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): void {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Acceso no autorizado. Token requerido.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || typeof decoded !== 'object' || !decoded) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token inválido.' });
      return;
    }

    const { id, email, rol } = decoded as JwtPayload;

    req.user = { id, email, rol };
    next();
  });
}
