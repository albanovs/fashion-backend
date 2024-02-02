import express from 'express';
const router = express.Router();
import newOtdelOtchetController from '../../controllers/liberty/libertyOtchetController.mjs'

router.post('/newotchet/libertyotchetbeta', newOtdelOtchetController.createOtchet);
router.patch('/update/libertyotchetbetas/:id', newOtdelOtchetController.updateOtchet);
router.patch('/update/libertyotchetbetasitog/:id', newOtdelOtchetController.updateItog);
router.get('/test/libertyotchetbeta', newOtdelOtchetController.getOtchetBeta)
router.delete('/test/libertyotchetbeta', newOtdelOtchetController.deleteOtchetBeta)
router.post('/insert/libertyotchetbeta', newOtdelOtchetController.addSlotOtchet)

export default router;