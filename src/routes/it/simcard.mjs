import express from 'express';
const router = express.Router();
import globalsimController from '../../controllers/it/simcard.mjs'

router.post('/insert/simcardsglobal', globalsimController.createSimTable)
router.post('/insert/slotsglobal', globalsimController.addSimSlot)
router.patch('/test/simCardglobal/:id', globalsimController.editSimTable)
router.get('/test/simCardglobal', globalsimController.getSimTable)
router.patch('/update/simcardsglobal', globalsimController.updateSimcard)
router.patch('/test/curatorglobal/:id', globalsimController.upDateCurator)
router.delete('/test/deleteSlotglobal/:id', globalsimController.deleteSlot)

export default router;