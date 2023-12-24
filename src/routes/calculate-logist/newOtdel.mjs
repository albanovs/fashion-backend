import express from 'express';
const router = express.Router();
import calc_raiting from '../../controllers/calculate-logist/newotdel.calc_raiting.mjs'

router.get('/newotdelcalclogist', calc_raiting.calcRaintingLogistNewOtdel)

export default router;