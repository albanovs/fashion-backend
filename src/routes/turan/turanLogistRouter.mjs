import express from 'express';
const router = express.Router();
import turanLogistSimController from '../../controllers/turan/turanLogistSimController.mjs';

router.post('/insert/simcardturanlog', turanLogistSimController.CreateTableSim)
router.post('/insert/slotturanlog', turanLogistSimController.updateSimLog)
router.get('/test/simCardTuranLogs', turanLogistSimController.getLogistSim)
router.patch('/update/simCardTuranLogs', turanLogistSimController.updateDateLogist)

export default router