import { Request, Response} from 'express'

export function verCarrito(req: Request, res: Response) {
    res.send("devuelve el contenido del carrito");
}

export function agregarAlCarrito(req: Request, res: Response) {
    res.send("agrega un producto al carrito");
}

export function eliminarDelCarrito(req: Request, res: Response) {
    res.send("elimina un producto del carrito");
}

export function comprar(req: Request, res: Response) {
    res.send("procesa la compra del carrito");
}

export function historialCompras(req: Request, res: Response) {
    res.send("devuelve el historial de compras");
}
