import { Router } from 'express';
import { login, perfil, register, logout } from '../controllers/usuarios';
import { getProductos, getProducto, crearProducto, editarProducto, eliminarProducto, buscarProductos, productosPorCategoria } from '../controllers/Productos';
import { verCarrito, agregarAlCarrito, eliminarDelCarrito, comprar, historialCompras } from '../controllers/Carrito';
import { getUsuarios, eliminarUsuario, getProductosReportados, eliminarProductoAdmin } from '../controllers/Admin';
import { checkout, confirmarPago, historialPagos } from '../controllers/Pagos';
import { authenticateToken } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isadmin';


const router = Router();




/**
 * @swagger
 * /register:
 *   post:
 *     description: Registra un nuevo usuario en el sistema.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *             required:
 *               - nombre
 *               - email
 *               - contrasena
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: El usuario ya está registrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/register', register);


router.post('/login', login);
router.post('/auth/logout', authenticateToken, logout);
router.get('/perfil', authenticateToken, perfil);
router.patch('/auth/perfil', authenticateToken, perfil); // Actualizar perfil
router.delete('/auth/eliminar-cuenta', authenticateToken, perfil); // Eliminar cuenta

// Gestión de Productos

router.get('/productos', getProductos);

router.get('/productos/:id', getProducto);

router.post('/productos', authenticateToken, crearProducto);
router.patch('/productos/:id', authenticateToken, editarProducto);
router.delete('/productos/:id', authenticateToken, eliminarProducto);
router.get('/productos/categoria/:categoria', productosPorCategoria);
router.get('/productos/busqueda', buscarProductos);

// Compras y Carrito
router.get('/carrito', authenticateToken, verCarrito);
router.post('/carrito/agregar', authenticateToken, agregarAlCarrito);
router.delete('/carrito/eliminar/:id', authenticateToken, eliminarDelCarrito);
router.post('/comprar', authenticateToken, comprar);
router.get('/compras/historial', authenticateToken, historialCompras);

// Administración (Admin)
router.get('/admin/usuarios', authenticateToken, isAdmin, getUsuarios);
router.delete('/admin/usuarios/:id', authenticateToken, isAdmin, eliminarUsuario);
router.get('/admin/productos-reportados', authenticateToken, isAdmin, getProductosReportados);
router.delete('/admin/productos/:id', authenticateToken, isAdmin, eliminarProductoAdmin);

// Pagos (Stripe y Shopify API)
router.post('/pagos/checkout', authenticateToken, checkout);
router.get('/pagos/confirmar/:id', authenticateToken, confirmarPago);
router.get('/pagos/historial', authenticateToken, historialPagos);

export default router;
