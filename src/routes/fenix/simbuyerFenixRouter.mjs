import express from 'express';
const router = express.Router();
import fenixSimBuyerController from '../../controllers/fenix/fenixSimBuyerController.mjs';

router.post('/insert/simcardFenixes', fenixSimBuyerController.createSimTable)
router.post('/insert/simcardFenixslot', fenixSimBuyerController.addSimSlot)
router.patch('/test/simCardFenixes/:id', fenixSimBuyerController.editSimTable)
router.get('/test/simCardFenixes', fenixSimBuyerController.getSimTable)
router.patch('/update/simcardfenixes', fenixSimBuyerController.updateSimcard)
router.patch('/test/curatorFenixes/:id', fenixSimBuyerController.upDateCurator)
router.delete('/test/deleteSlotFenixes/:id', fenixSimBuyerController.deleteSlot)
router.delete('/test/managerdelete/:id', fenixSimBuyerController.deleteManager)

export default router;