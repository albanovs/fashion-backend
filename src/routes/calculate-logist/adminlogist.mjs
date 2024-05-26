import express from 'express';
const router = express.Router();
import calculateadminlogist from '../../controllers/calculate-adminlogist/calculateadminlogist.mjs';
import calc45days from '../../controllers/calculate-adminlogist/calculatelast45days.mjs'
import stadmin from '../../controllers/calculate/calc-raaiting-month/calc-st_admin.mjs'

router.get('/adminlogistculc', calculateadminlogist.calcRaintingLogistAdmin)
router.get('/stadminraiting', stadmin.getStAdminRaiting)
router.get('/adminculc45days', calc45days.calcRaintingAdmin45days)

export default router;