import express from 'express';
const router = express.Router();
import turanOtchetController from '../../controllers/turan/turanOtchetController.mjs';

router.post('/newotchet/turanotchetbeta', turanOtchetController.createOtchet)
router.patch('/update/turanotchetbetas/:id', turanOtchetController.updateOtchet)
router.patch('/update/turanotchetbetasitog/:id', turanOtchetController.updateItog)
router.get('/test/turanotchetbeta', turanOtchetController.getOtchetBeta)
router.delete('/test/turanotchetbeta', turanOtchetController.deleteOtchetBeta)
router.post('/insert/turanotchetbeta', turanOtchetController.addSlotOtchet)


export default router