import { Request } from 'express';

// Extiende la interfaz global de Express.User para que tenga los campos correctos
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      rol: string;
    }

    // Esto extiende la interfaz Request de Express para incluir `user`
    interface Request {
      user?: User;
    }
  }
}

// Define tu tipo personalizado para `Request`
export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    id: string;
    email: string;
    rol: string;
  };
}

export {}; // Asegúrate de exportar para evitar conflictos globales
