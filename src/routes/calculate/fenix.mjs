import express from 'express';
const router = express.Router();
import calc_raiting_manager from '../../controllers/calculate/fenix.calc_raiting_manager.mjs'

router.get('/fenixcalcmanager', calc_raiting_manager.calcRaintingManagerFenix)

export default router;