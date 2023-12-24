import express from 'express';
const router = express.Router();
import newOtdelSimbuyerController from '../../controllers/newotdel/newotdelSimbuyerController.mjs'

router.post('/insert/simcardNewOtdel', newOtdelSimbuyerController.createSimTable)
router.post('/insert/simcardNewOtdelslot', newOtdelSimbuyerController.addSimSlot)
router.patch('/test/simCardNewOtdel/:id', newOtdelSimbuyerController.editSimTable)
router.get('/test/simCardNewOtdel', newOtdelSimbuyerController.getSimTable)
router.patch('/update/simcardnewotdel', newOtdelSimbuyerController.updateSimcard)
router.patch('/test/curatorNewOtdel/:id', newOtdelSimbuyerController.upDateCurator)
router.delete('/test/deleteSlotNewOtdel/:id', newOtdelSimbuyerController.deleteSlot)

export default router;