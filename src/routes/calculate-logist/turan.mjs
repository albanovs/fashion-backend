import express from 'express';
const router = express.Router();
import calc_raiting from '../../controllers/calculate-logist/turan.calc_raiting.mjs'

router.get('/turancalclogist', calc_raiting.calcRaintingLogist)

export default router;