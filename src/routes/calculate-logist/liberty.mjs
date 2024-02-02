import express from 'express';
const router = express.Router();
import calc_raiting from '../../controllers/calculate-logist/liberty.calc_raiting.mjs'

router.get('/libertycalclogist', calc_raiting.calcRaintingLogistLiberty)

export default router;