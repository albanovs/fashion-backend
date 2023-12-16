import express from 'express';
const router = express.Router();
import liderDataController from '../../controllers/lider/liderDatasController.mjs'; // Используем .mjs

router.post('/test/liderdatas', liderDataController.createLiderData);
router.get('/test/liderdatas', liderDataController.getLiderData);
router.patch('/updateDatalider/:id', liderDataController.updateLiderData);

export default router;
