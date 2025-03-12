import { Request, Response} from 'express'

export function getUsuarios(req: Request, res: Response) {
    res.send("devuelve todos los usuarios");
}

export function eliminarUsuario(req: Request, res: Response) {
    res.send("elimina un usuario");
}

export function getProductosReportados(req: Request, res: Response) {
    res.send("devuelve productos reportados");
}

export function eliminarProductoAdmin(req: Request, res: Response) {
    res.send("admin elimina un producto");
}