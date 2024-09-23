import express from 'express';
const router = express.Router();
import turanSimBuyerController from '../../controllers/turan/turanSimBuyerController.mjs';

router.post('/insert/simcardTurans', turanSimBuyerController.createSimTable)
router.post('/insert/simcardTuranslot', turanSimBuyerController.addSimSlot)
router.patch('/test/simCardTurans/:id', turanSimBuyerController.editSimTable)
router.get('/test/simCardTurans', turanSimBuyerController.getSimTable)
router.patch('/update/simcardturans', turanSimBuyerController.updateSimcard)
router.patch('/test/curatorTurans/:id', turanSimBuyerController.upDateCurator)
router.delete('/test/deleteSlotTurans/:id', turanSimBuyerController.deleteSlot)
router.delete('/test/managerdelete/:id', turanSimBuyerController.deleteManager)

export default router;