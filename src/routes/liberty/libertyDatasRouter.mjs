import express from 'express';
const router = express.Router();
import newOtdelDataController from '../../controllers/liberty/LibertyDatasController.mjs';

router.post('/test/libertydatas', newOtdelDataController.createNewOtdelData);
router.get('/test/libertydatas', newOtdelDataController.getNewOtdelData);
router.patch('/updateDataliberty/:id', newOtdelDataController.updateNewOtdelData);

export default router;