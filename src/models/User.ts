import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required:true },
    email: { type: String, required:true, unique: true },
    contrasena: { type: String },          // YA NO REQUIRED
    googleId: { type: String },            // NUEVO
    rol: { type: String, default: 'usuario' },
    profilePictureUrl: { type: String, default: '' }
})

const usermodel = mongoose.model("users", UserSchema);

export default usermodel;
