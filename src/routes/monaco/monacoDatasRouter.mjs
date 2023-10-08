import express from 'express';
const router = express.Router();
import monacoDatasController from '../../controllers/monaco/monacoDatasController.mjs';

router.post('/test/monacodatas', monacoDatasController.createMonacoData)
router.get('/test/monacodatas', monacoDatasController.getMoncaoData)
router.patch('/updateDatamonaco/:id', monacoDatasController.updateMonacoData)

export default router