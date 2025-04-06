import { Router } from 'express';
import {
  crearOrden,
  getTodasLasOrdenes,
  getOrdenesUsuario,
  getOrden,
  actualizarOrden,
  eliminarOrden
} from '../controllers/Orden';
import { authenticateToken } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isadmin';

const router = Router();

/**
 * @swagger
 * /ordenes:
 *   post:
 *     description: Crea una nueva orden a partir de productos seleccionados.
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: string
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *               metodo_pago:
 *                 type: string
 *                 enum: [tarjeta, paypal, efectivo]
 *               punto_encuentro:
 *                 type: string
 *             required:
 *               - productos
 *               - metodo_pago
 *     responses:
 *       201:
 *         description: Orden creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authenticateToken, crearOrden);

/**
 * @swagger
 * /ordenes/usuario:
 *   get:
 *     description: Obtiene las órdenes realizadas por el usuario autenticado.
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get('/usuario', authenticateToken, getOrdenesUsuario);

/**
 * @swagger
 * /ordenes/admin:
 *   get:
 *     description: Obtiene todas las órdenes del sistema (solo admin).
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos de administrador
 *       500:
 *         description: Error en el servidor
 */
router.get('/admin', authenticateToken, isAdmin, getTodasLasOrdenes);

/**
 * @swagger
 * /ordenes/{id}:
 *   get:
 *     description: Obtiene una orden por su ID.
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la orden
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', authenticateToken, getOrden);

/**
 * @swagger
 * /ordenes/{id}:
 *   patch:
 *     description: Actualiza los datos de una orden existente.
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, pagado, cancelado]
 *               metodo_pago:
 *                 type: string
 *               punto_encuentro:
 *                 type: string
 *     responses:
 *       200:
 *         description: Orden actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.patch('/:id', authenticateToken, actualizarOrden);

/**
 * @swagger
 * /ordenes/{id}:
 *   delete:
 *     description: Elimina una orden existente.
 *     tags:
 *       - Órdenes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden eliminada correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Orden no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', authenticateToken, eliminarOrden);

export default router;
