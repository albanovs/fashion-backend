import express from 'express';
const router = express.Router();
import calc_raiting_manager from '../../controllers/calculate/monaco.calc_raiting_manager.mjs'

router.get('/monacocalcmanager', calc_raiting_manager.calcRaintingManagerMonaco)
router.get('/monacocalcmanager', calc_raiting_manager.calcRaintingManager30day)

export default router;