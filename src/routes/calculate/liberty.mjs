import express from 'express';
const router = express.Router();
import calc_raiting_manager from '../../controllers/calculate/newotdelliberty.calc_raiting_manager.mjs';

router.get('/libertycalcmanager', calc_raiting_manager.calcRaintingManagerLiberty)

export default router;