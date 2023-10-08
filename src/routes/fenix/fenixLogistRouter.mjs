import express from 'express';
const router = express.Router();
import fenixLogistSimController from '../../controllers/fenix/fenixLogistSimController.mjs';

router.post('/insert/simcardfenixlog', fenixLogistSimController.CreateTableSim)
router.post('/insert/slotfenixlog', fenixLogistSimController.updateSimLog)
router.get('/test/simCardFenixLogs', fenixLogistSimController.getLogistSim)
router.patch('/update/simCardFenixLogs', fenixLogistSimController.updateDateLogist)

export default router