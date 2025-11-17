import { Router } from 'express';
import { googleAuth } from '../controllers/authGoogle';

const router = Router();

router.post('/', googleAuth);

export default router;
