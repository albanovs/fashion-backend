import express from 'express';
const router = express.Router();
import liderOtchetController from '../../controllers/lider/liderOtchetController.mjs'

router.post('/newotchet/liderotchetbeta', liderOtchetController.createOtchet);
router.patch('/update/liderotchetbetas/:id', liderOtchetController.updateOtchet);
router.patch('/update/liderotchetbetasitog/:id', liderOtchetController.updateItog);
router.get('/test/liderotchetbeta', liderOtchetController.getOtchetBeta)
router.delete('/test/liderotchetbeta', liderOtchetController.deleteOtchetBeta)
router.post('/insert/liderotchetbeta', liderOtchetController.addSlotOtchet)

export default router;