import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../types/request';
import { HttpStatus} from '../types/http-status'

const JWT_SECRET = process.env.JWT_SECRET as string;


export function authenticateToken(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Acceso no autorizado. Token requerido.' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token inválido.' });
            return;
        }

        req.user = user as { id: string; email: string; rol: string };;

        next();
    });
}