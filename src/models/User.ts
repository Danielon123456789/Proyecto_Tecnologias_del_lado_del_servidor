
import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required:true},
    email: { type: String, required:true, unique: true},
    contrasena: { type: String, required: true},
    rol: {type: String, default: 'usuario'},
})

const usermodel = mongoose.model("users", UserSchema);

export default usermodel;