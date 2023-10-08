import express from 'express';
const router = express.Router();
import monacoOtchetController from '../../controllers/monaco/monacoOtchetController.mjs';

router.post('/newotchet/monacootchetbeta', monacoOtchetController.createOtchet)
router.patch('/update/monacootchetbetas/:id', monacoOtchetController.updateOtchet)
router.patch('/update/monacootchetbetasitog/:id', monacoOtchetController.updateItog)
router.get('/test/monacootchetbeta', monacoOtchetController.getOtchetBeta)
router.delete('/test/monacootchetbeta', monacoOtchetController.deleteOtchetBeta)
router.post('/insert/monacootchetbeta', monacoOtchetController.addSlotOtchet)


export default router
