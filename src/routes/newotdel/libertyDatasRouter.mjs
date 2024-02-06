import express from 'express';
const router = express.Router();
import newOtdelDataController from '../../controllers/newotdel/newotdelDatasController.mjs';

router.post('/test/newotdeldatas', newOtdelDataController.createNewOtdelData);
router.get('/test/newotdeldatas', newOtdelDataController.getNewOtdelData);
router.patch('/updateDatanewotdel/:id', newOtdelDataController.updateNewOtdelData);

export default router;