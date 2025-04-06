import { Router } from 'express';
import {
  checkout,
  confirmarPago,
  historialPagos,
  getPago,
  eliminarPago
} from '../controllers/Pagos';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /pagos/checkout:
 *   post:
 *     description: Inicia el proceso de pago para una orden.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden_id:
 *                 type: string
 *                 example: "6612f91ee8e9378b48774f44"
 *               metodo_pago:
 *                 type: string
 *                 enum: [tarjeta, paypal]
 *                 example: "tarjeta"
 *               monto:
 *                 type: number
 *                 example: 129.99
 *             required:
 *               - orden_id
 *               - metodo_pago
 *               - monto
 *     responses:
 *       201:
 *         description: Pago iniciado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al iniciar el pago
 */
router.post('/checkout', authenticateToken, checkout);

/**
 * @swagger
 * /pagos/confirmar/{id}:
 *   get:
 *     description: Confirma un pago ya procesado por un proveedor externo.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pago a confirmar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago confirmado y orden actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error al confirmar pago
 */
router.get('/confirmar/:id', authenticateToken, confirmarPago);

/**
 * @swagger
 * /pagos/historial:
 *   get:
 *     description: Obtiene el historial de pagos del usuario autenticado.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagos realizados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orden_id:
 *                     type: string
 *                   monto:
 *                     type: number
 *                   estado:
 *                     type: string
 *                   fecha_pago:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener historial
 */
router.get('/historial', authenticateToken, historialPagos);

/**
 * @swagger
 * /pagos/{id}:
 *   get:
 *     description: Obtiene los detalles de un pago por su ID.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pago
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del pago
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error al obtener el pago
 */
router.get('/:id', authenticateToken, getPago);

/**
 * @swagger
 * /pagos/{id}:
 *   delete:
 *     description: Elimina un pago del sistema.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del pago a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error al eliminar el pago
 */
router.delete('/:id', authenticateToken, eliminarPago);

export default router;
