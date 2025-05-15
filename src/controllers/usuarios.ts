// src/controllers/usuarios.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import usermodel from '../models/User';
import { IGetUserAuthInfoRequest } from '../types/request';
import { HttpStatus } from '../types/http-status';

// Usar la variable de entorno o un valor predeterminado para pruebas
const JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_for_unit_tests';

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, contrasena } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user || contrasena !== user.contrasena) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Credenciales incorrectas' });
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error en el servidor', error });
  }
};

// Registro
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, contrasena, rol } = req.body;

    const userExists = await usermodel.findOne({ email });
    if (userExists) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'El usuario ya está registrado' });
      return;
    }

    const newUser = new usermodel({ nombre, email, contrasena, rol: rol || 'usuario' });
    await newUser.save();

    res.status(HttpStatus.CREATED).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error en el servidor', error });
  }
};

// Obtener perfil
export async function perfil(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const user = await usermodel.findById(req.user?.id).select('nombre email rol');

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al obtener el perfil', error });
  }
}

// Actualizar perfil
export async function actualizarPerfil(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const { nombre, email } = req.body;

    const actualizado = await usermodel.findByIdAndUpdate(
      req.user?.id,
      { nombre, email },
      { new: true }
    ).select('nombre email');

    if (!actualizado) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al actualizar perfil', error });
  }
}

// Eliminar cuenta
export async function eliminarCuenta(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
  try {
    const eliminado = await usermodel.findByIdAndDelete(req.user?.id);
    if (!eliminado) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al eliminar cuenta', error });
  }
}

// Logout (simbólico)
export function logout(_req: Request, res: Response): void {
  res.json({ message: 'Sesión cerrada correctamente' });
}