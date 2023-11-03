import { Router } from "express";

import {newTransaction,getTransactions} from './controller.js'

const router = new Router();

router.route('/').get(getTransactions).post(newTransaction);

export default router;