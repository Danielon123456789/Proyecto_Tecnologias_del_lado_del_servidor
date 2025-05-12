import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IGetUserAuthInfoRequest } from '../types/request';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

export const googleCallback = async (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user || !user.email) {
    res.status(400).json({ mensaje: 'Error al autenticar con Google' });
    return; 
  }

  const token = jwt.sign(
    {
      id: user._id?.toString() || user.id,
      email: user.email,
      rol: user.rol,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};