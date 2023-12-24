import express from 'express';
const router = express.Router();
import calc_raiting_manager from '../../controllers/calculate/newotdel.calc_raiting_manager.mjs';

router.get('/newotdelcalcmanager', calc_raiting_manager.calcRaintingManagerNewOtdel)

export default router;