import { Router } from 'express';
import {createAccount,getAccounts} from './controller.js'

const router = new Router();

router.route('/').get(getAccounts).post(createAccount);

export default router;