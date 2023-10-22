import express from 'express';
const router = express.Router();
import calc_raiting from '../../controllers/calculate-logist/liders.calc_raiting.mjs'

router.get('/lidercalclogist', calc_raiting.calcRaintingLogist)

export default router;