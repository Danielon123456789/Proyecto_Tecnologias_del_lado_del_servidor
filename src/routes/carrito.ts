import { Router } from 'express';
import {
  verCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  comprar,
  historialCompras
} from '../controllers/Carrito';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /carrito:
 *   get:
 *     description: Obtiene el contenido del carrito del usuario autenticado.
 *     tags:
 *       - Carrito
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contenido del carrito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       producto:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           titulo:
 *                             type: string
 *                           precio:
 *                             type: number
 *                       cantidad:
 *                         type: integer
 *                 total:
 *                   type: number
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener el carrito
 */
router.get('/', authenticateToken, verCarrito);

/**
 * @swagger
 * /carrito/agregar:
 *   post:
 *     description: Agrega un producto al carrito del usuario autenticado.
 *     tags:
 *       - Carrito
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: string
 *                 example: "6612f91ee8e9378b48774f44"
 *               cantidad:
 *                 type: integer
 *                 example: 2
 *             required:
 *               - producto_id
 *               - cantidad
 *     responses:
 *       201:
 *         description: Producto agregado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al agregar al carrito
 */
router.post('/agregar', authenticateToken, agregarAlCarrito);

/**
 * @swagger
 * /carrito/eliminar/{id}:
 *   delete:
 *     description: Elimina un producto del carrito del usuario autenticado.
 *     tags:
 *       - Carrito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del producto a eliminar del carrito
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado en el carrito
 *       500:
 *         description: Error al eliminar del carrito
 */
router.delete('/eliminar/:id', authenticateToken, eliminarDelCarrito);

/**
 * @swagger
 * /carrito/comprar:
 *   post:
 *     description: Procesa la compra de los productos en el carrito.
 *     tags:
 *       - Carrito
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metodo_pago:
 *                 type: string
 *                 enum: [tarjeta, paypal, efectivo]
 *                 example: "tarjeta"
 *               punto_encuentro:
 *                 type: string
 *                 example: "Centro comercial A"
 *     responses:
 *       201:
 *         description: Compra realizada exitosamente
 *       400:
 *         description: Carrito vacío
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al procesar la compra
 */
router.post('/comprar', authenticateToken, comprar);

/**
 * @swagger
 * /carrito/historial:
 *   get:
 *     description: Devuelve el historial de compras del usuario autenticado.
 *     tags:
 *       - Carrito
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de compras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   total:
 *                     type: number
 *                   estado:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener historial
 */
router.get('/historial', authenticateToken, historialCompras);

export default router;
