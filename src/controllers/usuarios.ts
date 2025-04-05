import { Request, Response} from 'express'
import jwt from 'jsonwebtoken';
import usermodel from "../models/User";
import { IGetUserAuthInfoRequest } from '../types/request';
import { HttpStatus} from '../types/http-status'

const JWT_SECRET = process.env.JWT_SECRET?? "";

// Controlador para el login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, contrasena } = req.body;

        const user = await usermodel.findOne({ email });

        if (!user) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Nombre incorrecto o usuario no existente" });
            return;
        }

        if (contrasena !== user.contrasena) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "Contraseña incorrecta" });
            return;
        }

        const token = jwt.sign({ id: user._id, email: user.email, rol: user.rol }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};

// Controlador para el perfil
export async function perfil(req: IGetUserAuthInfoRequest, res: Response): Promise<void> {
    if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Usuario no autenticado' });
        return;
    }

    try {
        const usuario = await usermodel.findById(req.user.id).select("nombre"); // Solo obtenemos el nombre

        if (!usuario) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: "Usuario no encontrado" });
            return;
        }

        res.json({ nombre: usuario.nombre });

    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error al obtener el perfil", error });
    }
}

export const register = async (req: Request, res: Response): Promise<void> => {
    try {


        const { nombre, email, contrasena } = req.body;

        const userExists = await usermodel.findOne({ email });

        if (userExists) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: "El usuario ya está registrado" });
            return;
        }

        const newUser = new usermodel({ nombre, email, contrasena });

        await newUser.save();

        res.status(HttpStatus.CREATED).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error en el servidor", error });
    }
};

export function logout(req: Request, res: Response){
    res.send("sale de la cuenta")
}

