import express from 'express';
const router = express.Router();
import calc_raiting_manager from '../../controllers/calculate/turan.calc_raiting_manager.mjs'

router.get('/turancalcmanager', calc_raiting_manager.calcRaintingManagerTuran)

export default router;