import express from 'express';
const router = express.Router();
import newOtdelSimbuyerController from '../../controllers/liberty/libertySimbuyerController.mjs'

router.post('/insert/simcardLiberty', newOtdelSimbuyerController.createSimTable)
router.post('/insert/simcardLibertyslot', newOtdelSimbuyerController.addSimSlot)
router.patch('/test/simCardLiberty/:id', newOtdelSimbuyerController.editSimTable)
router.get('/test/simCardLiberty', newOtdelSimbuyerController.getSimTable)
router.patch('/update/simcardliberty', newOtdelSimbuyerController.updateSimcard)
router.patch('/test/curatorLiberty/:id', newOtdelSimbuyerController.upDateCurator)
router.delete('/test/deleteSlotLiberty/:id', newOtdelSimbuyerController.deleteSlot)

export default router;