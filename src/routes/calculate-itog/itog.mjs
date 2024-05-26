import express from 'express';
const router = express.Router();
import calcItog from '../../controllers/calculate-itogs/calcItog.mjs';
import calcItoglast from '../../controllers/calculate-itogs/lastmonth.mjs';

router.get('/calcitog', calcItog.calcItogs)
router.get('/calcitoglast', calcItoglast.calcItogs)

export default router