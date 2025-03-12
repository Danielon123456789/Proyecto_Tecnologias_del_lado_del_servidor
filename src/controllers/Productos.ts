
import { Request, Response} from 'express'


export function getProductos(req: Request, res: Response) {
    res.send("devuelve todos los productos");
}

export function getProducto(req: Request, res: Response) {
    res.send("devuelve un producto por ID");
}

export function crearProducto(req: Request, res: Response) {
    res.send("crea un nuevo producto");
}

export function editarProducto(req: Request, res: Response) {
    res.send("edita un producto existente");
}

export function eliminarProducto(req: Request, res: Response) {
    res.send("elimina un producto");
}

export function productosPorCategoria(req: Request, res: Response) {
    res.send("devuelve productos por categoría");
}

export function buscarProductos(req: Request, res: Response) {
    res.send("busca productos según criterios");
}