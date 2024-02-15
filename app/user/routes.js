import { Router } from 'express';

import { signin, signup, getUser } from './controller.js';
import protect from '../utils/protect.js';
const router = Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/user',protect,getUser);

export default router;
