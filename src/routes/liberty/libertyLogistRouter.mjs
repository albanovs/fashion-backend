import express from 'express';
const router = express.Router();
import newOtdelLogistSimColtroller from '../../controllers/liberty/LibertyLogistSimColtroller.mjs';

router.post('/insert/simcardlibertylog', newOtdelLogistSimColtroller.CreateTableSim)
router.post('/insert/slotlibertylog', newOtdelLogistSimColtroller.updateSimLog)
router.get('/test/simcardlibertylogs', newOtdelLogistSimColtroller.getLogistSim)
router.patch('/update/simCardLibertyLogs', newOtdelLogistSimColtroller.updateDateLogist)
router.patch('/test/simCardLibertyLogs/:id', newOtdelLogistSimColtroller.editSimTable)
router.patch('/test/logist-curatorLibertyLogs/:id', newOtdelLogistSimColtroller.upDateCurator)
router.delete('/test/logist-deleteSlotLibertyLogs/:id', newOtdelLogistSimColtroller.deleteSlot)
router.delete('/test/logist-deletedocumentliberty/:id', newOtdelLogistSimColtroller.deleteCurator)

export default router