import express from 'express';
const router = express.Router();
import newOtdelOtchetController from '../../controllers/newotdel/newotdelOtchetController.mjs'

router.post('/newotchet/newotdelotchetbeta', newOtdelOtchetController.createOtchet);
router.patch('/update/newotdelotchetbetas/:id', newOtdelOtchetController.updateOtchet);
router.patch('/update/newotdelotchetbetasitog/:id', newOtdelOtchetController.updateItog);
router.get('/test/newotdelotchetbeta', newOtdelOtchetController.getOtchetBeta)
router.delete('/test/newotdelotchetbeta', newOtdelOtchetController.deleteOtchetBeta)
router.post('/insert/newotdelotchetbeta', newOtdelOtchetController.addSlotOtchet)

export default router;