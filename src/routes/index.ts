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

/**
 * @swagger
 * /login:
 *   post:
 *     description: Inicia sesión de un usuario existente.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: "Password123"
 *             required:
 *               - email
 *               - contrasena
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error en el servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     description: Cierra la sesión de un usuario.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: No autorizado, token inválido o no proporcionado
 */
router.post('/auth/logout', authenticateToken, logout);

/**
 * @swagger
 * /perfil:
 *   get:
 *     description: Obtiene el perfil del usuario autenticado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get('/perfil', authenticateToken, perfil);

/**
 * @swagger
 * /auth/perfil:
 *   patch:
 *     description: Actualiza el perfil del usuario autenticado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - nombre
 *               - email
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       401:
 *         description: No autorizado, token inválido o no proporcionado
 */
router.patch('/auth/perfil', authenticateToken, perfil); // Actualizar perfil

/**
 * @swagger
 * /auth/eliminar-cuenta:
 *   delete:
 *     description: Elimina la cuenta del usuario autenticado.
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta eliminada correctamente
 *       401:
 *         description: No autorizado, token inválido o no proporcionado
 */
router.delete('/auth/eliminar-cuenta', authenticateToken, perfil); // Eliminar cuenta

// Gestión de Productos

/**
 * @swagger
 * /productos:
 *   get:
 *     description: Obtiene un listado de todos los productos.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Número máximo de productos a retornar
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *         description: Número de página para la paginación
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: number
 *                   descripcion:
 *                     type: string
 *                   categoria:
 *                     type: string
 *                   imagen:
 *                     type: string
 *                   vendedor:
 *                     type: string
 *       500:
 *         description: Error en el servidor
 */
router.get('/productos', getProductos);

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     description: Obtiene un producto específico por su ID.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a consultar
 *     responses:
 *       200:
 *         description: Datos del producto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 precio:
 *                   type: number
 *                 descripcion:
 *                   type: string
 *                 categoria:
 *                   type: string
 *                 imagen:
 *                   type: string
 *                 vendedor:
 *                   type: string
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/productos/:id', getProducto);

/**
 * @swagger
 * /productos:
 *   post:
 *     description: Crea un nuevo producto.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Smartphone XYZ"
 *               precio:
 *                 type: number
 *                 example: 599.99
 *               descripcion:
 *                 type: string
 *                 example: "Smartphone de última generación"
 *               categoria:
 *                 type: string
 *                 example: "Electrónicos"
 *               imagen:
 *                 type: string
 *                 format: url
 *                 example: "https://ejemplo.com/imagen.jpg"
 *             required:
 *               - nombre
 *               - precio
 *               - descripcion
 *               - categoria
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/productos', authenticateToken, crearProducto);

/**
 * @swagger
 * /productos/{id}:
 *   patch:
 *     description: Actualiza un producto existente.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *               imagen:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.patch('/productos/:id', authenticateToken, editarProducto);

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     description: Elimina un producto.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/productos/:id', authenticateToken, eliminarProducto);

/**
 * @swagger
 * /productos/categoria/{categoria}:
 *   get:
 *     description: Obtiene productos filtrados por categoría.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *         description: Categoría por la que filtrar los productos
 *     responses:
 *       200:
 *         description: Lista de productos de la categoría especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: number
 *                   descripcion:
 *                     type: string
 *                   categoria:
 *                     type: string
 *                   imagen:
 *                     type: string
 *       404:
 *         description: No se encontraron productos en esta categoría
 *       500:
 *         description: Error en el servidor
 */
router.get('/productos/categoria/:categoria', productosPorCategoria);

/**
 * @swagger
 * /productos/busqueda:
 *   get:
 *     description: Busca productos según términos o criterios específicos.
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre o descripción del producto)
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Categoría del producto
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: number
 *                   descripcion:
 *                     type: string
 *                   categoria:
 *                     type: string
 *                   imagen:
 *                     type: string
 *       400:
 *         description: Parámetros de búsqueda inválidos
 *       500:
 *         description: Error en el servidor
 */

router.get('/productos/busqueda', buscarProductos);

// Compras y Carrito

/**
 * @swagger
 * /carrito:
 *   get:
 *     description: Obtiene el contenido del carrito del usuario.
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
 *                           nombre:
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
 *         description: Error en el servidor
 */
router.get('/carrito', authenticateToken, verCarrito);

/**
 * @swagger
 * /carrito:
 *   get:
 *     description: Obtiene el contenido del carrito del usuario.
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
 *                           nombre:
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
 *         description: Error en el servidor
 */
router.post('/carrito/agregar', authenticateToken, agregarAlCarrito);

/**
 * @swagger
 * /carrito/eliminar/{id}:
 *   delete:
 *     description: Elimina un producto del carrito.
 *     tags:
 *       - Carrito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar del carrito
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado en el carrito
 *       500:
 *         description: Error en el servidor
 */
router.delete('/carrito/eliminar/:id', authenticateToken, eliminarDelCarrito);

/**
 * @swagger
 * /comprar:
 *   post:
 *     description: Procesa la compra de los productos en el carrito.
 *     tags:
 *       - Carrito
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compra procesada correctamente
 *       400:
 *         description: Carrito vacío
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/comprar', authenticateToken, comprar);

/**
 * @swagger
 * /compras/historial:
 *   get:
 *     description: Obtiene el historial de compras del usuario.
 *     tags:
 *       - Carrito
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de compras del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                   productos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         producto:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             nombre:
 *                               type: string
 *                             precio:
 *                               type: number
 *                         cantidad:
 *                           type: integer
 *                   total:
 *                     type: number
 *                   estado:
 *                     type: string
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get('/compras/historial', authenticateToken, historialCompras);

// Administración (Admin)

/**
 * @swagger
 * /admin/usuarios:
 *   get:
 *     description: Obtiene un listado de todos los usuarios (solo admin).
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   email:
 *                     type: string
 *                   rol:
 *                     type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No es administrador
 *       500:
 *         description: Error en el servidor
 */
router.get('/admin/usuarios', authenticateToken, isAdmin, getUsuarios);

/**
 * @swagger
 * /admin/usuarios/{id}:
 *   delete:
 *     description: Elimina un usuario (solo admin).
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No es administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/admin/usuarios/:id', authenticateToken, isAdmin, eliminarUsuario);

/**
 * @swagger
 * /admin/productos-reportados:
 *   get:
 *     description: Obtiene un listado de productos reportados (solo admin).
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos reportados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   motivo:
 *                     type: string
 *                   reportadoPor:
 *                     type: string
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No es administrador
 *       500:
 *         description: Error en el servidor
 */
router.get('/admin/productos-reportados', authenticateToken, isAdmin, getProductosReportados);

/**
 * @swagger
 * /admin/productos/{id}:
 *   delete:
 *     description: Elimina un producto como administrador.
 *     tags:
 *       - Administración
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - No es administrador
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/admin/productos/:id', authenticateToken, isAdmin, eliminarProductoAdmin);

// Pagos (Stripe y Shopify API)

/**
 * @swagger
 * /pagos/checkout:
 *   post:
 *     description: Inicia el proceso de pago para los items en el carrito.
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
 *               metodoPago:
 *                 type: string
 *                 enum: [tarjeta, paypal]
 *                 example: "tarjeta"
 *             required:
 *               - metodoPago
 *     responses:
 *       200:
 *         description: Sesión de pago iniciada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Carrito vacío o datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/pagos/checkout', authenticateToken, checkout);

/**
 * @swagger
 * /pagos/confirmar/{id}:
 *   get:
 *     description: Confirma un pago procesado y actualiza el estado de la orden.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sesión de pago
 *     responses:
 *       200:
 *         description: Pago confirmado, orden creada
 *       400:
 *         description: Error en la confirmación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sesión de pago no encontrada
 *       500:
 *         description: Error en el servidor
 */
router.get('/pagos/confirmar/:id', authenticateToken, confirmarPago);

/**
 * @swagger
 * /pagos/historial:
 *   get:
 *     description: Obtiene el historial de pagos del usuario.
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   monto:
 *                     type: number
 *                   metodoPago:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.get('/pagos/historial', authenticateToken, historialPagos);

export default router;
