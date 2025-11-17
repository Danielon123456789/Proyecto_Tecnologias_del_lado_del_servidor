import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import usermodel from "../models/User";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "No token provided" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    let user = await usermodel.findOne({ email: payload.email });

    if (!user) {
      user = await usermodel.create({
        nombre: payload.name,
        email: payload.email,
        profilePictureUrl: payload.picture,
        googleId: payload.sub,
        contrasena: null
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (err) {
    next(err);
  }
};
