import express from 'express';
const router = express.Router();
import liderSimbuyerController from '../../controllers/lider/liderSimbuyerController.mjs'

router.post('/insert/simcards', liderSimbuyerController.createSimTable)
router.post('/insert/slots', liderSimbuyerController.addSimSlot)
router.patch('/test/simCardLiders/:id', liderSimbuyerController.editSimTable)
router.get('/test/simCardLiders', liderSimbuyerController.getSimTable)
router.patch('/update/simcards', liderSimbuyerController.updateSimcard)

export default router;