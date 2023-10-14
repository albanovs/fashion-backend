import express from 'express';
const router = express.Router();
import calc_raiting_manager from '../../controllers/calculate/calc_raiting_manager.mjs';

router.get('/lidercalcmanager', calc_raiting_manager.calcRaintingManager)

export default router;