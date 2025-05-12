import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import usermodel from '../models/User';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(null, false);

        let user = await usermodel.findOne({ email });

        if (!user) {
          user = await usermodel.create({
            nombre: profile.displayName,
            email: email,
            contrasena: 'google',
            profilePictureUrl: profile.photos?.[0].value || '',
            rol: 'usuario',
          });
        }

        // Adaptar el usuario a la interfaz de Express.User
        const customUser = {
          id: user._id.toString(),
          email: user.email,
          rol: user.rol,
        };

        done(null, customUser);
      } catch (error) {
        done(error);
      }
    }
  )
);



passport.serializeUser((user: { id: string; email: string; rol: string }, done) => {
  done(null, user.id); // Solo almacenamos el id (puede ser _id de Mongoose)
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await usermodel.findById(id);
    
    if (!user) {
      return done(null, false); // En caso de que no se encuentre el usuario
    }

    // Adaptamos el usuario para que tenga el tipo correcto
    const customUser = {
      id: user._id.toString(),
      email: user.email,
      rol: user.rol,
    };

    done(null, customUser);
  } catch (error) {
    done(error);
  }
});


export default passport;
