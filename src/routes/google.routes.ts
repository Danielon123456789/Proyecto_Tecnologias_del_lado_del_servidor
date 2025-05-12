import { Router } from 'express';
import passport from 'passport';
import '../config/passport'; // asegúrate de que se ejecute la config
import { googleCallback } from '../controllers/authGoogle';

const router = Router();

// Redirección a Google para login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback después de login
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

export default router;
