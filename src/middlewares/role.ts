import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../types/http-status';

const user = {
    id:1,
    role: 'admin'
}


export function role(roles: string[]){ 

    return function (req: Request, res: Response, next: NextFunction){
        if (roles.includes(user.role)){
            next();
        }else{
            res.status(HttpStatus.FORBIDDEN).send('No tienes permisos suficientes');
        }
    }
}