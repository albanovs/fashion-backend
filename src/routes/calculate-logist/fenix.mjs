import express from 'express';
const router = express.Router();
import calc_raiting from '../../controllers/calculate-logist/fenix.calc_raiting_manager.mjs'

router.get('/fenixcalclogist', calc_raiting.calcRaintingLogist)

export default router;