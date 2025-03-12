import { Request, Response} from 'express'

export function login(req: Request, res: Response){
     res.send('login');
}

export function perfil( req: Request, res: Response){
    res.send("devuelve el perfil ")
}

export function register(req: Request, res: Response){
    res.send("registra usuario")
}

export function logout(req: Request, res: Response){
    res.send("sale de la cuenta")
}

