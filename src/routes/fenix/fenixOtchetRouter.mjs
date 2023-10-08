import express from 'express';
const router = express.Router();
import fenixOtchetController from '../../controllers/fenix/fenixOtchetController.mjs';

router.post('/newotchet/fenixotchetbeta', fenixOtchetController.createOtchet)
router.patch('/update/fenixotchetbetas/:id', fenixOtchetController.updateOtchet)
router.patch('/update/fenixotchetbetasitog/:id', fenixOtchetController.updateItog)
router.get('/test/fenixotchetbeta', fenixOtchetController.getOtchetBeta)
router.delete('/test/fenixotchetbeta', fenixOtchetController.deleteOtchetBeta)
router.post('/insert/fenixotchetbeta', fenixOtchetController.addSlotOtchet)


export default router