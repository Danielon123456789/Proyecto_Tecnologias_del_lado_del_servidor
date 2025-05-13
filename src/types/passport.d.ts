import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      rol: string;
    }

    // Esto asegura que el tipo `user` de `Request` sea el mismo en tu aplicación
    interface Request {
      user?: User; // Aquí extendemos el tipo `Request` de Express para que `user` tenga el tipo correcto.
    }
  }
}

export {}; // Asegúrate de incluir `export {};` para que TypeScript reconozca el archivo como módulo
