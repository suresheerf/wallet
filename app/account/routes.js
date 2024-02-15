import { Router } from 'express';
import {createAccount,getAccounts,getAccount} from './controller.js'

const router = new Router();

router.route('/').get(getAccounts).post(createAccount);
router.route('/one').get(getAccount);

export default router;