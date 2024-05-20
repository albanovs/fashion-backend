import express from 'express';
const router = express.Router();
import calculateadminlogist from '../../controllers/calculate-adminlogist/calculateadminlogist.mjs';

router.get('/adminlogist', calculateadminlogist.calcRaintingLogistAdmin)

export default router;