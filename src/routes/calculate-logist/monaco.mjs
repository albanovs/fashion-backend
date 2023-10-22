import express from 'express';
const router = express.Router();
import calc_raiting from '../../controllers/calculate-logist/monaco.calc_raiting_manager.mjs'

router.get('/monacocalclogist', calc_raiting.calcRaintingLogist)

export default router;