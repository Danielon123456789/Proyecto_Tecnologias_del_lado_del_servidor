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
 *     summary: Iniciar un proceso de pago con Stripe
 *     tags: [Pagos]
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
 *                 example: "663eb63d7f1f8c2d1b8d5d1c"
 *               monto:
 *                 type: number
 *                 example: 499.99
 *               metodo_pago:
 *                 type: string
 *                 example: "stripe"
 *     responses:
 *       201:
 *         description: URL para redirigir al usuario a la plataforma de pago
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://checkout.stripe.com/pay/cs_test_..."
 *       404:
 *         description: Orden no encontrada o no autorizada
 *       500:
 *         description: Error al iniciar el pago
 */

router.post('/checkout', authenticateToken, checkout);

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
