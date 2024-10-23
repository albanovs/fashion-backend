import express from 'express';
const router = express.Router();
import managerRaiting from '../../controllers/raiting/manager.mjs';

router.get('/raiting-manager', managerRaiting.getAllManagers)
router.patch('/raiting-manager-percent', managerRaiting.updateWithdrawal)

export default router;