import express from 'express';
const router = express.Router();
import calcManager from '../../controllers/calculate/calc-raaiting-month/calc-manager.mjs';

router.get('/raitingmanager', calcManager.getManagerRaiting)
router.get('/raitingbuyer', calcManager.getBuyerRaiting)

export default router;