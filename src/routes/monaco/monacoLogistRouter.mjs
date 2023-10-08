import express from 'express';
const router = express.Router();
import monacoLogistSimController from '../../controllers/monaco/monacoLogistSimController.mjs';

router.post('/insert/simcardmonacolog', monacoLogistSimController.CreateTableSim)
router.post('/insert/slotmonacolog', monacoLogistSimController.updateSimLog)
router.get('/test/simCardMonacoLogs', monacoLogistSimController.getLogistSim)
router.patch('/update/simCardMonacoLogs', monacoLogistSimController.updateDateLogist)

export default router