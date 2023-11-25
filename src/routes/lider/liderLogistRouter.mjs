import express from 'express';
const router = express.Router();
import liderLogistSimColtroller from '../../controllers/lider/liderLogistSimColtroller.mjs';

router.post('/insert/simcardliderlog', liderLogistSimColtroller.CreateTableSim)
router.post('/insert/slotliderlog', liderLogistSimColtroller.updateSimLog)
router.get('/test/simcardliderlogs', liderLogistSimColtroller.getLogistSim)
router.patch('/update/simCardLiderLogs', liderLogistSimColtroller.updateDateLogist)
router.patch('/test/simCardLiderLogs/:id', liderLogistSimColtroller.editSimTable)
router.patch('/test/logist-curatorLiderLogs/:id', liderLogistSimColtroller.upDateCurator)
router.delete('/test/logist-deleteSlotLiderLogs/:id', liderLogistSimColtroller.deleteSlot)

export default router