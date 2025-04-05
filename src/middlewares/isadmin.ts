import { Request, Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from '../types/request';
import { HttpStatus} from '../types/http-status'


export function isAdmin(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): void {
    if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Acceso no autorizado." });
        return;
    }

    if (req.user.rol !== "admin") {
        res.status(HttpStatus.FORBIDDEN).json({ message: "No tienes permisos para realizar esta acción." });
        return;
    }

    next(); 
}
