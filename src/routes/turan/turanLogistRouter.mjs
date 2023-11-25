import express from 'express';
const router = express.Router();
import turanLogistSimController from '../../controllers/turan/turanLogistSimController.mjs';

router.post('/insert/simcardturanlog', turanLogistSimController.CreateTableSim)
router.post('/insert/slotturanlog', turanLogistSimController.updateSimLog)
router.get('/test/simCardTuranLogs', turanLogistSimController.getLogistSim)
router.patch('/update/simCardTuranLogs', turanLogistSimController.updateDateLogist)
router.patch('/test/simCardTuranLogs/:id', turanLogistSimController.editSimTable)
router.patch('/test/logist-curatorTurans/:id', turanLogistSimController.upDateCurator)
router.delete('/test/logist-deleteSlotTurans/:id', turanLogistSimController.deleteSlot)

export default router