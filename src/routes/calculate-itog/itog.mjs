import express from 'express';
const router = express.Router();
import calcItog from '../../controllers/calculate-itogs/calcItog.mjs';
import calcItoglast from '../../controllers/calculate-itogs/lastmonth.mjs';
import clicked from '../../controllers/calculate-itogs/clicked.mjs';

router.get('/calcitog', calcItog.calcItogs)
router.get('/calcitoglast', calcItoglast.calcItogslast)

router.get('/clicked-datas', clicked.getClickedDatas);
router.post('/increment-clicked', clicked.incrementClickedData);

export default router