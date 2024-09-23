import express from 'express';
const router = express.Router();
import monacoSimBuyerController from '../../controllers/monaco/monacoSimBuyerController.mjs';

router.post('/insert/simcardMonacos', monacoSimBuyerController.createSimTable)
router.post('/insert/simcardMonacoslot', monacoSimBuyerController.addSimSlot)
router.patch('/test/simCardMonacos/:id', monacoSimBuyerController.editSimTable)
router.get('/test/simCardMonacos', monacoSimBuyerController.getSimTable)
router.patch('/update/simcardmonacos', monacoSimBuyerController.updateSimcard)
router.patch('/test/curatorMonacos/:id', monacoSimBuyerController.upDateCurator)
router.delete('/test/deleteSlotMonacos/:id', monacoSimBuyerController.deleteSlot)
router.delete('/test/managerdelete/:id', monacoSimBuyerController.deleteManager)

export default router;