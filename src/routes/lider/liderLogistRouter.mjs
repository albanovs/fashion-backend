import express from 'express';
const router = express.Router();
import liderLogistSimColtroller from '../../controllers/lider/liderLogistSimColtroller.mjs';

router.post('/insert/simcardliderlog', liderLogistSimColtroller.CreateTableSim)
router.post('/insert/slotliderlog', liderLogistSimColtroller.updateSimLog)
router.get('/test/simcardliderlogs', liderLogistSimColtroller.getLogistSim)
router.patch('/update/simCardLiderLogs', liderLogistSimColtroller.updateDateLogist)

export default router