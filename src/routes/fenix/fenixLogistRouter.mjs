import express from 'express';
const router = express.Router();
import fenixLogistSimController from '../../controllers/fenix/fenixLogistSimController.mjs';

router.post('/insert/simcardfenixlog', fenixLogistSimController.CreateTableSim)
router.post('/insert/slotfenixlog', fenixLogistSimController.updateSimLog)
router.get('/test/simCardFenixLogs', fenixLogistSimController.getLogistSim)
router.patch('/update/simCardFenixLogs', fenixLogistSimController.updateDateLogist)
router.patch('/test/simCardFenixLogs/:id', fenixLogistSimController.editSimTable)
router.patch('/test/logist-curatorFenixLogs/:id', fenixLogistSimController.upDateCurator)
router.delete('/test/logist-deleteSlotFenixLogs/:id', fenixLogistSimController.deleteSlot)

export default router