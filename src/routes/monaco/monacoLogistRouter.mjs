import express from 'express';
const router = express.Router();
import monacoLogistSimController from '../../controllers/monaco/monacoLogistSimController.mjs';

router.post('/insert/simcardmonacolog', monacoLogistSimController.CreateTableSim)
router.post('/insert/slotmonacolog', monacoLogistSimController.updateSimLog)
router.get('/test/simCardMonacoLogs', monacoLogistSimController.getLogistSim)
router.patch('/update/simCardMonacoLogs', monacoLogistSimController.updateDateLogist)
router.patch('/test/simCardMonacoLogs/:id', monacoLogistSimController.editSimTable)
router.patch('/test/logist-curatorMonacoLogs/:id', monacoLogistSimController.upDateCurator)
router.delete('/test/logist-deleteSlotMonacoLogs/:id', monacoLogistSimController.deleteSlot)

export default router