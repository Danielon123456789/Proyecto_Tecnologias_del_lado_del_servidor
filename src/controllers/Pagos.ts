import { Request, Response} from 'express'

export function checkout(req: Request, res: Response) {
    res.send("inicia proceso de pago");
}

export function confirmarPago(req: Request, res: Response) {
    res.send("confirma el pago realizado");
}

export function historialPagos(req: Request, res: Response) {
    res.send("devuelve historial de pagos");
}
