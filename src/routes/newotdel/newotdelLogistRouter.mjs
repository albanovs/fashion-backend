import express from 'express';
const router = express.Router();
import newOtdelLogistSimColtroller from '../../controllers/newotdel/newotdelLogistSimColtroller.mjs';

router.post('/insert/simcardnewotdellog', newOtdelLogistSimColtroller.CreateTableSim)
router.post('/insert/slotnewotdellog', newOtdelLogistSimColtroller.updateSimLog)
router.get('/test/simcardnewotdellogs', newOtdelLogistSimColtroller.getLogistSim)
router.patch('/update/simCardNewotdelLogs', newOtdelLogistSimColtroller.updateDateLogist)
router.patch('/test/simCardNewotdelLogs/:id', newOtdelLogistSimColtroller.editSimTable)
router.patch('/test/logist-curatorNewotdelLogs/:id', newOtdelLogistSimColtroller.upDateCurator)
router.delete('/test/logist-deleteSlotNewotdelLogs/:id', newOtdelLogistSimColtroller.deleteSlot)

export default router