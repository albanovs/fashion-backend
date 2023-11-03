import express from 'express';
const router = express.Router();
import calc_raiting_manager from '../../controllers/calculate/turan.calc_raiting_manager.mjs'

router.get('/turancalcmanager', calc_raiting_manager.calcRaintingManagerTuran)
router.get('/turancalcmanager30day', calc_raiting_manager.calcRaintingManager30day)

export default router;