import express from 'express';
const router = express.Router();
import turanDatasController from '../../controllers/turan/turanDatasController.mjs';

router.post('/test/turandatas', turanDatasController.createTuranData)
router.get('/test/turandatas', turanDatasController.getTuranData)
router.patch('/updateDataturan/:id', turanDatasController.updateTuranData)

export default router