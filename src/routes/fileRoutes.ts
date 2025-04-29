import { Router } from 'express';
import { uploadProfilePicture, uploadProductPicture, deleteFile } from '../controllers/fileController';
import { authenticateToken } from '../middlewares/auth';
import multer from 'multer';

const router = Router();
const upload = multer(); // Almacenamiento en memoria

/**
 * @swagger
 * /files/upload-profile:
 *   post:
 *     summary: Sube una foto de perfil de usuario
 *     tags:
 *       - Archivos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Foto de perfil subida exitosamente
 *       400:
 *         description: No se subió ningún archivo
 *       500:
 *         description: Error al subir la foto de perfil
 */
router.post('/upload-profile', authenticateToken, upload.single('file'), uploadProfilePicture);

/**
 * @swagger
 * /files/upload-product/{productId}:
 *   post:
 *     summary: Sube una imagen para un producto
 *     tags:
 *       - Archivos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID del producto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagen de producto subida exitosamente
 *       400:
 *         description: No se subió ningún archivo
 *       500:
 *         description: Error al subir la imagen del producto
 */
router.post('/upload-product/:productId', authenticateToken, upload.single('file'), uploadProductPicture);

/**
 * @swagger
 * /files/delete-file:
 *   delete:
 *     summary: Elimina un archivo del bucket S3
 *     tags:
 *       - Archivos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: Clave (key) del archivo en S3 a eliminar
 *                 example: users/66123abc123abc123abc1230/profile-1714520360-avatar.jpg
 *     responses:
 *       200:
 *         description: Archivo eliminado exitosamente
 *       400:
 *         description: Falta el key del archivo
 *       500:
 *         description: Error al eliminar el archivo
 */
router.delete('/delete-file', authenticateToken, deleteFile);



export default router;
